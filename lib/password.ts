// Constant-time-ish password comparison: hash both sides first so the
// comparison itself operates on fixed-length digests rather than the raw
// secret, then compare those digests without early-exit branching.

const encoder = new TextEncoder();

async function digest(value: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function passwordMatches(candidate: string): Promise<boolean> {
  const expected = process.env.SITE_PASSWORD;
  if (!expected) {
    throw new Error("SITE_PASSWORD environment variable is not set");
  }
  const [a, b] = await Promise.all([digest(candidate), digest(expected)]);
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
