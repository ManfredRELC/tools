import { MileageExpenseState } from "./types";

// Starting value reflects the IRS standard business mileage rate for the
// second half of 2026 ($0.76/mi, Jul 1-Dec 31). This rate changes
// periodically -- verify the current figure at irs.gov and edit if stale.
export const DEFAULT_STATE: MileageExpenseState = {
  mileageRate: 0.76,
  mileageEntries: [],
  expenseEntries: [],
};
