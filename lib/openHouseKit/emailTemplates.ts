export interface FollowUpEmailTemplate {
  key: string;
  stage: string;
  timing: string;
  subject: string;
  body: string;
}

export const FOLLOW_UP_EMAIL_TEMPLATES: FollowUpEmailTemplate[] = [
  {
    key: "same-day",
    stage: "Same-Day Thank You",
    timing: "Send within a few hours",
    subject: "Great meeting you at [Property Address] today",
    body: "Hi [Name],\n\nThanks so much for stopping by the open house at [Property Address] today — great to meet you. If any questions come up as you think it over, just reply here or call/text me at [Phone].\n\nHappy to set up a private showing, pull comparable sales, or answer anything about the neighborhood.\n\n[Your Name]\n[Brokerage] · [Phone]",
  },
  {
    key: "2-3-day",
    stage: "2-3 Day Follow-Up",
    timing: "Send 2-3 days later, if no reply yet",
    subject: "Following up on [Property Address]",
    body: "Hi [Name],\n\nWanted to check in after the open house at [Property Address] — still on your radar? Happy to answer questions, run additional comps, or set up a second look if it would help.\n\nNo pressure either way, just want to make sure you have what you need.\n\n[Your Name]\n[Brokerage] · [Phone]",
  },
  {
    key: "1-week",
    stage: "1-Week Check-In",
    timing: "Send about a week later, only if still no response",
    subject: "Quick check-in",
    body: "Hi [Name],\n\nHope your home search is going well! Just a friendly check-in — if [Property Address] is still in the mix, I'm happy to help however's useful. And if it's not the right fit, I'd love to hear what you're looking for so I can keep an eye out for you.\n\n[Your Name]\n[Brokerage] · [Phone]",
  },
  {
    key: "not-the-one",
    stage: "\"Not the One\" — Broaden the Search",
    timing: "Send if they've indicated this property isn't right for them",
    subject: "Let's find the right one for you",
    body: "Hi [Name],\n\nThanks again for checking out [Property Address] — totally understand if it wasn't quite the right fit. I'd love to learn more about what you're looking for (budget, area, must-haves) so I can send along listings that are actually a good match, instead of you having to hunt through everything yourself.\n\nDo you have a few minutes this week for a quick call?\n\n[Your Name]\n[Brokerage] · [Phone]",
  },
];
