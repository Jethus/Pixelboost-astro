# Copy Refresh — Pixelboost Landing Page

**Date:** 2026-04-28
**Scope:** Copy updates across all landing page sections, plus extracting all hardcoded copy into `.md` content files so a CMS can be attached later. No structural, layout, or functional changes beyond adding `getEntry()` calls to components that currently hardcode their content. Real PageSpeed API integration is deferred.

---

## Strategic Direction

Pixelboost = the small-business website report card + the person who fixes what it finds.

**Positioning:**
> Get a plain-English score for your current website. Then, if it needs work, I can rebuild it into a fast, accessible, trackable site — and stay on as your developer after launch.

The audit widget is the acquisition spine. Every section supports it: problem creates pain, audit delivers value, pillars explain the fix, results prove it works, pricing makes the ask clear.

---

## Section-by-Section Copy

### 1. Hero (`src/components/Hero.astro`)

**Headline** — keep as-is: "Websites that actually work for your small business."

**Subhead** (replace current):
> I build fast, accessible, trackable websites for Canadian small businesses — then stick around for updates, fixes, and improvements. No site-builder bloat, no surprise invoices, no disappearing after launch.

**Micro-copy below CTA** (replace current):
> Free report card. No email required. Takes 30 seconds.

*(No change — already correct.)*

---

### 2. Problem Section (`src/components/Problem.astro`)

**Section headline** — keep: "Your current site might be quietly costing you leads."

**Section subhead** (replace):
> Most small-business websites have at least one problem the owner can't see — but their customers feel every day. Here's where it usually shows up:

**Card 1 — Speed:**
- Title: `Your site loads slowly.`
- Body: `Customers leave before they see what you offer. On mobile, most people won't wait more than 3 seconds.`

**Card 2 — Analytics:**
- Title: `You can't see what's working.`
- Body: `No analytics means you're guessing where leads come from — and guessing what to fix.`

**Card 3 — Accessibility:**
- Title: `Some customers can't use it.`
- Body: `Accessibility issues block real people — older visitors, mobile users, anyone with a disability — from becoming customers.`

**Card 4 — Updates:**
- Title: `It's hard to update.`
- Body: `Every small change becomes a chore, a delay, or an extra invoice from someone you have to track down.`

---

### 3. Audit Section (`src/components/Audit.tsx`)

**Eyebrow chip:** `Free, no email required` *(keep)*

**Headline** (replace):
> See what your site actually scores.

**Body copy** (replace):
> I'll check your site's mobile speed, accessibility, SEO basics, tracking setup, and overall usability — then send a plain-English report showing what's working, what's broken, and what I'd fix first.

**Technical footnote** (replace):
> *Technically:* Uses Google's Lighthouse tool plus real-device usability checks. Google grades every website on speed, accessibility, SEO, and best practices — I use that as one benchmark alongside how real customers actually experience the site.

**Button label:** `Score my site →` *(keep)*

**After scan completes — verdict footer** (replace):
> Verdict → **Want the full breakdown sent to your inbox?**

**After scan — add email capture prompt below verdict:**
> Enter your email and I'll send a plain-English report: what each score means, what's broken, and the 3 fixes I'd start with.
> [email input] [Send my report →]
> Or: [Book a free 15-min call to walk through it →]

**Report card row subtitles** — update for plain language:
- Speed: `How fast pages load on a phone`
- Accessibility: `Can everyone actually use your site?`
- SEO basics: `Can Google find and read it?`
- Mobile experience: `Tap targets, layout, readability`
- Visitor tracking: `Do you know where your leads come from?`

---

### 4. Features/Pillars (`src/components/Features.astro`)

**Section headline** — keep: "Every site is built on the same four pillars."

**Section subhead** (replace):
> No template. No page builder you'll forget how to use. Just a clean site built around what your customers need to do next.

**Pillar 1 — Fast on mobile:**
- Pitch (replace): `Your site should load in under 3 seconds on a phone — even on a slow connection.`
- Proof: keep as-is

**Pillar 2 — Accessible by default:**
- Pitch: keep as-is
- Proof: keep as-is

**Pillar 3 — Tracked with simple analytics:**
- Pitch (replace): `You should know which pages bring in leads — without cookie banners or selling your visitors' data.`
- Proof: keep as-is

**Pillar 4 — Maintained after launch:**
- Pitch: keep as-is
- Proof: keep as-is

---

### 5. Portfolio / Results Section (`src/components/Portfolio.astro`, `src/content/landing/portfolio.md`)

**Nav label:** `Work` → `Results`

**Section eyebrow:** `Our Work` → `Results`

**Section headline** (replace):
> Real sites. Real scores. Before and after.

**Section subhead** — add (currently none):
> Every project starts with an audit. Here's what that looks like in practice.

---

### 6. Pricing (`src/content/landing/pricing.md`)

**Section headline** — keep: "Two ways to work together. No surprise invoices."

**Monthly plan — add descriptor line below title:**
> Best for businesses that want a new site plus ongoing access to a developer for updates, fixes, and small improvements throughout the year.

**Lump sum plan — add descriptor line below title:**
> Best for businesses that want the site built, launched, and handed over cleanly.

**Feature items** — keep all as-is. Ownership note ("Cancel anytime, take your site with you" / "You own the code and content outright") must remain visible.

---

### 7. FAQ (`src/components/FAQ.astro`)

**Add new question** (insert after "What if I already have a site?"):
- Q: `What does my site score mean?`
- A: `Google has a free tool called Lighthouse that grades every website on speed, accessibility, SEO, and best practices — 0 to 100. I use that as one honest benchmark, alongside real-device usability checks and whether your analytics are set up properly. A score of 90+ is good. Below 50 usually means visitors are feeling it, even if they can't name why.`

