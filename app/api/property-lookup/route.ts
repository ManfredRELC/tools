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
// TEMPORARY: multiple candidate hosts/paths are documented across FEMA's own
// site and third-party references, and two of them 404 in production. Trying
// them in order and surfacing which one actually works, until confirmed --
// then this collapses back down to a single hardcoded base.
const FEMA_CANDIDATE_BASES = [
  "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer",
  "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer",
  "https://msc.fema.gov/arcgis/rest/services/public/NFHL/MapServer",
];
const FEMA_FLOOD_ZONE_LAYER_ID = 28;

interface FemaIdentifyResult {
  layerId?: number;
  layerName?: string;
  attributes?: Record<string, unknown>;
}

async function tryFemaIdentify(
  base: string,
  lat: number,
  lon: number
): Promise<{ ok: true; results: FemaIdentifyResult[] } | { ok: false; detail: string }> {
  const buffer = 0.001;
  const mapExtent = `${lon - buffer},${lat - buffer},${lon + buffer},${lat + buffer}`;
  const url =
    `${base}/identify` +
    `?geometry=${lon},${lat}&geometryType=esriGeometryPoint&sr=4326&layers=all:${FEMA_FLOOD_ZONE_LAYER_ID}` +
    `&tolerance=2&mapExtent=${mapExtent}&imageDisplay=600,550,96&returnGeometry=false&f=json`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; ManfredSMARTBoard/1.0; +https://tools.manfredrelc.com)",
      },
    });
    const text = await res.text();
    if (!res.ok) return { ok: false, detail: `${base} -> HTTP ${res.status}: ${text.slice(0, 200)}` };

    let data: { error?: unknown; results?: FemaIdentifyResult[] };
    try {
      data = JSON.parse(text);
    } catch {
      return { ok: false, detail: `${base} -> non-JSON response: ${text.slice(0, 200)}` };
    }
    if (data?.error) return { ok: false, detail: `${base} -> ArcGIS error: ${JSON.stringify(data.error).slice(0, 200)}` };

    return { ok: true, results: data.results ?? [] };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, detail: `${base} -> fetch threw: ${msg}` };
  }
}

async function lookupFloodZone(lat: number, lon: number): Promise<FloodZoneResult> {
  const attempts: string[] = [];

  for (const base of FEMA_CANDIDATE_BASES) {
    const attempt = await tryFemaIdentify(base, lat, lon);
    if (attempt.ok) {
      const floodLayer =
        attempt.results.find((r) => r.layerId === FEMA_FLOOD_ZONE_LAYER_ID) ??
        attempt.results.find((r) => /flood hazard zone/i.test(r.layerName ?? ""));
      const attrs = floodLayer?.attributes;

      const zone = (attrs?.FLD_ZONE as string | undefined) ?? null;
      const subtype = (attrs?.ZONE_SUBTY as string | undefined) ?? null;
      const sfhaRaw = attrs?.SFHA_TF as string | undefined;
      const isSFHA = sfhaRaw === "T" ? true : sfhaRaw === "F" ? false : null;

      return { zone, subtype, isSFHA, ...describeFloodZone(zone, subtype) };
    }
    attempts.push(attempt.detail);
  }

  console.error("FEMA flood zone lookup failed for all candidate hosts", attempts);
  return {
    zone: null,
    subtype: null,
    isSFHA: null,
    riskLevel: "undetermined",
    label: "Lookup Unavailable",
    // TEMPORARY: surfacing every candidate's failure reason on-page, since
    // this environment has no access to Vercel's logs. Remove once fixed.
    description: `FEMA's flood map service could not be reached. [debug: ${attempts.join(" || ").slice(0, 600)}]`,
    unavailable: true,
  };
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
