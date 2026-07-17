import { FieldDef } from "@/lib/categories";
import { LeadType } from "@/lib/leadTypes";

export const CONTACT_METHODS = ["Phone call", "Text message", "Door knock", "Email"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export const OUTREACH_TONES = ["Warm & conversational", "Confident & brief", "Consultative / expert"] as const;
export type OutreachTone = (typeof OUTREACH_TONES)[number];

export function getOutreachFields(leadType: LeadType): FieldDef[] {
  const isExpired = leadType === "Expired Listing";
  return [
    { key: "address", label: "Property address", type: "text", placeholder: "123 Maple St." },
    {
      key: "daysOnMarket",
      label: isExpired ? "Days on market before it expired" : "Days on market as FSBO",
      type: "number",
      placeholder: "30",
    },
    { key: "sellerName", label: "Seller name (if known)", type: "text", placeholder: "e.g. the Andersons" },
    { key: "agentName", label: "Your name", type: "text", placeholder: "e.g. Jamie Rivera" },
    {
      key: "notes",
      label: "Notes",
      hint: "optional",
      type: "textarea",
      placeholder: isExpired
        ? "e.g. Listed with another agent for 4 months, shows well, priced close to comps"
        : "e.g. Price recently dropped, second time trying FSBO",
    },
  ];
}
