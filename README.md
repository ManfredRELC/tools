# Manfred RELC — Agent Tools

AI-powered tools for Manfred Real Estate Learning Center's Membership Plus subscribers, at `tools.manfredrelc.com`.

This is Phase 1 (MVP): a single shared password gates the whole site, and one tool is live — the **Listing Description Generator**. The app is built so more tools can be added later without restructuring anything (see "Adding a new tool" below).

---

## 1. What's in this repo

- **Next.js app** (TypeScript, App Router) — pages for each tool, plus server-side API routes that call the Anthropic API. The browser never talks to Anthropic directly, so the API key is never exposed.
- **Password gate** — one shared password (an environment variable), checked on `/api/login`, which sets a signed cookie. No user accounts.
- **Design system** — the ink/paper/brass "sign rider" look, in `app/globals.css`, shared by every page and tool.
- **Listing Description Generator** — `app/tools/listing-description/`, backed by `app/api/listing-description/route.ts`.

---

## 2. Local development (optional)

You don't need this to deploy — skip to Section 3 if you just want the site live. This is only if you want to preview changes on your own computer first.

```bash
npm install
cp .env.example .env.local
# then open .env.local and fill in real values (see Section 4 for what each one means)
npm run dev
```

Visit `http://localhost:3000` — it'll redirect to the password page.

---

## 3. Deploying to Vercel (step by step)

### Step 1 — Push this repo to GitHub

If this code isn't already on GitHub, create a new repository and push this project to it. (If you're reading this from GitHub already, skip to Step 2.)

### Step 2 — Create a Vercel account and import the project

1. Go to [vercel.com](https://vercel.com) and sign up (the free "Hobby" plan is enough to start).
2. Click **Add New → Project**.
3. Choose **Import Git Repository** and select this repo. Vercel auto-detects it's a Next.js app — you don't need to change any build settings.
4. **Before clicking Deploy**, go to the **Environment Variables** section of the import screen and add the three variables from Section 4 below.
5. Click **Deploy**.

The first deploy will fail without the environment variables set, so do Step 4 first if you already deployed once — you can add them afterward in **Project Settings → Environment Variables** and then redeploy.

### Step 3 — Confirm auto-deploy is on

By default, every push to your main branch triggers a new deployment automatically. Nothing else to configure.

---

## 4. Environment variables

Set these in Vercel under **Project Settings → Environment Variables** (or in `.env.local` for local dev):

| Name | What it is | How to get it |
|---|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key, used server-side only | Generate a **production** key at [console.anthropic.com](https://console.anthropic.com) — see the open item about billing in Section 8 |
| `SITE_PASSWORD` | The one shared password members use to enter the site | Pick anything reasonably strong — this is what you'll email to Membership Plus subscribers |
| `SESSION_SECRET` | A long random string used to sign login sessions so they can't be forged | Generate one by running `openssl rand -hex 32` in a terminal, or use any password generator to make a 40+ character random string |

Nobody but you and Vercel ever sees these values — they're not visible in the browser or in the GitHub repo.

**To change the password later:** update `SITE_PASSWORD` in Vercel's environment variables and redeploy (Vercel prompts you to redeploy when you save a changed variable). Anyone still using the old password will be asked to log in again.

---

## 5. Connecting `tools.manfredrelc.com`

1. In your Vercel project, go to **Settings → Domains** and add `tools.manfredrelc.com`.
2. Vercel will show you a CNAME record to add — typically pointing `tools` to `cname.vercel-dns.com` (Vercel will show the exact value; use that one, it can change).
3. Log in to whatever service manages DNS for `manfredrelc.com` and add that CNAME record for the `tools` subdomain.
4. DNS changes can take anywhere from a few minutes to a few hours to take effect. Vercel's Domains page will show a green checkmark once it's live.

**Open item:** we don't know yet which DNS provider manages `manfredrelc.com` — see Section 8.

---

## 6. Adding a new tool later

The app is set up so a third tool is mostly copy-and-adapt, not a rebuild:

1. Add a new prompt builder in `lib/prompts/`.
2. Add a new API route in `app/api/<tool-name>/route.ts` that calls `generateJSON()` from `lib/anthropic.ts` (this already handles the server-side Anthropic call, JSON parsing, and a retry if the model wraps its answer in extra text).
3. Add a new page in `app/tools/<tool-name>/page.tsx`, reusing the shared components in `components/` (`Field`, `ToneChips`, `ResultCard`, `EmptyState`, etc.) so it automatically matches the existing look.
4. Add an entry to the `TOOLS` array in `app/tools/page.tsx` (dashboard) and to `NAV_ITEMS` in `components/Header.tsx` (top nav).

Every tool automatically sits behind the same password gate — nothing extra needed there.

---

## 7. Notes on current limits

- **Rate limiting:** `/api/listing-description` caps usage at 20 requests/hour per session, to protect the Anthropic bill from one member (or a bot with the password) running it in a loop. This counter lives in server memory, so it resets whenever Vercel spins up a new instance — it's a reasonable guardrail for the shared-password launch, not a hard cap. If usage grows and you want a stricter, persistent limit, that's a good candidate for a follow-up (e.g. Vercel KV or Upstash Redis).
- **Phase 2 (not built yet):** replacing the shared password with real WordPress Membership Plus login — e.g. a signed token WordPress issues when a logged-in member clicks "Open Tools," validated by this app. Worth doing once Phase 1 is live and being used.

---

## 8. Open items to resolve

These don't block getting the site live, but need an answer from you along the way:

1. **DNS provider** — where is `manfredrelc.com`'s DNS currently managed? Needed for the CNAME step in Section 5.
2. **Password distribution** — which email/CRM list (GoHighLevel?) should receive the shared password once this launches?
3. **Anthropic billing** — is there a production Anthropic API key ready for this app, separate from any personal claude.ai account? The app is metered by real usage once live.
