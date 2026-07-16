import { FeeRateCard } from "./types";

// Starter numbers only -- every dollar amount here is meant to be edited on
// the Rate Card panel to match the appraiser's own actual pricing. None of
// this reflects a real market rate.
export const DEFAULT_RATE_CARD: FeeRateCard = {
  propertyTypes: [
    { key: "sfr", label: "Single-Family Residence", baseFee: 450 },
    { key: "condo", label: "Condominium", baseFee: 400 },
    { key: "multi", label: "Multi-Family (2-4 units)", baseFee: 550 },
    { key: "manufactured", label: "Manufactured / Mobile Home", baseFee: 400 },
    { key: "land", label: "Vacant Land", baseFee: 500 },
    { key: "newconstruction", label: "New Construction", baseFee: 500 },
  ],
  perSqftThreshold: 2500,
  perSqftIncrement: 500,
  perSqftFee: 25,
  complexityFactors: [
    { key: "acreage", label: "Over 5 acres", amount: 75 },
    { key: "unique", label: "Unique or custom-built property", amount: 100 },
    { key: "outbuildings", label: "Additional structures (barn, guest house, etc.)", amount: 75 },
    { key: "rural", label: "Rural / remote location", amount: 50 },
    { key: "waterfront", label: "Waterfront property", amount: 100 },
    { key: "legal", label: "Estate, divorce, or litigation purpose", amount: 100 },
  ],
  rushOptions: [
    { key: "standard", label: "Standard turnaround", percent: 0 },
    { key: "rush48", label: "48-hour rush", percent: 20 },
    { key: "rush24", label: "24-hour rush", percent: 35 },
  ],
};
