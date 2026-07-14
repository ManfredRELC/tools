import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-5";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

async function callModel(prompt: string, maxTokens: number): Promise<string> {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    thinking: { type: "disabled" },
    messages: [{ role: "user", content: prompt }],
  });
  return response.content.map((block) => (block.type === "text" ? block.text : "")).join("\n");
}

function parseJSON<T>(text: string): T {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as T;
}

// Strips markdown fences and parses. On a parse failure, retries once with a
// stricter follow-up instruction before giving up.
export async function generateJSON<T>(prompt: string, maxTokens = 1000): Promise<T> {
  const raw = await callModel(prompt, maxTokens);
  try {
    return parseJSON<T>(raw);
  } catch {
    const retryPrompt = `${prompt}\n\nYour previous response could not be parsed as valid JSON. Return ONLY the JSON described above, with no prose, no markdown fences, and no explanation.`;
    const retryRaw = await callModel(retryPrompt, maxTokens);
    return parseJSON<T>(retryRaw);
  }
}
