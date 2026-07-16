export interface CensusTractResult {
  matchedAddress: string;
  lat: number;
  lon: number;
  tractGeoid: string | null;
  tractName: string | null;
  county: string | null;
  state: string | null;
}

export type FloodRiskLevel = "high" | "moderate" | "minimal" | "undetermined";

export interface FloodZoneResult {
  zone: string | null;
  subtype: string | null;
  isSFHA: boolean | null;
  riskLevel: FloodRiskLevel;
  label: string;
  description: string;
  unavailable?: boolean;
}

export interface PropertyLookupResult {
  census: CensusTractResult;
  flood: FloodZoneResult;
}
