export type RelationshipTemplateType = "intro" | "lunch" | "thanks" | "onepager";

export interface RelationshipTemplate {
  type: RelationshipTemplateType;
  title: string;
  text: string;
}

export const TYPE_LABELS: Record<RelationshipTemplateType, string> = {
  intro: "Introduction outreach",
  lunch: "Lunch & learn",
  thanks: "Referral thank-you",
  onepager: "Meet-the-inspector flyer",
};

export const TYPE_FILTERS: { key: RelationshipTemplateType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "intro", label: "Introduction outreach" },
  { key: "lunch", label: "Lunch & learn" },
  { key: "thanks", label: "Referral thank-you" },
  { key: "onepager", label: "Meet-the-inspector flyer" },
];

export const RELATIONSHIP_TEMPLATES: RelationshipTemplate[] = [
  {
    type: "intro",
    title: "Cold email to a local brokerage",
    text: "Subject: Local home inspector — quick introduction\n\nHi [name],\n\nI'm [your name], a licensed New York home inspector serving [service area]. I wanted to introduce myself in case a client of yours ever needs a thorough, easy-to-schedule inspection.\n\nI'm happy to send over a sample report or stop by the office sometime if it's useful. No pressure either way — just wanted to be on your radar.\n\n[Your name]\n[Phone] · [License #] · [Website]",
  },
  {
    type: "intro",
    title: "In-person drop-by opener",
    text: "Hi, I'm [your name] — I'm a home inspector here in [town], and I just wanted to introduce myself and drop off a few cards in case it's ever helpful for your buyers. Happy to answer any questions about how I run my inspections.",
  },
  {
    type: "intro",
    title: "Follow-up after a first meeting",
    text: "Hi [name], great meeting you last week! Just following up in case a sample report or my availability calendar would be useful to have on hand. Looking forward to working together.",
  },
  {
    type: "lunch",
    title: "Lunch & Learn pitch outline (send to office manager)",
    text: "Subject: Free lunch-and-learn for your office?\n\nHi [name],\n\nI'd love to offer a quick 20-minute lunch-and-learn for your agents on what buyers should expect from a home inspection — common questions, how to prep clients, and what to watch for in older homes in our area.\n\nI'll bring lunch. No sales pitch — just useful info your agents can pass along to clients. Would [date] or [date] work for your office?\n\n[Your name]",
  },
  {
    type: "lunch",
    title: "Lunch & Learn talking points outline",
    text: "1. Quick intro — who you are, your background, your service area\n2. What a typical inspection covers (and what it legally can't, per NY's Standards of Practice)\n3. 3 most common surprises buyers have during inspections\n4. How agents can help set client expectations beforehand\n5. Q&A\n6. Leave contact cards + a one-pager",
  },
  {
    type: "thanks",
    title: "Thank-you after a referral",
    text: "Hi [agent name], just wanted to say thanks for sending [client name] my way — really enjoyed working with them. Let me know if there's ever anything I can do to make your side of the transaction easier.",
  },
  {
    type: "thanks",
    title: "Periodic relationship check-in (no referral needed to send)",
    text: "Hi [agent name], hope things are going well! Just checking in — anything coming up on your end where a quick inspection availability check would help? Always happy to work around tight timelines.",
  },
  {
    type: "onepager",
    title: "Meet-the-Inspector flyer copy",
    text: "[Your Name]\nLicensed New York Home Inspector · License #[XXXXXX]\nServing [service area]\n\n[1-2 sentence bio — use the Bio Generator above]\n\nWhat clients can expect:\n– Clear, easy-to-read reports within [X] business days\n– Direct availability for questions before and after the inspection\n– [Any specialty: new construction, older homes, etc.]\n\n[Phone] · [Email] · [Website]",
  },
];
