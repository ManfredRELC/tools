export interface CensusTractResult {
  matchedAddress: string;
  lat: number;
  lon: number;
  tractGeoid: string | null;
  tractName: string | null;
  county: string | null;
  state: string | null;
}

export interface PropertyLookupResult {
  census: CensusTractResult;
}
