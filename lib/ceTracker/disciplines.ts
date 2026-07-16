import { CEDiscipline, DisciplineKey } from "./types";

export const CE_DISCIPLINES: Record<DisciplineKey, CEDiscipline> = {
  realestate: {
    key: "realestate",
    label: "Real Estate Salesperson & Broker",
    storageKey: "ce-tracker-realestate",
    codeExample: "M-4567",
    licensePlaceholder: "e.g. 10401234567",
    hoursRequired: 22.5,
    showCategoryBreakdown: true,
    flag: {
      key: "firstRenewal",
      label: "This is my first renewal cycle (Agency requirement is 2 hours instead of 1)",
      default: false,
    },
    categories: [
      { key: "fairhousing", label: "Fair Housing", min: 3 },
      { key: "ethics", label: "Ethical Business Practices", min: 2.5 },
      { key: "implicitbias", label: "Implicit Bias", min: 2 },
      { key: "culturalcompetency", label: "Cultural Competency", min: 2 },
      { key: "legal", label: "Legal Matters", min: 1 },
      {
        key: "agency",
        label: "Agency",
        min: 1,
        conditional: { flagKey: "firstRenewal", whenFlag: true, altMin: 2 },
      },
      { key: "elective", label: "Elective", min: 0 },
    ],
  },

  homeinspector: {
    key: "homeinspector",
    label: "Home Inspector",
    storageKey: "ce-tracker-homeinspector",
    codeExample: "L-4567",
    licensePlaceholder: "e.g. 16000012345",
    hoursRequired: 24,
    showCategoryBreakdown: false,
    progressSubtext: "New York requires no mandated sub-topic split for home inspector CE",
    categories: [{ key: "general", label: "Continuing Education (no mandated sub-topics)", min: 0 }],
  },

  appraiser: {
    key: "appraiser",
    label: "Real Estate Appraiser",
    storageKey: "ce-tracker-appraiser",
    codeExample: "A-4567",
    licensePlaceholder: "e.g. 46000012345",
    hoursRequired: 28,
    showCategoryBreakdown: true,
    flag: {
      key: "firstCycleVB",
      label:
        "This is my first cycle completing Valuation Bias & Fair Housing (7 hrs required — later cycles only require 4 hrs)",
      default: true,
    },
    categories: [
      { key: "uspap", label: "National USPAP Update Course", min: 7 },
      {
        key: "valuationbias",
        label: "Valuation Bias & Fair Housing (7 hrs first cycle, 4 hrs after)",
        min: 7,
        conditional: { flagKey: "firstCycleVB", whenFlag: false, altMin: 4 },
      },
      { key: "elective", label: "Elective", min: 0 },
    ],
  },
};

export const CE_DISCIPLINE_ORDER: DisciplineKey[] = ["realestate", "homeinspector", "appraiser"];
