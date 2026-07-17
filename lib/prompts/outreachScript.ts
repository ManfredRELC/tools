import { ContactMethod, OutreachTone } from "@/lib/outreachFields";
import { LeadType } from "@/lib/leadTypes";

function systemPromptFor(leadType: LeadType): string {
  const audience =
    leadType === "Expired Listing"
      ? "a homeowner whose listing recently expired without selling with another agent"
      : "a For-Sale-By-Owner (FSBO) seller";
  const guardrail =
    leadType === "Expired Listing"
      ? " Never criticize or speculate negatively about the previous agent or brokerage, by name or in general terms -- focus only on what the agent can offer going forward, not on blame."
      : "";

  return `You write short, natural-sounding outreach scripts for residential real estate agents contacting ${audience}. Write only the script itself -- no preamble, no headers, no markdown formatting, no explanation before or after. Match the requested contact method's real-world conventions:
- Phone call: include a brief opener, a reason for calling, one soft question, and a natural way to end the call if they say no.
- Text message: 2-4 short sentences max, casual, no hard sell.
- Door knock: very brief spoken lines, as if said face to face, plus one line for what to do if no one answers.
- Email: include a short subject line on the first line prefixed "Subject:", then a brief, low-pressure email body.
Never invent specific statistics or make guarantees about sale price or timeline. Keep it sounding like a real person, not a corporate template.${guardrail}`;
}

export interface OutreachFieldValues {
  address?: string;
  daysOnMarket?: string;
  sellerName?: string;
  agentName?: string;
  notes?: string;
}

export function buildOutreachPrompt(
  method: ContactMethod,
  tone: OutreachTone,
  leadType: LeadType,
  fields: OutreachFieldValues
): { system: string; prompt: string } {
  const daysLabel =
    leadType === "Expired Listing" ? "Days on market before it expired" : "Estimated time on market as FSBO";

  const prompt = `Lead type: ${leadType}
Contact method: ${method}
Tone: ${tone}
Property address: ${fields.address?.trim() || "Not specified"}
${daysLabel}: ${fields.daysOnMarket?.trim() || "Not specified"}
Seller name (if known): ${fields.sellerName?.trim() || "Unknown -- use a generic friendly greeting"}
Agent name to sign as: ${fields.agentName?.trim() || "Not specified -- leave a placeholder like [Your Name]"}
Additional notes: ${fields.notes?.trim() || "None"}`;

  return { system: systemPromptFor(leadType), prompt };
}
