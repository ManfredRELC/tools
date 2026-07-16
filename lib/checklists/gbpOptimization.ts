import { ChecklistSection } from "./types";

export const GBP_CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    id: "setup",
    title: "Profile Setup",
    sub: "Do this once, thoroughly",
    items: [
      "Claim and verify your Google Business Profile using your correct business name (matching your license — avoid keyword-stuffed names, which violates Google's guidelines and risks suspension)",
      'Select "Home Inspector" as your primary category, plus any accurate secondary categories',
      "Set your accurate service area rather than a storefront address, since most inspectors are service-area businesses",
      "Add complete contact info: phone number, website, and hours",
      'Write a complete "About" description that includes your license number and your specialty',
      "Upload a professional profile photo and cover photo",
      "Upload at least 10 real photos — you performing an inspection, your equipment, generic home-feature shots — never client-identifying images without permission",
    ],
  },
  {
    id: "reviews",
    title: "Reviews",
    sub: "Your most persuasive marketing asset",
    items: [
      "Set up a review-request template to send within 24 hours of report delivery",
      "Respond to every review within 48 hours — thank positive reviewers by name; address negative reviews calmly and move the conversation offline",
      "Never offer incentives of any kind in exchange for a review",
      "Aim for a steady, ongoing trickle of new reviews rather than asking a batch of past clients all at once",
    ],
  },
  {
    id: "activity",
    title: "Ongoing Activity",
    sub: "Keep the profile from going stale — revisit monthly",
    items: [
      "Post a weekly or biweekly update: a tip, a seasonal reminder, or a recent note",
      "Answer the Google Q&A section proactively — seed it with the questions clients actually ask you",
      "Add new photos at least once a month",
      "Check Google Business Profile Insights to see what's driving calls and clicks, and adjust accordingly",
    ],
  },
  {
    id: "seo",
    title: "Local SEO Basics",
    sub: "Beyond the profile itself",
    items: [
      "Make sure your business Name, Address (if applicable), and Phone number (NAP) are identical across your website, your profile, and any directories",
      "List your business on 2–3 relevant directories (your state inspector association, Yelp, Angi, etc.)",
      "Make sure your website naturally mentions your service area/town by name in a few places",
      'Add a simple "Home Maintenance Tips" or "Recent Inspections" page or blog for content that supports local search',
    ],
  },
];
