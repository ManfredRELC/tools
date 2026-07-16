// The 5 NYC boroughs map 1:1 to these Census county names, and to PLUTO's
// own single-letter borough codes.
const NYC_COUNTY_TO_PLUTO_BOROUGH: Record<string, string> = {
  "New York County": "MN",
  "Bronx County": "BX",
  "Kings County": "BK",
  "Queens County": "QN",
  "Richmond County": "SI",
};

export function plutoBoroughForCounty(county: string | null): string | null {
  if (!county) return null;
  return NYC_COUNTY_TO_PLUTO_BOROUGH[county] ?? null;
}

export function isNYCCounty(county: string | null): boolean {
  return plutoBoroughForCounty(county) !== null;
}
