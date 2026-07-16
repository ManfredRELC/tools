import { CensusGeocodeResult } from "@/lib/geocode/census";

export type ParcelSource = "nyc-pluto" | "nys-parcels";

export interface ParcelField {
  label: string;
  value: string;
}

export interface ParcelResult {
  source: ParcelSource;
  sourceName: string;
  fields: ParcelField[];
  rawAttributes: Record<string, unknown>;
  addressMismatchWarning?: string;
}

export interface ParcelSearchResult {
  census: CensusGeocodeResult;
  parcel: ParcelResult | null;
  parcelError: string | null;
}
