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

async function queryNysParcels(lat: number, lon: number): Promise<ParcelResult | null> {
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

  const fields = [
    pickField(attrs, ["PRINT_KEY", "SBL", "TAX_MAP_NUMBER", "PARCEL_ID"], "Parcel ID"),
    pickField(attrs, ["PARCEL_ADDR", "SITE_ADDRESS", "PROP_LOC", "LOCATION", "ADDRESS"], "Site Address"),
    pickField(attrs, ["MUNI_NAME", "MUNICIPALITY", "CITY_TOWN"], "Municipality"),
    pickField(attrs, ["CALC_ACREAGE", "ACRES", "GIS_ACRES", "DEEDED_ACRES"], "Acreage", (v) => `${Number(v).toFixed(2)} acres`),
    pickField(attrs, ["FULL_MARKET_VALUE", "TOTAL_AV", "TOT_ASSESS_VALUE", "ASSESS_TOTAL"], "Assessed / Market Value", (v) =>
      `$${Number(v).toLocaleString()}`
    ),
    pickField(attrs, ["OWNER_NAME", "PRIMARY_OWNER", "OWNER"], "Owner of Record"),
    pickField(attrs, ["PROP_CLASS", "PROPERTY_CLASS"], "Property Class"),
  ].filter((f): f is ParcelField => f !== null);

  return { source: "nys-parcels", sourceName: "NYS Tax Parcels Public", fields, rawAttributes: attrs };
}

const PLUTO_RESOURCE_URL = "https://data.cityofnewyork.us/resource/64uk-42ks.json";

function addressSearchPrefix(matchedAddress: string): string {
  // "123 MAIN ST, NEW YORK, NY, 10001" -> "123 MAIN" (house number + first
  // street word), used as a forgiving prefix match against PLUTO's own
  // address formatting, which may abbreviate street suffixes differently.
  const streetPart = matchedAddress.split(",")[0]?.trim() ?? "";
  return streetPart.split(/\s+/).slice(0, 2).join(" ");
}

async function queryPluto(matchedAddress: string, borough: string): Promise<ParcelResult | null> {
  const prefix = addressSearchPrefix(matchedAddress).replace(/'/g, "''");
  const where = `upper(address) like upper('${prefix}%') AND borough='${borough}'`;
  const url = `${PLUTO_RESOURCE_URL}?$where=${encodeURIComponent(where)}&$limit=1`;

  const res = await fetch(url, { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`NYC PLUTO service returned ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;

  const attrs: Record<string, unknown> = data[0];
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

  return { source: "nyc-pluto", sourceName: "NYC PLUTO", fields, rawAttributes: attrs };
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
    parcel = nycBorough ? await queryPluto(census.matchedAddress, nycBorough) : await queryNysParcels(census.lat, census.lon);
  } catch (err) {
    console.error("Parcel data lookup failed", err);
    parcelError = "Couldn't reach the parcel data service just now. Try again in a moment.";
  }

  const payload: ParcelSearchResult = { census, parcel, parcelError };
  return NextResponse.json(payload);
}
