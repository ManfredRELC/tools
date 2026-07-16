import { FieldDef } from "@/lib/categories";

export type ReportSeverity = "info" | "maint" | "repair" | "safety";

export const REPORT_TYPE_LABEL: Record<ReportSeverity, string> = {
  info: "Informational",
  maint: "Maintenance",
  repair: "Repair recommended",
  safety: "Unsafe – specialist referral",
};

export const REPORT_SYSTEM_OPTIONS: { value: string; label: string }[] = [
  { value: "auto", label: "Let the assistant detect it" },
  { value: "Site Conditions", label: "Site Conditions — §197-5.4" },
  { value: "Structural Systems", label: "Structural Systems — §197-5.5" },
  { value: "Exterior", label: "Exterior — §197-5.6" },
  { value: "Roof Systems", label: "Roof Systems — §197-5.7" },
  { value: "Plumbing System", label: "Plumbing System — §197-5.8" },
  { value: "Electrical System", label: "Electrical System — §197-5.9" },
  { value: "Heating System", label: "Heating System — §197-5.10" },
  { value: "Air Conditioning Systems", label: "Air Conditioning Systems — §197-5.11" },
  { value: "Interior", label: "Interior — §197-5.12" },
  { value: "Insulation & Ventilation", label: "Insulation & Ventilation — §197-5.13" },
  { value: "Fireplaces", label: "Fireplaces — §197-5.14" },
  { value: "Attics", label: "Attics — §197-5.15" },
];

export const REPORT_SEVERITY_OPTIONS: { value: string; label: string }[] = [
  { value: "auto", label: "Let the assistant judge it" },
  { value: "info", label: "Informational" },
  { value: "maint", label: "Maintenance" },
  { value: "repair", label: "Repair recommended" },
  { value: "safety", label: "Unsafe — specialist referral" },
];

export const NOTES_FIELD: FieldDef = {
  key: "notes",
  label: "Your field notes",
  type: "textarea",
  placeholder:
    'e.g. "master bath toilet wobbly at base, tile cracked around it, ceiling stain directly below in the dining room"',
};

export interface ReportNarrativeResult {
  system: string;
  citation: string;
  severity: ReportSeverity;
  narrative: string;
  adjustments: string[];
}