**Update existing Q: "Why do you keep mentioning 'Lighthouse' and 'Plausible'?"** → rename to:
- Q: `What tools do you actually use?`
- A: `Lighthouse is Google's free grading tool for website speed, accessibility, and SEO — it's the industry standard, and I use it as honest proof the site is actually good. Plausible is privacy-friendly analytics: visitor counts and traffic sources, no cookie banners, no selling data. You'll have access to the dashboards, not just me.`

---

### 8. Closing CTA (`src/components/ClosingCTA.astro`)

**Headline** (replace):
> Ready to see what your site actually scores?

**Body** (replace):
> Free report card. No email required. I'll check speed, accessibility, SEO basics, and whether you're tracking leads — then send a plain-English breakdown and the fixes I'd start with.

**Primary button:** `Score my site →` *(keep link to `#audit`)*
**Secondary button:** `Or just email me` *(keep)*

---

## Nav Changes

**Header.astro** — desktop and mobile nav:
- `Work` → `Results` (anchor stays `#work`)
- Nav labels stay hardcoded in `Header.astro` (not CMS-driven)

---

## Content Extraction — CMS-Ready Pattern

All sections currently hardcoding copy must move to `.md` files under `src/content/landing/` and be registered in `src/content.config.ts`. Components fetch via `getEntry()`. Follows the existing singleton collection pattern.

### New content files

**`src/content/landing/problem.md`**
Schema: `eyebrow`, `headline`, `subhead`, `cards[]` (title, body)

**`src/content/landing/audit.md`**
Schema: `eyebrow`, `headline`, `body`, `footnote`, `verdictIdle`, `verdictDone`, `emailCopy`, `callCopy`, `rows[]` (label, sub)

**`src/content/landing/features.md`**
Schema: `eyebrow`, `headline`, `subhead`, `pillars[]` (title, pitch, proof)

**`src/content/landing/faq.md`**
Schema: `eyebrow`, `headline`, `questions[]` (q, a)

### Updated content files

**`src/content/landing/portfolio.md`**
Add fields: `subhead`. Update `eyebrow`, `headline`.
Schema additions: `subhead: z.string()`

**`src/content/landing/pricing.md`**
Add `descriptor` field to each plan object.
Schema addition: `descriptor: z.string()` inside plan schema.

**`src/content/landing/cta.md`**
Add `body` field (currently missing).
Schema addition: `body: z.string()`

### Component changes (fetch only, no layout changes)

| Component | Was | Becomes |
|---|---|---|
| `Problem.astro` | Hardcoded `cards` array | `getEntry('landingProblem', 'problem')` |
| `Audit.tsx` | Hardcoded strings | Props passed from a thin `.astro` wrapper, or direct fetch via Astro content API at build time passed as props |
| `Features.astro` | Hardcoded `pillars` array | `getEntry('landingFeatures', 'features')` |
| `FAQ.astro` | Hardcoded `questions` array | `getEntry('landingFaq', 'faq')` |
| `Portfolio.astro` | Hardcoded eyebrow/headline | `getEntry('landingPortfolio', 'portfolio')` |
| `Pricing.astro` | Already uses `landingPricing` | Add `descriptor` render |
| `ClosingCTA.astro` | Already uses `landingCTA` | Add `body` render |

**Note on Audit.tsx:** It's a React island (`client:load`). React components can't call `getEntry()` directly. Solution: wrap in a thin `Audit.astro` that fetches content and passes it as props to `<Audit client:load {...content} />`. The TSX component accepts props instead of hardcoding strings.

---

## What Does NOT Change

- All component structure, layout, styling
- Pillar proof lines (except where noted)
- Pricing feature lists
- FAQ answers not listed above
- Hero CTA button labels
- All anchor IDs
- The Audit widget's scan logic, scoring, animation

---

## Files Touched

| File | Change |
|------|--------|
| `src/content.config.ts` | Register 4 new collections: `landingProblem`, `landingAudit`, `landingFeatures`, `landingFaq` |
| `src/content/landing/problem.md` | New file — all problem section copy |
| `src/content/landing/audit.md` | New file — all audit section copy |
| `src/content/landing/features.md` | New file — all pillars copy |
| `src/content/landing/faq.md` | New file — all FAQ questions |
| `src/content/landing/portfolio.md` | Add `subhead`, update `eyebrow`/`headline` |
| `src/content/landing/pricing.md` | Add `descriptor` per plan |
| `src/content/landing/cta.md` | Add `body` field |
| `src/components/Problem.astro` | Fetch from `landingProblem`, remove hardcoded copy |
| `src/components/Audit.tsx` | Accept copy as props instead of hardcoding |
| `src/components/Audit.astro` | New thin wrapper — fetches `landingAudit`, passes props to TSX island |
| `src/components/Features.astro` | Fetch from `landingFeatures`, remove hardcoded copy |
| `src/components/FAQ.astro` | Fetch from `landingFaq`, remove hardcoded copy |
| `src/components/Portfolio.astro` | Fetch `subhead` from `landingPortfolio` |
| `src/components/Pricing.astro` | Render `descriptor` per plan |
| `src/components/ClosingCTA.astro` | Render `body` field |
| `src/components/Hero.astro` | Update subhead copy (already content-driven via `landingHero`) |
| `src/components/Header.astro` | Nav label Work → Results (desktop + mobile) |
| `src/pages/index.astro` | Import `Audit` from `Audit.astro` instead of `Audit.tsx` directly |
