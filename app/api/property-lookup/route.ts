import { NextRequest, NextResponse } from "next/server";
import { geocodeAddress } from "@/lib/geocode/census";
import { CensusTractResult, PropertyLookupResult } from "@/lib/propertyLookup/types";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSessionValue } from "@/lib/auth";

interface RequestBody {
  address?: string;
}

export async function POST(request: NextRequest) {
  const sessionValue = await getSessionValue();
  const rateLimitKey = sessionValue ?? request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed } = checkRateLimit(rateLimitKey);
  if (!allowed) {
    return NextResponse.json(
      { error: "You've hit the hourly limit for property lookups. Try again in a bit." },
      { status: 429 }
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const address = body.address?.trim();
  if (!address) {
    return NextResponse.json({ error: "Enter an address first." }, { status: 400 });
  }

  let census: CensusTractResult | null;
  try {
    census = await geocodeAddress(address);
  } catch (err) {
    console.error("Census geocoding failed", err);
    return NextResponse.json(
      { error: "Couldn't reach the Census geocoder just now. Please try again in a moment." },
      { status: 502 }
    );
  }

  if (!census) {
    return NextResponse.json(
      { error: "Address not found. Try including the city and state, e.g. \"123 Main St, Albany, NY 12207\"." },
      { status: 404 }
    );
  }

  const payload: PropertyLookupResult = { census };
  return NextResponse.json(payload);
}
