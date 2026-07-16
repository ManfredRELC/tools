export interface MileageEntry {
  date: string;
  purpose: string;
  miles: string;
}

export interface ExpenseEntry {
  date: string;
  category: string;
  description: string;
  amount: string;
}

export interface MileageExpenseState {
  mileageRate: number;
  mileageEntries: MileageEntry[];
  expenseEntries: ExpenseEntry[];
}
