import { NextRequest, NextResponse } from "next/server";
import { geocodeAddress } from "@/lib/geocode/census";
import { plutoBoroughForCounty } from "@/lib/parcelSearch/nycBoroughs";
import { ParcelField, ParcelResult, ParcelSearchResult } from "@/lib/parcelSearch/types";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSessionValue } from "@/lib/auth";

interface RequestBody {
  address?: string;
}

const FETCH_HEADERS = {
  Accept: "application/json",
  "User-Agent": "Mozilla/5.0 (compatible; ManfredSMARTBoard/1.0; +https://tools.manfredrelc.com)",
};

function pickField(
  attrs: Record<string, unknown>,
  candidates: string[],
  label: string,
  formatter?: (v: unknown) => string
): ParcelField | null {
  for (const key of candidates) {
    const actualKey = Object.keys(attrs).find((k) => k.toLowerCase() === key.toLowerCase());
    if (actualKey !== undefined) {
      const v = attrs[actualKey];
      if (v !== null && v !== undefined && v !== "") {
        try {
          return { label, value: formatter ? formatter(v) : String(v) };
        } catch {
          return { label, value: String(v) };
        }
      }
    }
  }
  return null;
}

// NYS ITS Geospatial Services' public statewide parcel layer. Layer 1 is
// the parcel polygons themselves (layer 0 is a county-coverage footprint).
const NYS_PARCELS_LAYER_URL = "https://gisservices.its.ny.gov/arcgis/rest/services/NYS_Tax_Parcels_Public/MapServer/1";

function extractHouseNumber(address: string): string | null {
  const match = address.trim().match(/^(\d+[\d-]*)/);
  return match ? match[1] : null;
}

