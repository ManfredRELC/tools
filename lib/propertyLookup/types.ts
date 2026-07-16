import { CensusGeocodeResult } from "@/lib/geocode/census";

export type CensusTractResult = CensusGeocodeResult;

export interface PropertyLookupResult {
  census: CensusTractResult;
}
