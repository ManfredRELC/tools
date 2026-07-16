export type DisciplineKey = "realestate" | "homeinspector" | "appraiser";

export type CEFlagKey = "firstRenewal" | "firstCycleVB";

export interface CEConditional {
  flagKey: CEFlagKey;
  // When state[flagKey] === whenFlag, altMin applies instead of the category's base min.
  whenFlag: boolean;
  altMin: number;
}

export interface CECategory {
  key: string;
  label: string;
  min: number;
  conditional?: CEConditional;
}

export interface CEFlag {
  key: CEFlagKey;
  label: string;
  default: boolean;
}

export interface CEDiscipline {
  key: DisciplineKey;
  label: string;
  storageKey: string;
  codeExample: string;
  licensePlaceholder: string;
  hoursRequired: number;
  categories: CECategory[];
  showCategoryBreakdown: boolean;
  progressSubtext?: string;
  flag?: CEFlag;
}

export interface CECourse {
  name: string;
  provider: string;
  code: string;
  category: string;
  hours: string;
  date: string;
  crossLoggedFrom?: DisciplineKey;
}

export interface CEState {
  license: { number: string; expiration: string };
  courses: CECourse[];
  firstRenewal?: boolean;
  firstCycleVB?: boolean;
}
