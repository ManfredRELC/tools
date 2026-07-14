import { NextRequest, NextResponse } from "next/server";
import { CATEGORIES, CategoryId, MAX_TONES } from "@/lib/categories";
import { buildListingPrompt } from "@/lib/prompts/listingDescription";
import { generateJSON } from "@/lib/anthropic";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSessionValue } from "@/lib/auth";

interface RequestBody {
  categoryId?: string;
  fields?: Record<string, string>;
  tones?: string[];
}

interface Listing {
  tone: string;
  headline: string;
  body: string;
}

export async function POST(request: NextRequest) {
  const sessionValue = await getSessionValue();
  const rateLimitKey = sessionValue ?? request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed } = checkRateLimit(rateLimitKey);
  if (!allowed) {
    return NextResponse.json(
      { error: "You've hit the hourly limit for generating descriptions. Try again in a bit." },
      { status: 429 }
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const categoryId = body.categoryId as CategoryId | undefined;
  if (!categoryId || !(categoryId in CATEGORIES)) {
    return NextResponse.json({ error: "Unknown property category." }, { status: 400 });
  }

  const category = CATEGORIES[categoryId];
  const fields = body.fields ?? {};
  const tones = (body.tones ?? []).filter((t): t is string => typeof t === "string").slice(0, MAX_TONES);

  if (category.usesTonePicker && tones.length === 0) {
    return NextResponse.json({ error: "Pick at least one tone." }, { status: 400 });
  }

  const hasAnyDetail = Object.values(fields).some((v) => typeof v === "string" && v.trim().length > 0);
  if (!hasAnyDetail) {
    return NextResponse.json(
      { error: "Add at least a few specs or features so the description has something to work with." },
      { status: 400 }
    );
  }

  const { prompt } = buildListingPrompt(category, fields, tones);

  try {
    const listings = await generateJSON<Listing[]>(prompt, 1200);
    if (!Array.isArray(listings) || listings.length === 0) {
      throw new Error("Model returned no listings");
    }
    return NextResponse.json({ listings });
  } catch (err) {
    console.error("listing-description generation failed", err);
    return NextResponse.json(
      { error: "Couldn't generate descriptions right now. Try again in a moment." },
      { status: 502 }
    );
  }
}
