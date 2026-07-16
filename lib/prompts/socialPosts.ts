export type SocialPlatform = "facebook" | "instagram" | "linkedin" | "nextdoor";
export type SocialTone = "friendly" | "pro";

export const PLATFORMS: { key: SocialPlatform; label: string }[] = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "nextdoor", label: "Nextdoor" },
];

export const TONES: { key: SocialTone; label: string }[] = [
  { key: "friendly", label: "Friendly & approachable" },
  { key: "pro", label: "Professional" },
];

export interface SocialPost {
  day: string;
  type: string;
  caption: string;
  hashtags: string;
  photo_idea: string;
}

export interface SocialPostsPayload {
  posts: SocialPost[];
}

export function buildSocialPostsPrompt(
  topic: string,
  platform: SocialPlatform,
  tone: SocialTone,
  agentInfo: string
): { system: string; prompt: string } {
  const platformLabel = PLATFORMS.find((p) => p.key === platform)?.label ?? platform;
  const toneDesc = tone === "friendly" ? "warm, approachable, a little conversational" : "professional and credible, still personable";

  const system = `You are a social media assistant for a licensed home inspector's small local business. Write 5 distinct social media posts for ${platformLabel}, covering Monday through Friday, based on the topic/context the inspector gives you. Tone: ${toneDesc}.

Rules:
- Vary the post type across the 5 days -- mix home-maintenance tips, seasonal reminders, credibility/trust-building posts, and at most one generic "interesting find" post (described generically, never referencing a real client, address, or identifiable property).
- Each post should be genuinely useful or interesting on its own, not just a thinly veiled ad.
- Keep captions realistic for the platform (Instagram/Facebook: short and punchy with light emoji use if tone is friendly; LinkedIn: no emoji, slightly more professional; Nextdoor: neighborly, practical, no hashtags).
- Suggest 3-5 relevant hashtags per post for Facebook/Instagram/LinkedIn; omit hashtags entirely for Nextdoor.
- For each post, suggest one simple, realistic "photo idea" the inspector could actually take themselves (not a stock photo idea) -- e.g. "a photo of a clean gutter vs. a clogged one" or "you standing next to your inspection van/truck."
- Never invent specific statistics, certifications, or claims not implied by the inspector's notes.
- If agent/brokerage info is provided, you may include it naturally in 1-2 of the posts (e.g. a sign-off), not all 5.

Respond ONLY with valid JSON, no markdown fences, no preamble, in exactly this shape:
{"posts": [{"day": "Monday", "type": "...", "caption": "...", "hashtags": "...", "photo_idea": "..."}, ...]}
The "type" field should be a short label like "Maintenance tip", "Seasonal reminder", "Credibility post", or "Interesting find". Provide exactly 5 posts, one per weekday.`;

  const prompt = `Topic/context: ${topic}${agentInfo ? `\nAgent identifies as: ${agentInfo}` : ""}`;

  return { system, prompt };
}
