import { FieldDef } from "@/lib/categories";

export const CONTACT_METHODS = ["Phone call", "Text message", "Door knock", "Email"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export const OUTREACH_TONES = ["Warm & conversational", "Confident & brief", "Consultative / expert"] as const;
export type OutreachTone = (typeof OUTREACH_TONES)[number];

export const OUTREACH_FIELDS: FieldDef[] = [
  { key: "address", label: "Property address", type: "text", placeholder: "123 Maple St." },
  { key: "daysOnMarket", label: "Days on market as FSBO", type: "number", placeholder: "30" },
  { key: "sellerName", label: "Seller name (if known)", type: "text", placeholder: "e.g. the Andersons" },
  { key: "agentName", label: "Your name", type: "text", placeholder: "e.g. Jamie Rivera" },
  {
    key: "notes",
    label: "Notes",
    hint: "optional",
    type: "textarea",
    placeholder: "e.g. Price recently dropped, second time trying FSBO",
  },
];
