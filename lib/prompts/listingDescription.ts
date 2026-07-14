import { CategoryConfig } from "@/lib/categories";

const FAIR_HOUSING_CLAUSE = `This is a residential listing, so it must comply with Fair Housing advertising guidelines: never reference or imply a preference, limitation, or exclusion based on race, religion, sex, familial status, disability, or national origin. Do not use phrases like "perfect for families," "walk to church," "no kids," "ideal for singles," "great for retirees," or similar. Describe the property itself, not the kind of person who should live there.`;

const AUCTION_CLAUSE = `This is an auction listing, so use standard auction disclosure conventions: make clear the sale is subject to the stated terms and auction confirmation, and do not guarantee or imply a final sale price -- the price is determined at auction, not set in advance.`;

const BUSINESS_CLAUSE = `This is a business-for-sale listing, so do not present revenue, SDE, or other financial figures as guarantees or projections. Frame them explicitly as seller-reported figures (e.g. "seller reports annual revenue of...") per standard business-sale disclosure convention.`;

function complianceClauseFor(categoryId: CategoryConfig["id"]): string {
  switch (categoryId) {
    case "residential":
    case "manufactured":
    case "rental":
      return FAIR_HOUSING_CLAUSE;
    case "auction":
      return AUCTION_CLAUSE;
    case "business":
      return BUSINESS_CLAUSE;
    case "commercial":
      return `Avoid any language that could be read as discriminatory or that implies a preference for who occupies the space.`;
  }
}

function buildSpecLines(category: CategoryConfig, fields: Record<string, string>): string {
  const lines: string[] = [];
  for (const row of category.rows) {
    for (const field of row) {
      const value = fields[field.key]?.trim();
      if (value) lines.push(`${field.label}: ${value}`);
    }
  }
  return lines.join("\n");
}

export interface ListingPromptResult {
  prompt: string;
  variantCount: number;
}

export function buildListingPrompt(
  category: CategoryConfig,
  fields: Record<string, string>,
  tones: string[]
): ListingPromptResult {
  const specLines = buildSpecLines(category, fields);
  const complianceClause = complianceClauseFor(category.id);
  const variantTones = category.usesTonePicker ? tones : [category.fixedToneLabel ?? category.label];
  const variantCount = variantTones.length;

  const toneInstruction = category.usesTonePicker
    ? `Write ${variantCount} distinct listing description(s), one for each of these tones: ${variantTones.join(", ")}. Match each requested tone distinctly (e.g. "Luxury" should read differently from "Cozy & charming").`
    : `Write exactly 1 listing description in a clear, professional, compliance-conscious tone appropriate for this category.`;

  const prompt = `You are a real estate copywriter helping a licensed agent draft MLS-ready listing descriptions for a ${category.label} listing.

Property/listing details:
${specLines || "(no additional details provided)"}

${toneInstruction}

Requirements for each description:
- A short punchy headline (under 12 words)
- A body of 80-120 words, MLS-ready, no markdown formatting
- ${complianceClause}
- Do not invent specific facts or features not given above (e.g. don't invent a pool if none was mentioned) -- general appeal language is fine, but keep concrete claims to what was provided

Return ONLY valid JSON, no markdown code fences, no preamble, in this exact shape:
[
  {"tone": "tone name", "headline": "headline text", "body": "body text"}
]`;

  return { prompt, variantCount };
}
