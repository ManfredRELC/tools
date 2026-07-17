import { NextRequest, NextResponse } from "next/server";
import { OBJECTION_TONES, ObjectionTone } from "@/lib/objectionFields";
import { buildObjectionPrompt, ObjectionResponsePayload } from "@/lib/prompts/objectionResponse";
import { LEAD_TYPES, LeadType } from "@/lib/leadTypes";
import { generateJSON } from "@/lib/anthropic";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSessionValue } from "@/lib/auth";

interface RequestBody {
  tone?: string;
  leadType?: string;
  objection?: string;
  agentName?: string;
}

export async function POST(request: NextRequest) {
  const sessionValue = await getSessionValue();
  const rateLimitKey = sessionValue ?? request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed } = checkRateLimit(rateLimitKey);
  if (!allowed) {
    return NextResponse.json(
      { error: "You've hit the hourly limit for generating responses. Try again in a bit." },
      { status: 429 }
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const tone = body.tone as ObjectionTone | undefined;
  if (!tone || !OBJECTION_TONES.includes(tone)) {
    return NextResponse.json({ error: "Unknown tone." }, { status: 400 });
  }

  const leadType = body.leadType as LeadType | undefined;
  if (!leadType || !LEAD_TYPES.includes(leadType)) {
    return NextResponse.json({ error: "Unknown lead type." }, { status: 400 });
  }

  const objection = body.objection?.trim();
  if (!objection) {
    return NextResponse.json({ error: "Enter or select an objection first." }, { status: 400 });
  }

  const agentName = body.agentName?.trim() ?? "";
  const { system, prompt } = buildObjectionPrompt(tone, leadType, objection, agentName);

  try {
    const payload = await generateJSON<ObjectionResponsePayload>(prompt, 1000, system);
    if (!payload?.response) throw new Error("Model returned an empty response");
    return NextResponse.json(payload);
  } catch (err) {
    console.error("objection-response generation failed", err);
    return NextResponse.json(
      { error: "Something went wrong generating a response. Please try again." },
      { status: 502 }
    );
  }
}
