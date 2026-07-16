import { NextRequest, NextResponse } from "next/server";
import { describeFloodZone } from "@/lib/propertyLookup/floodZones";
import { CensusTractResult, FloodZoneResult, PropertyLookupResult } from "@/lib/propertyLookup/types";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSessionValue } from "@/lib/auth";

interface RequestBody {
  address?: string;
}

interface CensusGeography {
  GEOID?: string;
  NAME?: string;
}

interface CensusAddressMatch {
  matchedAddress: string;
  coordinates: { x: number; y: number };
  geographies?: {
    "Census Tracts"?: CensusGeography[];
    Counties?: CensusGeography[];
    States?: CensusGeography[];
  };
}

async function geocodeAddress(address: string): Promise<CensusTractResult | null> {
  const url = `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=${encodeURIComponent(
    address
  )}&benchmark=Public_AR_Current&vintage=Current_Current&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Census geocoder returned ${res.status}`);
  const data = await res.json();
  const match: CensusAddressMatch | undefined = data?.result?.addressMatches?.[0];
  if (!match) return null;

  const tract = match.geographies?.["Census Tracts"]?.[0];
  const county = match.geographies?.Counties?.[0];
  const state = match.geographies?.States?.[0];

  return {
    matchedAddress: match.matchedAddress,
    lat: match.coordinates.y,
    lon: match.coordinates.x,
    tractGeoid: tract?.GEOID ?? null,
    tractName: tract?.NAME ?? null,
    county: county?.NAME ?? null,
    state: state?.NAME ?? null,
  };
}

// Layer 28 of FEMA's public NFHL MapServer is "Flood Hazard Zones" (S_Fld_Haz_Ar).
// Note: the correct host path is /gis/nfhl/rest/services/... -- the more commonly
// referenced /arcgis/rest/services/... path for this same hostname 404s.
const FEMA_NFHL_BASE = "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer";
const FEMA_FLOOD_ZONE_LAYER_ID = 28;

async function lookupFloodZone(lat: number, lon: number): Promise<FloodZoneResult> {
  const buffer = 0.001;
  const mapExtent = `${lon - buffer},${lat - buffer},${lon + buffer},${lat + buffer}`;
  const url =
    `${FEMA_NFHL_BASE}/identify` +
    `?geometry=${lon},${lat}&geometryType=esriGeometryPoint&sr=4326&layers=all:${FEMA_FLOOD_ZONE_LAYER_ID}` +
    `&tolerance=2&mapExtent=${mapExtent}&imageDisplay=600,550,96&returnGeometry=false&f=json`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; ManfredSMARTBoard/1.0; +https://tools.manfredrelc.com)",
      },
    });
    if (!res.ok) {
      const bodySnippet = (await res.text().catch(() => "")).slice(0, 300);
      throw new Error(`FEMA NFHL returned ${res.status}: ${bodySnippet}`);
    }
    const data = await res.json();
    const results: Array<{ layerId?: number; layerName?: string; attributes?: Record<string, unknown> }> = data?.results ?? [];
    const floodLayer =
      results.find((r) => r.layerId === FEMA_FLOOD_ZONE_LAYER_ID) ??
      results.find((r) => /flood hazard zone/i.test(r.layerName ?? ""));
    const attrs = floodLayer?.attributes;

    const zone = (attrs?.FLD_ZONE as string | undefined) ?? null;
    const subtype = (attrs?.ZONE_SUBTY as string | undefined) ?? null;
    const sfhaRaw = attrs?.SFHA_TF as string | undefined;
    const isSFHA = sfhaRaw === "T" ? true : sfhaRaw === "F" ? false : null;

    return { zone, subtype, isSFHA, ...describeFloodZone(zone, subtype) };
  } catch (err) {
    console.error("FEMA flood zone lookup failed", err);
    const debugDetail = err instanceof Error ? err.message : String(err);
    return {
      zone: null,
      subtype: null,
      isSFHA: null,
      riskLevel: "undetermined",
      label: "Lookup Unavailable",
      // TEMPORARY: surfacing the raw error on-page for debugging, since this
      // environment has no access to Vercel's logs. Remove once fixed.
      description: `FEMA's flood map service could not be reached just now. [debug: ${debugDetail.slice(0, 400)}]`,
      unavailable: true,
    };
  }
}

export async function POST(request: NextRequest) {
  const sessionValue = await getSessionValue();
  const rateLimitKey = sessionValue ?? request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed } = checkRateLimit(rateLimitKey);
  if (!allowed) {
    return NextResponse.json(
      { error: "You've hit the hourly limit for property lookups. Try again in a bit." },
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

  let census: CensusTractResult | null;
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

  const flood = await lookupFloodZone(census.lat, census.lon);

  const payload: PropertyLookupResult = { census, flood };
  return NextResponse.json(payload);
}
