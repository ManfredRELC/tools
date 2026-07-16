export type ReviewTemplateType = "request" | "positive" | "mixed" | "negative";

export interface ReviewTemplate {
  channel: string;
  type: ReviewTemplateType;
  title: string;
  text: string;
}

export const TYPE_LABELS: Record<ReviewTemplateType, string> = {
  request: "Review request",
  positive: "Positive response",
  mixed: "Mixed response",
  negative: "Negative response",
};

export const TYPE_FILTERS: { key: ReviewTemplateType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "request", label: "Review requests" },
  { key: "positive", label: "Positive review response" },
  { key: "mixed", label: "Mixed review response" },
  { key: "negative", label: "Negative review response" },
];

export const REVIEW_TEMPLATES: ReviewTemplate[] = [
  // REQUESTS
  {
    channel: "Text",
    type: "request",
    title: "Same-day text (send within 2–4 hours)",
    text: "Thanks again for having me out today! If you have 60 seconds, a quick Google review really helps other buyers find a trustworthy inspector: [review link]. I appreciate it!",
  },
  {
    channel: "Email",
    type: "request",
    title: "Report-delivery email",
    text: "Subject: Your inspection report is ready\n\nHi [client name],\n\nYour full inspection report for [property address] is attached/linked above. If anything needs clarifying, just reply here — happy to walk through it.\n\nIf you found the inspection helpful, a quick Google review goes a long way in helping other buyers find someone they can trust: [review link]. It only takes a minute, and I'd really appreciate it.\n\nThanks again for choosing me for this — good luck with the move!\n[Your name]",
  },
  {
    channel: "Print",
    type: "request",
    title: "Leave-behind card (printable)",
    text: "Thanks for trusting me with your inspection today.\n\nIf I did a good job, the best compliment is a quick Google review — scan the QR code or visit [short link].\n\n[Your name] · [Phone] · [License #]",
  },
  {
    channel: "Text",
    type: "request",
    title: "Gentle follow-up (send ~1 week later, only if no review yet)",
    text: "Hi [client name] — hope the move is going smoothly! No pressure at all, but if you have a spare minute, a Google review would really help other buyers find me: [review link]. Thanks either way!",
  },

  // POSITIVE RESPONSES
  {
    channel: "Response",
    type: "positive",
    title: "Standard thank-you (5-star, general)",
    text: "Thank you so much, [name]! It was a pleasure working with you, and I really appreciate you taking the time to leave a review. Wishing you all the best in your new home!",
  },
  {
    channel: "Response",
    type: "positive",
    title: "Thank-you referencing a specific detail",
    text: 'Thank you, [name] — really glad the [detail they mentioned, e.g. "walkthrough explanation"] was helpful! That\'s exactly what I aim for. Enjoy the new place!',
  },
  {
    channel: "Response",
    type: "positive",
    title: "Thank-you from an agent referral",
    text: "Thanks so much, [name]! And thank you to [agent name] for the referral — always appreciate working with great clients like you. Best of luck with the closing!",
  },

  // MIXED RESPONSES
  {
    channel: "Response",
    type: "mixed",
    title: "4-star / minor concern noted",
    text: "Thanks for the honest feedback, [name] — I really appreciate it. I'd love to hear more about [the specific point], if you're open to it — feel free to call or email me directly at [phone/email]. Always looking to do better.",
  },
  {
    channel: "Response",
    type: "mixed",
    title: "Mixed review, invite direct conversation",
    text: "Thank you for taking the time to share this, [name]. I want to make sure any concerns are fully addressed — please reach out directly at [phone/email] so we can talk it through.",
  },

  // NEGATIVE RESPONSES
  {
    channel: "Response",
    type: "negative",
    title: "Calm, non-defensive first response",
    text: "Hi [name], thank you for sharing this. I take feedback like this seriously and want to understand what happened. I've sent you a direct message/email so we can talk it through — I'd welcome the chance to make this right.",
  },
  {
    channel: "Response",
    type: "negative",
    title: "Negative review, factual and brief",
    text: "Hi [name], I'm sorry to hear the experience didn't meet your expectations. I'd like to understand more and see how I can help — please reach out to me directly at [phone/email] at your convenience.",
  },
  {
    channel: "Response",
    type: "negative",
    title: "Follow-up after resolving offline",
    text: "Thanks again for the conversation, [name] — glad we were able to work through this together. Please don't hesitate to reach out if anything else comes up.",
  },
];

export const CHANNELS: string[] = [
  "All channels",
  ...Array.from(new Set(REVIEW_TEMPLATES.map((d) => d.channel))),
];
