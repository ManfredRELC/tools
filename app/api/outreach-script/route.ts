import { NextRequest, NextResponse } from "next/server";
import { CONTACT_METHODS, ContactMethod, OUTREACH_TONES, OutreachTone } from "@/lib/outreachFields";
import { buildOutreachPrompt, OutreachFieldValues } from "@/lib/prompts/outreachScript";
import { LEAD_TYPES, LeadType } from "@/lib/leadTypes";
import { generateText } from "@/lib/anthropic";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSessionValue } from "@/lib/auth";

interface RequestBody {
  method?: string;
  tone?: string;
  leadType?: string;
  fields?: OutreachFieldValues;
}

export async function POST(request: NextRequest) {
  const sessionValue = await getSessionValue();
  const rateLimitKey = sessionValue ?? request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed } = checkRateLimit(rateLimitKey);
  if (!allowed) {
    return NextResponse.json(
      { error: "You've hit the hourly limit for generating scripts. Try again in a bit." },
      { status: 429 }
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const method = body.method as ContactMethod | undefined;
  if (!method || !CONTACT_METHODS.includes(method)) {
    return NextResponse.json({ error: "Unknown contact method." }, { status: 400 });
  }

  const tone = body.tone as OutreachTone | undefined;
  if (!tone || !OUTREACH_TONES.includes(tone)) {
    return NextResponse.json({ error: "Unknown tone." }, { status: 400 });
  }

  const leadType = body.leadType as LeadType | undefined;
  if (!leadType || !LEAD_TYPES.includes(leadType)) {
    return NextResponse.json({ error: "Unknown lead type." }, { status: 400 });
  }

  const fields = body.fields ?? {};
  const hasAnyDetail = Object.values(fields).some((v) => typeof v === "string" && v.trim().length > 0);
  if (!hasAnyDetail) {
    return NextResponse.json(
      { error: "Add at least a few details so the script has something to work with." },
      { status: 400 }
    );
  }

  const { system, prompt } = buildOutreachPrompt(method, tone, leadType, fields);

  try {
    const script = await generateText(prompt, 800, system);
    if (!script) throw new Error("Model returned an empty script");
    return NextResponse.json({ script });
  } catch (err) {
    console.error("outreach-script generation failed", err);
    return NextResponse.json(
      { error: "Could not generate a script. Please try again." },
      { status: 502 }
    );
  }
}
