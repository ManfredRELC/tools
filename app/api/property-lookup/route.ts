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

async function lookupFloodZone(lat: number, lon: number): Promise<FloodZoneResult> {
  const buffer = 0.001;
  const mapExtent = `${lon - buffer},${lat - buffer},${lon + buffer},${lat + buffer}`;
  const url =
    `https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/identify` +
    `?geometry=${lon},${lat}&geometryType=esriGeometryPoint&sr=4326&layers=all` +
    `&tolerance=2&mapExtent=${mapExtent}&imageDisplay=600,550,96&returnGeometry=false&f=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`FEMA NFHL returned ${res.status}`);
    const data = await res.json();
    const results: Array<{ layerName?: string; attributes?: Record<string, unknown> }> = data?.results ?? [];
    const floodLayer = results.find((r) => /flood hazard zone/i.test(r.layerName ?? ""));
    const attrs = floodLayer?.attributes;

    const zone = (attrs?.FLD_ZONE as string | undefined) ?? null;
    const subtype = (attrs?.ZONE_SUBTY as string | undefined) ?? null;
    const sfhaRaw = attrs?.SFHA_TF as string | undefined;
    const isSFHA = sfhaRaw === "T" ? true : sfhaRaw === "F" ? false : null;

    return { zone, subtype, isSFHA, ...describeFloodZone(zone, subtype) };
  } catch (err) {
    console.error("FEMA flood zone lookup failed", err);
    return {
      zone: null,
      subtype: null,
      isSFHA: null,
      riskLevel: "undetermined",
      label: "Lookup Unavailable",
      description: "FEMA's flood map service could not be reached just now. Try again, or verify directly on FEMA's Flood Map Service Center.",
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
