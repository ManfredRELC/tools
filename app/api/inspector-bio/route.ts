import { NextRequest, NextResponse } from "next/server";
import { buildInspectorBioPrompt } from "@/lib/prompts/inspectorBio";
import { generateText } from "@/lib/anthropic";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSessionValue } from "@/lib/auth";

interface RequestBody {
  notes?: string;
  length?: string;
  useCase?: string;
}

export async function POST(request: NextRequest) {
  const sessionValue = await getSessionValue();
  const rateLimitKey = sessionValue ?? request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed } = checkRateLimit(rateLimitKey);
  if (!allowed) {
    return NextResponse.json(
      { error: "You've hit the hourly limit for generating bios. Try again in a bit." },
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
    return NextResponse.json({ error: "Add a few details about yourself first." }, { status: 400 });
  }

  const length = body.length?.trim() || "2-3 sentences";
  const useCase = body.useCase?.trim() || "website / agent flyer";
  const { system, prompt } = buildInspectorBioPrompt(notes, length, useCase);

  try {
    const bio = await generateText(prompt, 500, system);
    if (!bio) throw new Error("Model returned an empty response");
    return NextResponse.json({ bio });
  } catch (err) {
    console.error("inspector-bio generation failed", err);
    return NextResponse.json(
      { error: "Something went wrong generating a bio. Please try again." },
      { status: 502 }
    );
  }
}
