import { NextRequest, NextResponse } from "next/server";
import { buildSocialPostsPrompt, SocialPlatform, SocialPostsPayload, SocialTone } from "@/lib/prompts/socialPosts";
import { generateJSON } from "@/lib/anthropic";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSessionValue } from "@/lib/auth";

const VALID_PLATFORMS: SocialPlatform[] = ["facebook", "instagram", "linkedin", "nextdoor"];
const VALID_TONES: SocialTone[] = ["friendly", "pro"];

interface RequestBody {
  topic?: string;
  platform?: string;
  tone?: string;
  agentInfo?: string;
}

export async function POST(request: NextRequest) {
  const sessionValue = await getSessionValue();
  const rateLimitKey = sessionValue ?? request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed } = checkRateLimit(rateLimitKey);
  if (!allowed) {
    return NextResponse.json(
      { error: "You've hit the hourly limit for generating posts. Try again in a bit." },
      { status: 429 }
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const topic = body.topic?.trim();
  if (!topic) {
    return NextResponse.json({ error: "Add a topic or a bit of context first." }, { status: 400 });
  }

  const platform = body.platform as SocialPlatform | undefined;
  if (!platform || !VALID_PLATFORMS.includes(platform)) {
    return NextResponse.json({ error: "Unknown platform." }, { status: 400 });
  }

  const tone = body.tone as SocialTone | undefined;
  if (!tone || !VALID_TONES.includes(tone)) {
    return NextResponse.json({ error: "Unknown tone." }, { status: 400 });
  }

  const agentInfo = body.agentInfo?.trim() ?? "";
  const { system, prompt } = buildSocialPostsPrompt(topic, platform, tone, agentInfo);

  try {
    const payload = await generateJSON<SocialPostsPayload>(prompt, 2000, system);
    if (!payload?.posts?.length) throw new Error("Model returned no posts");
    return NextResponse.json(payload);
  } catch (err) {
    console.error("social-posts generation failed", err);
    return NextResponse.json(
      { error: "Something went wrong generating the posts. Please try again." },
      { status: 502 }
    );
  }
}
