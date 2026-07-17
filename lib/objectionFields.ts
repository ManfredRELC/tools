import { LeadType } from "@/lib/leadTypes";

export const COMMON_OBJECTIONS_FSBO = [
  "We don't want to pay a commission",
  "We can find our own buyer",
  "We don't need help with the paperwork",
  "Agents don't really do anything we can't do ourselves",
  "We had a bad experience with an agent before",
  "We'll just lower the price if it doesn't sell",
];

export const COMMON_OBJECTIONS_EXPIRED = [
  "We're going to wait a few months and try again",
  "Our last agent just didn't market it right",
  "It just needs the right buyer to come along",
  "Every agent says they'll do something different",
  "We might just take it off the market and rent it out instead",
  "We're not sure another agent will do any better",
];

export function getCommonObjections(leadType: LeadType): string[] {
  return leadType === "Expired Listing" ? COMMON_OBJECTIONS_EXPIRED : COMMON_OBJECTIONS_FSBO;
}

export const OBJECTION_TONES = ["Empathetic", "Direct", "Data-driven"] as const;
export type ObjectionTone = (typeof OBJECTION_TONES)[number];

export const TONE_DESCRIPTIONS: Record<ObjectionTone, string> = {
  Empathetic:
    "warm, validating, and low-pressure -- acknowledge the feeling behind the objection before gently reframing",
  Direct: "confident and straightforward -- get to the point respectfully, no hedging, no fluff",
  "Data-driven":
    "calm and fact-oriented -- lean on general, well-known industry realities (without inventing specific statistics or citing sources) to make the case",
};
