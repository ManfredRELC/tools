import { ObjectionTone, TONE_DESCRIPTIONS } from "@/lib/objectionFields";
import { LeadType } from "@/lib/leadTypes";

export interface ObjectionResponsePayload {
  response: string;
  why_it_works: string;
}

export function buildObjectionPrompt(
  tone: ObjectionTone,
  leadType: LeadType,
  objection: string,
  agentName: string
): { system: string; prompt: string } {
  const audience =
    leadType === "Expired Listing"
      ? "a seller whose listing recently expired without selling with another agent"
      : "a For-Sale-By-Owner (FSBO) seller";
  const guardrail =
    leadType === "Expired Listing"
      ? " Never criticize the previous agent or brokerage, by name or in general terms -- focus on what can be done differently going forward, not on blame."
      : "";

  const system = `You are a coaching assistant for a licensed real estate agent, helping them respond to an objection from ${audience} they are prospecting. Write a short, natural, spoken-sounding response the agent could say out loud on a call or at the door -- ${TONE_DESCRIPTIONS[tone]}. Keep it to 2-4 sentences, no more than about 65 words. Never invent specific statistics, studies, or percentages -- if referencing general industry realities, keep it general and honest. Be respectful of the seller's autonomy; never pressure or guilt.${guardrail} Then write a short "why this works" coaching note (1-2 sentences) explaining the psychological or practical reasoning behind the response, for the agent's own learning.

Respond ONLY with valid JSON in this exact shape, no markdown fences, no preamble:
{"response": "...", "why_it_works": "..."}`;

  const prompt = `Seller objection: "${objection}"${
    agentName ? `\nAgent's first name (use naturally only if it fits, do not force it): ${agentName}` : ""
  }`;

  return { system, prompt };
}
