export const LEAD_TYPES = ["FSBO", "Expired Listing"] as const;
export type LeadType = (typeof LEAD_TYPES)[number];
