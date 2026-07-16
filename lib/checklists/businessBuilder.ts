import { ChecklistSection } from "./types";

export const BUSINESS_BUILDER_SECTIONS: ChecklistSection[] = [
  {
    id: "legal",
    title: "Legal & Operational Foundation",
    sub: "Get this in place before you take a paid job",
    items: [
      "Choose a business structure (sole proprietorship, LLC, etc.) and register it with the NY Department of State if forming an LLC or corporation",
      "Obtain an EIN from the IRS",
      "Open a dedicated business bank account, separate from personal finances",
      "Secure general liability insurance meeting New York's minimum ($150,000 per occurrence / $500,000 aggregate per 19 NYCRR §197-1.1) and file proof with the NYS Department of State",
      "Set up bookkeeping (spreadsheet or software) to track income and expenses from day one",
      "Confirm your home inspector license number displays correctly on your website, contracts, and all advertising (required by §444-g(2))",
      "Draft or purchase a pre-inspection agreement template that includes New York's two required clauses (§197-4.2(a))",
      "Set a renewal reminder for your 2-year license cycle and the 24 hours of continuing education required before renewal",
    ],
  },
  {
    id: "tooling",
    title: "Tooling & Systems",
    sub: "The software and accounts that run your day-to-day",
    items: [
      "Choose report-writing software",
      "Choose a scheduling tool or calendar system clients can book directly into",
      "Set up a payment processor for online payment collection",
      "Choose a CRM or simple spreadsheet to track leads, past clients, and referral sources",
      "Set up a professional email address and phone number, separate from personal use",
    ],
  },
  {
    id: "first90",
    title: "First 90 Days",
    sub: "The launch sequence — order matters here",
    items: [
      "Create your Google Business Profile — do this before printing anything else",
      "Build a simple one-page website with your license number, service area, and contact info",
      "Order business cards and any yard signs or sign-in materials for use at inspections",
      "Introduce yourself to 5–10 local real estate offices, in person or by email",
      "Ask every early client for a review within 24 hours of report delivery",
      "Join your state home inspector association for referrals and continuing-education credit",
      "Set up your review-request and follow-up templates so they're ready to send from day one",
    ],
  },
  {
    id: "ongoing",
    title: "Ongoing Business Hygiene",
    sub: "Revisit this every quarter",
    items: [
      "Review your Google Business Profile: respond to new reviews, add fresh photos, post an update",
      "Check your liability insurance renewal date and NYS DOS filing status",
      "Reconcile your bookkeeping and set aside estimated taxes",
      "Reach out to your top 3–5 referring agents with a check-in or thank-you",
      "Review your continuing-education hours completed vs. required for your renewal cycle",
      "Revisit your pricing against current local market rates",
    ],
  },
];
