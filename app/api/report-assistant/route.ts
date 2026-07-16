import { NextRequest, NextResponse } from "next/server";
import { ReportNarrativeResult } from "@/lib/reportAssistantFields";
import { buildReportAssistantPrompt } from "@/lib/prompts/reportAssistant";
import { generateJSON } from "@/lib/anthropic";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSessionValue } from "@/lib/auth";

interface RequestBody {
  notes?: string;
  systemHint?: string;
  severityHint?: string;
}

export async function POST(request: NextRequest) {
  const sessionValue = await getSessionValue();
  const rateLimitKey = sessionValue ?? request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed } = checkRateLimit(rateLimitKey);
  if (!allowed) {
    return NextResponse.json(
      { error: "You've hit the hourly limit for generating narratives. Try again in a bit." },
      { status: 429 }
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const notes = body.notes?.trim();
  if (!notes) {
    return NextResponse.json({ error: "Enter some field notes first." }, { status: 400 });
  }

  const systemHint = body.systemHint?.trim() || "auto";
  const severityHint = body.severityHint?.trim() || "auto";
  const { system, prompt } = buildReportAssistantPrompt(notes, systemHint, severityHint);

  try {
    const payload = await generateJSON<ReportNarrativeResult>(prompt, 1000, system);
    if (!payload?.narrative) throw new Error("Model returned an empty narrative");
    return NextResponse.json(payload);
  } catch (err) {
    console.error("report-assistant generation failed", err);
    return NextResponse.json(
      { error: "Something went wrong generating the narrative. Please try again." },
      { status: 502 }
    );
  }
}
