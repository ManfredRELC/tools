import { NetSheetAssumptions } from "./types";

// Starter numbers only -- edit every field on the Assumptions panel to match
// your own market and the deal at hand. The transfer tax default reflects
// only New York State's base rate ($2 per $500, i.e. 0.4%) -- NYC and some
// other localities add their own transfer tax on top of this. None of these
// figures are a substitute for a title company or attorney's closing statement.
export const DEFAULT_ASSUMPTIONS: NetSheetAssumptions = {
  commissionPercent: 5,
  transferTaxPercent: 0.4,
  attorneyFee: 1200,
  titleClosingFee: 1500,
  otherClosingCosts: 500,
};