async function queryNysParcels(lat: number, lon: number, searchedAddress: string): Promise<ParcelResult | null> {
  const buffer = 0.0004; // ~35m, forgiving of geocoder precision
  const envelope = `${lon - buffer},${lat - buffer},${lon + buffer},${lat + buffer}`;
  const url =
    `${NYS_PARCELS_LAYER_URL}/query` +
    `?geometry=${envelope}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects` +
    `&outFields=*&returnGeometry=false&f=json`;

  const res = await fetch(url, { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`NYS parcel service returned ${res.status}`);
  const data = await res.json();
  if (data?.error) throw new Error(`NYS parcel service error: ${JSON.stringify(data.error).slice(0, 200)}`);

  const attrs: Record<string, unknown> | undefined = data?.features?.[0]?.attributes;
  if (!attrs) return null;

  const siteAddressField = pickField(attrs, ["PARCEL_ADDR", "SITE_ADDRESS", "PROP_LOC", "LOCATION", "ADDRESS"], "Site Address");

  const fields = [
    pickField(attrs, ["PRINT_KEY", "SBL", "TAX_MAP_NUMBER", "PARCEL_ID"], "Parcel ID"),
    siteAddressField,
    pickField(attrs, ["MUNI_NAME", "MUNICIPALITY", "CITY_TOWN"], "Municipality"),
    pickField(attrs, ["CALC_ACREAGE", "ACRES", "GIS_ACRES", "DEEDED_ACRES"], "Acreage", (v) => `${Number(v).toFixed(2)} acres`),
    pickField(attrs, ["FULL_MARKET_VALUE", "TOTAL_AV", "TOT_ASSESS_VALUE", "ASSESS_TOTAL"], "Assessed / Market Value", (v) =>
      `$${Number(v).toLocaleString()}`
    ),
    pickField(attrs, ["OWNER_NAME", "PRIMARY_OWNER", "OWNER"], "Owner of Record"),
    pickField(attrs, ["PROP_CLASS", "PROPERTY_CLASS"], "Property Class"),
  ].filter((f): f is ParcelField => f !== null);

  // Large or unusually-addressed properties (government campuses, etc.)
  // don't always geocode to a precise rooftop point, so the spatial search
  // can land on a neighboring parcel. Surface it rather than presenting a
  // possible mismatch as confidently correct.
  let addressMismatchWarning: string | undefined;
  if (siteAddressField) {
    const searchedNum = extractHouseNumber(searchedAddress);
    const returnedNum = extractHouseNumber(siteAddressField.value);
    if (searchedNum && returnedNum && searchedNum !== returnedNum) {
      addressMismatchWarning = `You searched "${searchedAddress}", but the closest matched parcel is at "${siteAddressField.value}" -- double-check this is the right property before relying on it.`;
    }
  }

  return { source: "nys-parcels", sourceName: "NYS Tax Parcels Public", fields, rawAttributes: attrs, addressMismatchWarning };
}

const PLUTO_RESOURCE_URL = "https://data.cityofnewyork.us/resource/64uk-42ks.json";

function stripOrdinalSuffix(word: string): string {
  return word.replace(/^(\d+)(ST|ND|RD|TH)$/i, "$1");
}

function streetWords(matchedAddress: string): string[] {
  // "350 5TH AVE, NEW YORK, NY, 10118" -> ["350", "5TH"] (house number +
  // first street word).
  const streetPart = matchedAddress.split(",")[0]?.trim() ?? "";
  return streetPart.split(/\s+/).slice(0, 2);
}

async function fetchPlutoRows(where: string, limit: number): Promise<Record<string, unknown>[]> {
  const url = `${PLUTO_RESOURCE_URL}?$where=${encodeURIComponent(where)}&$limit=${limit}`;
  const res = await fetch(url, { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`NYC PLUTO service returned ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function queryPluto(matchedAddress: string, borough: string): Promise<ParcelResult | null> {
  const [houseNumberWord, streetWord] = streetWords(matchedAddress);
  const houseNumber = extractHouseNumber(matchedAddress.split(",")[0] ?? "");

  let rows: Record<string, unknown>[] = [];
  let usedFallback = false;

  if (houseNumberWord && streetWord) {
    // PLUTO's per-record street-name formatting isn't fully consistent
    // (some numbered streets keep the ordinal suffix, some drop it), so try
    // both variants in one query rather than guessing a single convention.
    const asWritten = `${houseNumberWord} ${streetWord}`.replace(/'/g, "''");
    const stripped = `${houseNumberWord} ${stripOrdinalSuffix(streetWord)}`.replace(/'/g, "''");
    const variants =
      asWritten === stripped
        ? [asWritten]
        : [asWritten, stripped];
    const prefixClauses = variants.map((v) => `upper(address) like upper('${v}%')`).join(" OR ");
    const primaryWhere = `(${prefixClauses}) AND borough='${borough}'`;
    rows = await fetchPlutoRows(primaryWhere, 1);
  }

  if (rows.length === 0 && houseNumber) {
    // Still no match -- fall back to a house-number-only filter within the
    // same borough. This is scoped enough to stay meaningful (unlike
    // dropping the borough filter too, which risks matching a same-numbered
    // building on a completely different street) and is always flagged as
    // a fallback so it's never presented as a confident exact match.
    const fallbackWhere = `starts_with(address, '${houseNumber.replace(/'/g, "''")}') AND borough='${borough}'`;
    rows = await fetchPlutoRows(fallbackWhere, 5);
    usedFallback = true;
  }

  if (rows.length === 0) return null;

  const attrs: Record<string, unknown> = rows[0];
  const fields = [
    pickField(attrs, ["bbl"], "BBL"),
    pickField(attrs, ["address"], "Address"),
    pickField(attrs, ["lotarea"], "Lot Area", (v) => `${Number(v).toLocaleString()} sq ft`),
    pickField(attrs, ["lotfront"], "Lot Frontage", (v) => `${Number(v)} ft`),
    pickField(attrs, ["lotdepth"], "Lot Depth", (v) => `${Number(v)} ft`),
    pickField(attrs, ["bldgarea"], "Building Area", (v) => `${Number(v).toLocaleString()} sq ft`),
    pickField(attrs, ["assesstot"], "Total Assessed Value", (v) => `$${Number(v).toLocaleString()}`),
    pickField(attrs, ["yearbuilt"], "Year Built"),
    pickField(attrs, ["zonedist1"], "Zoning District"),
    pickField(attrs, ["ownername"], "Owner of Record"),
  ].filter((f): f is ParcelField => f !== null);

  let addressMismatchWarning: string | undefined;
  if (usedFallback) {
    const otherAddresses = rows
      .slice(1)
      .map((r) => r.address)
      .filter(Boolean);
    addressMismatchWarning = otherAddresses.length
      ? `Matched by house number only (the exact street spelling didn't line up) -- other properties with the same house number in this borough include: ${otherAddresses.join(
          ", "
        )}. Verify this is the right one.`
      : "Matched by house number only (the exact street spelling didn't line up) -- verify this is the right property.";
  }

  return { source: "nyc-pluto", sourceName: "NYC PLUTO", fields, rawAttributes: attrs, addressMismatchWarning };
}

export async function POST(request: NextRequest) {
  const sessionValue = await getSessionValue();
  const rateLimitKey = sessionValue ?? request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed } = checkRateLimit(rateLimitKey);
  if (!allowed) {
    return NextResponse.json(
      { error: "You've hit the hourly limit for parcel searches. Try again in a bit." },
      { status: 429 }
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const address = body.address?.trim();
  if (!address) {
    return NextResponse.json({ error: "Enter an address first." }, { status: 400 });
  }

  let census;
  try {
    census = await geocodeAddress(address);
  } catch (err) {
    console.error("Census geocoding failed", err);
    return NextResponse.json(
      { error: "Couldn't reach the Census geocoder just now. Please try again in a moment." },
      { status: 502 }
    );
  }

  if (!census) {
    return NextResponse.json(
      { error: "Address not found. Try including the city and state, e.g. \"123 Main St, Albany, NY 12207\"." },
      { status: 404 }
    );
  }

  const nycBorough = plutoBoroughForCounty(census.county);
  let parcel: ParcelResult | null = null;
  let parcelError: string | null = null;

  try {
    parcel = nycBorough
      ? await queryPluto(census.matchedAddress, nycBorough)
      : await queryNysParcels(census.lat, census.lon, census.matchedAddress);
  } catch (err) {
    console.error("Parcel data lookup failed", err);
    parcelError = "Couldn't reach the parcel data service just now. Try again in a moment.";
  }

  const payload: ParcelSearchResult = {
    census,
    parcel,
    parcelError,
    sourceAttempted: nycBorough ? "nyc-pluto" : "nys-parcels",
  };
  return NextResponse.json(payload);
}
