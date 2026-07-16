export interface CensusGeocodeResult {
  matchedAddress: string;
  lat: number;
  lon: number;
  tractGeoid: string | null;
  tractName: string | null;
  county: string | null;
  countyGeoid: string | null;
  state: string | null;
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

export async function geocodeAddress(address: string): Promise<CensusGeocodeResult | null> {
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
    countyGeoid: county?.GEOID ?? null,
    state: state?.NAME ?? null,
  };
}
