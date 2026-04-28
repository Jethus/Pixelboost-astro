# Copy Refresh + CMS-Ready Content Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update all landing page copy to the new positioning ("report card + the person who fixes it") and extract all hardcoded section copy into `.md` content files so a CMS can be attached later.

**Architecture:** Each section component fetches its own data via `getEntry()` from a singleton `.md` collection registered in `content.config.ts`. React island `Audit.tsx` receives copy as props from a new thin `Audit.astro` wrapper that does the content fetch. No structural or layout changes.

**Tech Stack:** Astro 6, Astro Content Collections, React 19 (TSX island), TypeScript, Tailwind CSS v4

---

## File Map

| Status | File | Purpose |
|--------|------|---------|
| Create | `src/content/landing/problem.md` | Problem section copy |
| Create | `src/content/landing/audit.md` | Audit section copy |
| Create | `src/content/landing/features.md` | Features/pillars copy |
| Create | `src/content/landing/faq.md` | FAQ questions + answers |
| Create | `src/components/Audit.astro` | Thin wrapper: fetches audit content, passes as props to TSX island |
| Modify | `src/content.config.ts` | Register 4 new collections |
| Modify | `src/content/landing/portfolio.md` | Add `subhead` field, update eyebrow/headline |
| Modify | `src/content/landing/pricing.md` | Add `descriptor` per plan |
| Modify | `src/content/landing/cta.md` | Add `body` field |
| Modify | `src/content/landing/hero.md` | Update `description` field |
| Modify | `src/components/Problem.astro` | Fetch from `landingProblem`, remove hardcoded copy |
| Modify | `src/components/Audit.tsx` | Accept copy as props instead of hardcoding strings |
| Modify | `src/components/Features.astro` | Fetch from `landingFeatures`, remove hardcoded copy |
| Modify | `src/components/FAQ.astro` | Fetch from `landingFaq`, remove hardcoded copy |
| Modify | `src/components/Portfolio.astro` | Fetch `subhead` from `landingPortfolio` |
| Modify | `src/components/Pricing.astro` | Render `descriptor` per plan |
| Modify | `src/components/ClosingCTA.astro` | Render `body` field |
| Modify | `src/components/Header.astro` | `Work` → `Results` (desktop + mobile) |
| Modify | `src/pages/index.astro` | Import `Audit` from `Audit.astro` instead of `Audit.tsx` |

---

## Task 1: Register new collections in content.config.ts

**Files:**
- Modify: `src/content.config.ts`

- [ ] **Step 1: Add 4 new collection definitions**

Open `src/content.config.ts`. After the `landingCTA` collection definition (line ~115), add:

```typescript
const landingProblem = defineCollection({
  loader: glob({ pattern: "problem.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    subhead: z.string(),
    cards: z.array(z.object({
      title: z.string(),
      body: z.string(),
    })),
  }),
});

const landingAudit = defineCollection({
  loader: glob({ pattern: "audit.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    body: z.string(),
    footnote: z.string(),
    verdictIdle: z.string(),
    verdictDone: z.string(),
    emailCopy: z.string(),
    callCopy: z.string(),
    rows: z.array(z.object({
      key: z.enum(['perf', 'a11y', 'seo', 'mobile', 'tracking']),
      label: z.string(),
      sub: z.string(),
    })),
  }),
});

const landingFeatures = defineCollection({
  loader: glob({ pattern: "features.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    subhead: z.string(),
    pillars: z.array(z.object({
      title: z.string(),
      pitch: z.string(),
      proof: z.string(),
    })),
  }),
});

const landingFaq = defineCollection({
  loader: glob({ pattern: "faq.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    questions: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })),
  }),
});
```

- [ ] **Step 2: Add new collections to the exports object**

Find the `export const collections = {` block at the bottom of the file and add the 4 new entries:

```typescript
export const collections = {
  blog,
  services,
  portfolio,
  landingHero,
  landingWhatWeOffer,
  landingPortfolio,
  landingComparison,
  landingPricing,
  landingCTA,
  landingProblem,
  landingAudit,
  landingFeatures,
  landingFaq,
};
```

- [ ] **Step 3: Update landingPortfolio schema to add subhead**

Find the `landingPortfolio` collection definition and add `subhead`:

```typescript
const landingPortfolio = defineCollection({
  loader: glob({ pattern: "portfolio.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    subhead: z.string(),
  }),
});
```

- [ ] **Step 4: Update landingPricing schema to add descriptor per plan**

Find the `landingPricing` collection definition. Inside the plan object schema, add `descriptor`:

```typescript
const landingPricing = defineCollection({
  loader: glob({ pattern: "pricing.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    plans: z.array(
      z.object({
        variant: z.string(),
        title: z.string(),
        descriptor: z.string(),
        price: z.string(),
        priceNote: z.string(),
        features: z.array(
          z.object({
            text: z.string(),
            included: z.boolean().default(true),
          })
        ),
      })
    ),
  }),
});
```

- [ ] **Step 5: Update landingCTA schema to add body**

Find the `landingCTA` collection definition and add `body`:

```typescript
const landingCTA = defineCollection({
  loader: glob({ pattern: "cta.md", base: "src/content/landing" }),
  schema: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    body: z.string(),
    buttonText: z.string(),
    buttonLink: z.string(),
  }),
});
```

- [ ] **Step 6: Verify build compiles (schemas only, no content files yet — expect content errors)**

```bash
cd C:/repos/pixelboost-astro && npm run build 2>&1 | head -40
```

Expected: errors about missing `.md` files — that's fine. No TypeScript errors in the config itself.

- [ ] **Step 7: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: register problem, audit, features, faq collections; extend portfolio, pricing, cta schemas"
```

---

## Task 2: Create content files for hardcoded sections

**Files:**
- Create: `src/content/landing/problem.md`
- Create: `src/content/landing/audit.md`
- Create: `src/content/landing/features.md`
- Create: `src/content/landing/faq.md`

- [ ] **Step 1: Create problem.md**

Create `src/content/landing/problem.md`:

```markdown
---
eyebrow: Why it matters
headline: Your current site might be quietly costing you leads.
subhead: Most small-business websites have at least one problem the owner can't see — but their customers feel every day. Here's where it usually shows up:
cards:
  - title: Your site loads slowly.
    body: Customers leave before they see what you offer. On mobile, most people won't wait more than 3 seconds.
  - title: You can't see what's working.
    body: No analytics means you're guessing where leads come from — and guessing what to fix.
  - title: Some customers can't use it.
    body: Accessibility issues block real people — older visitors, mobile users, anyone with a disability — from becoming customers.
  - title: It's hard to update.
    body: Every small change becomes a chore, a delay, or an extra invoice from someone you have to track down.
---
```

- [ ] **Step 2: Create audit.md**

Create `src/content/landing/audit.md`:

```markdown
---
eyebrow: Free, no email required
headline: See what your site actually scores.
body: I'll check your site's mobile speed, accessibility, SEO basics, tracking setup, and overall usability — then send a plain-English report showing what's working, what's broken, and what I'd fix first.
footnote: "Uses Google's Lighthouse tool plus real-device usability checks. Google grades every website on speed, accessibility, SEO, and best practices — I use that as one benchmark alongside how real customers actually experience the site."
verdictIdle: Enter your URL above to run a real scan.
verdictDone: Want the full breakdown sent to your inbox?
emailCopy: "Enter your email and I'll send a plain-English report: what each score means, what's broken, and the 3 fixes I'd start with."
callCopy: Book a free 15-min call to walk through it →
rows:
  - key: perf
    label: Speed
    sub: How fast pages load on a phone
  - key: a11y
    label: Accessibility
    sub: Can everyone actually use your site?
  - key: seo
    label: SEO basics
    sub: Can Google find and read it?
  - key: mobile
    label: Mobile experience
    sub: Tap targets, layout, readability
  - key: tracking
    label: Visitor tracking
    sub: Do you know where your leads come from?
---
```

- [ ] **Step 3: Create features.md**

Create `src/content/landing/features.md`:

```markdown
---
eyebrow: What you actually get
headline: Every site is built on the same four pillars.
subhead: No template. No page builder you'll forget how to use. Just a clean site built around what your customers need to do next.
pillars:
  - title: Fast on mobile.
    pitch: Your site should load in under 3 seconds on a phone — even on a slow connection.
    proof: I target 95+ Google Lighthouse performance scores on real devices.
  - title: Accessible by default.
    pitch: Your site should work for every customer — older folks, mobile users, anyone with a disability.
    proof: WCAG 2.1 AA, AODA-aligned, tested with axe and real assistive tech.
  - title: Tracked with simple analytics.
    pitch: You should know which pages bring in leads — without cookie banners or selling your visitors' data.
    proof: Privacy-friendly Plausible analytics. GDPR/PIPEDA-compliant. No banner needed.
  - title: Maintained after launch.
    pitch: After launch, I'm still your developer. Hours changed, new service, copy fix? Send it.
    proof: Included in the monthly plan. Same-week turnaround for small changes.
---
```

- [ ] **Step 4: Create faq.md**

Create `src/content/landing/faq.md`:

```markdown
---
eyebrow: FAQ
headline: Reasonable questions, plain answers.
questions:
  - q: How long does a project take?
    a: About 3–4 weeks from kickoff for most small-business sites. Larger projects with more pages, custom integrations, or content I have to write run 5–6 weeks. I only take on two projects at a time so timelines are honest.
  - q: What's included in the $200/month plan?
    a: The full custom build, hosting, domain setup, SSL, analytics installed, and ongoing updates — copy changes, new pages, fixing things, swapping photos. Anything that takes me less than an hour or two is just included. Big new features get quoted separately so there are no surprises.
  - q: Am I locked into a contract?
    a: No. The monthly plan is month-to-month, cancel anytime. If you leave, I help you migrate the site to wherever you want — you own the code and the content.
  - q: Who owns the website?
    a: You do, on both plans. The code, the design, the content, the domain, the analytics — all yours. I don't hold anything hostage.
  - q: What if I already have a site?
    a: Then we start with a free audit (above). About a third of the time, the right answer is "your site is mostly fine, here are 3 small fixes." If a rebuild does make sense, we go from there.
  - q: What does my site score mean?
    a: Google has a free tool called Lighthouse that grades every website on speed, accessibility, SEO, and best practices — 0 to 100. I use that as one honest benchmark, alongside real-device usability checks and whether your analytics are set up properly. A score of 90+ is good. Below 50 usually means visitors are feeling it, even if they can't name why.
  - q: Do you only work with Ontario businesses?
    a: No, just Canadian. I work with clients across Ontario and the Maritimes mostly, but anywhere in Canada is fine. Time zones matter more than borders.
  - q: What tools do you actually use?
    a: Lighthouse is Google's free grading tool for website speed, accessibility, and SEO — it's the industry standard, and I use it as honest proof the site is actually good. Plausible is privacy-friendly analytics — visitor counts and traffic sources, no cookie banners, no selling data. You'll have access to the dashboards, not just me.
---
```

- [ ] **Step 5: Commit**

```bash
git add src/content/landing/problem.md src/content/landing/audit.md src/content/landing/features.md src/content/landing/faq.md
git commit -m "feat: add problem, audit, features, faq content files"
```

---

## Task 3: Update existing content files

**Files:**
- Modify: `src/content/landing/portfolio.md`
- Modify: `src/content/landing/pricing.md`
- Modify: `src/content/landing/cta.md`
- Modify: `src/content/landing/hero.md`

- [ ] **Step 1: Update portfolio.md**

Replace the entire file `src/content/landing/portfolio.md` with:

```markdown
---
eyebrow: Results
headline: Real sites. Real scores. Before and after.
subhead: Every project starts with an audit. Here's what that looks like in practice.
---
```

- [ ] **Step 2: Update pricing.md — add descriptor per plan**

Replace the entire file `src/content/landing/pricing.md` with:

```markdown
---
eyebrow: Pricing
headline: "Two ways to work together. No surprise invoices."
plans:
  - variant: monthly
    title: Pixelboost monthly
    descriptor: Best for businesses that want a new site plus ongoing access to a developer for updates, fixes, and small improvements throughout the year.
    price: "$200"
    priceNote: "/ month"
    features:
      - text: Custom design + build (3–4 weeks)
        included: true
      - text: Hosting, SSL, domain setup
        included: true
      - text: Plausible analytics installed
        included: true
      - text: Ongoing updates & small changes
        included: true
      - text: Quarterly performance check-ins
        included: true
      - text: Cancel anytime, take your site with you
        included: true
  - variant: lump
    title: Build & hand-off
    descriptor: Best for businesses that want the site built, launched, and handed over cleanly.
    price: "$4,800"
    priceNote: "flat"
    features:
      - text: Same custom design + build
        included: true
      - text: Plausible installed and explained
        included: true
      - text: Documented and handed off cleanly
        included: true
      - text: 30 days of post-launch fixes
        included: true
      - text: You own the code and content outright
        included: true
      - text: "Optional: add monthly support later"
        included: true
---
```

- [ ] **Step 3: Update cta.md — add body field**

Replace the entire file `src/content/landing/cta.md` with:

```markdown
---
eyebrow: Ready for a change?
headline: Ready to see what your site actually scores?
body: Free report card. No email required. I'll check speed, accessibility, SEO basics, and whether you're tracking leads — then send a plain-English breakdown and the fixes I'd start with.
buttonText: Score my site →
buttonLink: "#audit"
---
```

- [ ] **Step 4: Update hero.md — update description**

Replace the entire file `src/content/landing/hero.md` with:

```markdown
---
eyebrow: Web Design & Development
headline: Transform your business with professional <span>web design</span>
description: >
  I build fast, accessible, trackable websites for Canadian small businesses — then stick around for updates, fixes, and improvements. No site-builder bloat, no surprise invoices, no disappearing after launch.
cta1Text: Get in touch
cta1Link: /contact
cta2Text: See our work
cta2Link: "#portfolio"
---
```

- [ ] **Step 5: Commit**

```bash
git add src/content/landing/portfolio.md src/content/landing/pricing.md src/content/landing/cta.md src/content/landing/hero.md
git commit -m "feat: update portfolio, pricing, cta, hero content files with new copy"
```

---

## Task 4: Refactor Problem.astro to fetch from content

**Files:**
- Modify: `src/components/Problem.astro`

- [ ] **Step 1: Replace hardcoded copy with getEntry fetch**

Replace the entire frontmatter block (lines 1–26) of `src/components/Problem.astro`. The SVG icons stay hardcoded (they're not copy). Map the fetched cards onto the existing icon array by index.

Replace the `---` frontmatter section with:

```typescript
---
import { getEntry } from "astro:content";

const doc = await getEntry("landingProblem", "problem");
if (!doc) throw new Error("Could not find problem content");
const { eyebrow, headline, subhead, cards } = doc.data;

const icons = [
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
];
---
```

- [ ] **Step 2: Update the template to use fetched data**

In the HTML template, replace the three hardcoded strings and the cards loop.

Replace the eyebrow text:
```html
<span class="eyebrow-chip">
  <span class="eyebrow-dot"></span> {eyebrow}
</span>
```

Replace the `<h2>` — keep the `<span class="high">` but split the headline at "costing you leads" since it's highlighted. Since the headline is now a plain string from .md, use `set:html` to preserve the original `<span>`:
```html
<h2 style="margin: 0 0 16px 0;" set:html={headline} />
```

Replace the `<p>` subhead:
```html
<p style="font-size: clamp(16px, 1.35vw, 19px); color: var(--color-ink-500); line-height: 1.5; max-width: 56ch; margin: 0; font-weight: 500;">
  {subhead}
</p>
```

Replace the cards loop (icons merged by index):
```astro
{cards.map((card, i) => (
  <div class="problem-card">
    <div class="icon-tile" set:html={icons[i]} />
    <h3 style="font-size: 18px; font-weight: 700; margin: 0; letter-spacing: -0.01em;">{card.title}</h3>
    <p style="margin: 0; font-size: 14.5px; color: var(--color-ink-500); line-height: 1.5;">{card.body}</p>
  </div>
))}
```

**Note on headline:** The current headline has `<span class="high">costing you leads.</span>` inline. Since the headline is now a plain string in the `.md`, update `problem.md` headline to include the span:
```
headline: "Your current site might be quietly <span class=\"high\">costing you leads.</span>"
```
And use `set:html` on the `<h2>` as shown above.

- [ ] **Step 3: Verify build passes**

```bash
cd C:/repos/pixelboost-astro && npm run build 2>&1 | tail -20
```

Expected: build completes with no errors. Check that the problem section renders with new copy.

- [ ] **Step 4: Commit**

```bash
git add src/components/Problem.astro src/content/landing/problem.md
git commit -m "feat: extract Problem section copy to content collection"
```

---

## Task 5: Refactor Features.astro to fetch from content

**Files:**
- Modify: `src/components/Features.astro`

- [ ] **Step 1: Replace hardcoded pillars with getEntry fetch**

Replace the frontmatter block (lines 1–28) of `src/components/Features.astro` with:

```typescript
---
import { getEntry } from "astro:content";

const doc = await getEntry("landingFeatures", "features");
if (!doc) throw new Error("Could not find features content");
const { eyebrow, headline, subhead, pillars } = doc.data;

const icons = [
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-5.87.94"/><path d="m5 8 3-3 5.5 1.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
];
---
```

- [ ] **Step 2: Update template to use fetched data**

Replace the eyebrow chip text:
```html
<span class="eyebrow-chip">
  <span class="eyebrow-dot"></span> {eyebrow}
</span>
```

Replace the `<h2>` (headline has no inline HTML, plain string is fine):
```html
<h2 style="margin: 0 0 16px 0;">
  {headline}
</h2>
```

Replace the subhead `<p>`:
```html
<p style="font-size: clamp(16px, 1.35vw, 19px); color: var(--color-ink-500); line-height: 1.5; max-width: 56ch; margin: 0; font-weight: 500;">
  {subhead}
</p>
```

Replace the pillars loop:
```astro
{pillars.map((p, i) => (
  <div class="pillar-card">
    <div class="icon-tile" set:html={icons[i]} />
    <h3 style="font-size: 19px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; margin: 4px 0 0 0;">{p.title}</h3>
    <p style="font-size: 14.5px; line-height: 1.5; color: var(--color-ink-700); margin: 0;">{p.pitch}</p>
    <p class="proof-line"><em>Technically:</em> {p.proof}</p>
  </div>
))}
```

- [ ] **Step 3: Verify build passes**

```bash
cd C:/repos/pixelboost-astro && npm run build 2>&1 | tail -20
```

Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Features.astro
git commit -m "feat: extract Features/pillars copy to content collection"
```

---

## Task 6: Refactor FAQ.astro to fetch from content

**Files:**
- Modify: `src/components/FAQ.astro`

- [ ] **Step 1: Replace hardcoded questions with getEntry fetch**

Replace the frontmatter block (lines 1–31) of `src/components/FAQ.astro` with:

```typescript
---
import { getEntry } from "astro:content";

const doc = await getEntry("landingFaq", "faq");
if (!doc) throw new Error("Could not find FAQ content");
const { eyebrow, headline, questions } = doc.data;
---
```

- [ ] **Step 2: Update template to use fetched data**

Replace the eyebrow chip text:
```html
<span class="eyebrow-chip">
  <span class="eyebrow-dot"></span> {eyebrow}
</span>
```

Replace the `<h2>`:
```html
<h2 style="margin: 0 0 0 0;">{headline}</h2>
```

Replace the questions loop:
```astro
{questions.map((item, i) => (
  <details class="faq-item" open={i === 0}>
    <summary class="faq-q">{item.q}</summary>
    <div class="faq-a">{item.a}</div>
  </details>
))}
```

- [ ] **Step 3: Verify build passes**

```bash
cd C:/repos/pixelboost-astro && npm run build 2>&1 | tail -20
```

Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/FAQ.astro
git commit -m "feat: extract FAQ copy to content collection"
```

---

## Task 7: Refactor Portfolio.astro to fetch subhead from content

**Files:**
- Modify: `src/components/Portfolio.astro`

- [ ] **Step 1: Add getEntry fetch to Portfolio.astro frontmatter**

Add the import and fetch at the top of the frontmatter (after the existing imports):

```typescript
---
import { getCollection, getEntry } from "astro:content";
import { Image } from "astro:assets";

const landingDoc = await getEntry("landingPortfolio", "portfolio");
if (!landingDoc) throw new Error("Could not find portfolio landing content");
const { eyebrow, headline, subhead } = landingDoc.data;

const clientsDocs = await getCollection("portfolio");

const trendingUp = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`;
---
```

- [ ] **Step 2: Update template header to use fetched data**

Replace the hardcoded eyebrow, h2, and the existing `<p>` subhead in the header div. The current template has a hardcoded eyebrow of `Recent work` and the headline. Replace the entire header `<div style="max-width: 780px;">` block:

```astro
<div style="max-width: 780px;">
  <span class="eyebrow-chip" style="background: var(--color-paper);">
    <span class="eyebrow-dot"></span> {eyebrow}
  </span>
  <h2 style="margin: 0 0 16px 0;" set:html={headline} />
  <p style="font-size: clamp(16px, 1.35vw, 19px); color: var(--color-ink-500); line-height: 1.5; max-width: 56ch; margin: 0; font-weight: 500;">
    {subhead}
  </p>
</div>
```

- [ ] **Step 3: Verify build passes**

```bash
cd C:/repos/pixelboost-astro && npm run build 2>&1 | tail -20
```

Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Portfolio.astro
git commit -m "feat: extract Portfolio section header copy to content collection"
```

---

## Task 8: Update Pricing.astro to render descriptor

**Files:**
- Modify: `src/components/Pricing.astro`

- [ ] **Step 1: Replace hardcoded plan-blurb with descriptor from content**

In `src/components/Pricing.astro`, find the two hardcoded `plan-blurb` paragraphs:

Featured card (line ~32):
```html
<p class="plan-blurb">Custom site + ongoing care, all-in.</p>
```
Replace with:
```astro
<p class="plan-blurb">{featured.descriptor}</p>
```

Standard card (line ~42):
```html
<p class="plan-blurb">One-time build, you take it from there.</p>
```
Replace with:
```astro
<p class="plan-blurb">{standard.descriptor}</p>
```

- [ ] **Step 2: Verify build passes**

```bash
cd C:/repos/pixelboost-astro && npm run build 2>&1 | tail -20
```

Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Pricing.astro
git commit -m "feat: render descriptor from content in Pricing cards"
```

---

## Task 9: Update ClosingCTA.astro to render body

**Files:**
- Modify: `src/components/ClosingCTA.astro`

- [ ] **Step 1: Add getEntry fetch to ClosingCTA.astro**

Replace the empty frontmatter block at the top of `src/components/ClosingCTA.astro`:

```typescript
---
import { getEntry } from "astro:content";

const doc = await getEntry("landingCTA", "cta");
if (!doc) throw new Error("Could not find CTA content");
const { headline, body, buttonText, buttonLink } = doc.data;
---
```

- [ ] **Step 2: Update template to use fetched data**

Replace the hardcoded headline `<h2>`:
```astro
<h2 style="color: var(--color-paper); margin: 0 0 16px 0;">{headline}</h2>
```

Replace the hardcoded `<p>`:
```astro
<p style="font-size: clamp(16px, 1.35vw, 19px); color: rgba(248,245,238,0.7); line-height: 1.5; max-width: 56ch; margin: 0 auto 32px; font-weight: 500;">
  {body}
</p>
```

Replace the primary button:
```astro
<a href={buttonLink} class="cta-btn-mint">{buttonText}</a>
```

- [ ] **Step 3: Verify build passes**

```bash
cd C:/repos/pixelboost-astro && npm run build 2>&1 | tail -20
```

Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ClosingCTA.astro
git commit -m "feat: extract ClosingCTA copy to content collection"
```

---

## Task 10: Refactor Audit.tsx to accept props + create Audit.astro wrapper

**Files:**
- Modify: `src/components/Audit.tsx`
- Create: `src/components/Audit.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Define AuditContent props interface and update Audit.tsx**

`Audit.tsx` currently hardcodes all strings. Replace the hardcoded row definitions and string literals with props.

Replace the top of `src/components/Audit.tsx` (lines 1–21, before the `TARGETS` constant):

```typescript
import { useState, useEffect, useRef } from 'react';

type AuditState = 'idle' | 'scanning' | 'done';

interface Scores {
  perf: number;
  a11y: number;
  seo: number;
  mobile: number;
  tracking: number;
}

export interface AuditRow {
  key: keyof Scores;
  label: string;
  sub: string;
}

export interface AuditContent {
  eyebrow: string;
  headline: string;
  body: string;
  footnote: string;
  verdictIdle: string;
  verdictDone: string;
  emailCopy: string;
  callCopy: string;
  rows: AuditRow[];
}

const TARGETS: Scores = { perf: 58, a11y: 71, seo: 84, mobile: 49, tracking: 25 };
```

- [ ] **Step 2: Update Audit function signature to accept props**

Replace the `export default function Audit()` signature:

```typescript
export default function Audit({
  eyebrow,
  headline,
  body,
  footnote,
  verdictIdle,
  verdictDone,
  emailCopy,
  callCopy,
  rows,
}: AuditContent) {
```

- [ ] **Step 3: Replace hardcoded strings in the JSX**

In the JSX, replace:
- The eyebrow chip text `Free, no email required` → `{eyebrow}`
- The `<h2>` content `Get a free <span ...>website report card.</span>` → `{headline}` (plain, no inline span — headline from .md is plain text)
- The body `<p>` content → `{body}`
- The technical footnote `<p>` → update to use `{footnote}` (the `Technically:` label stays hardcoded as it's a UI label, not copy):

```tsx
<p style={{ fontSize: '12.5px', color: 'rgba(248,245,238,0.55)', fontStyle: 'italic', margin: '0 0 0 2px' }}>
  <em style={{ color: 'var(--color-mint-300)', fontStyle: 'normal' }}>Technically:</em> {footnote}
</p>
```

- The `ROWS` constant is now replaced by the `rows` prop — remove the `ROWS` constant entirely and replace all references to `ROWS` in the JSX with `rows`.

- The verdict footer — replace the hardcoded strings:

```tsx
<p style={{ fontSize: '13.5px', fontWeight: 600, margin: 0 }}>
  {state === 'done'
    ? <>{verdictDone} <strong style={{ color: 'var(--color-mint-700)' }}>5 fixes could save ~1 in 2 visitors.</strong></>
    : state === 'scanning'
      ? 'Scanning your site…'
      : <>Verdict → <strong>{verdictIdle}</strong></>
  }
</p>
```

- After the verdict, add the email capture block (only visible when `state === 'done'`):

```tsx
{state === 'done' && (
  <div style={{
    padding: '14px 22px',
    borderTop: '1px solid var(--color-line)',
    background: 'var(--color-paper)',
    display: 'flex', flexDirection: 'column', gap: '10px',
  }}>
    <p style={{ fontSize: '13px', color: 'var(--color-ink-700)', margin: 0, lineHeight: 1.5 }}>
      {emailCopy}
    </p>
    <form style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} onSubmit={e => e.preventDefault()}>
      <input
        type="email"
        placeholder="you@yourbusiness.ca"
        aria-label="Your email address"
        style={{
          flex: 1, minWidth: '160px',
          fontFamily: 'inherit', fontSize: '14px',
          padding: '10px 16px',
          background: 'var(--color-paper-2)',
          border: '1.5px solid var(--color-line)',
          borderRadius: '9999px',
          outline: 'none',
          color: 'var(--color-ink)',
        }}
      />
      <button
        type="submit"
        style={{
          display: 'inline-flex', alignItems: 'center',
          background: 'var(--color-mint-500)', color: 'var(--color-ink)',
          border: 0, borderRadius: '9999px', padding: '10px 18px',
          fontWeight: 600, fontSize: '13.5px', fontFamily: 'inherit', cursor: 'pointer',
        }}
      >
        Send my report →
      </button>
    </form>
    <a
      href="/contact"
      style={{
        fontSize: '13px', color: 'var(--color-mint-700)',
        fontWeight: 600, textDecoration: 'none',
      }}
    >
      {callCopy}
    </a>
  </div>
)}
```

- [ ] **Step 4: Create Audit.astro wrapper**

Create `src/components/Audit.astro`:

```astro
---
import { getEntry } from "astro:content";
import AuditIsland from "./Audit.tsx";

const doc = await getEntry("landingAudit", "audit");
if (!doc) throw new Error("Could not find audit content");
const { eyebrow, headline, body, footnote, verdictIdle, verdictDone, emailCopy, callCopy, rows } = doc.data;
---

<AuditIsland
  client:load
  eyebrow={eyebrow}
  headline={headline}
  body={body}
  footnote={footnote}
  verdictIdle={verdictIdle}
  verdictDone={verdictDone}
  emailCopy={emailCopy}
  callCopy={callCopy}
  rows={rows}
/>
```

- [ ] **Step 5: Update index.astro to import Audit.astro instead of Audit.tsx**

In `src/pages/index.astro`, replace:
```typescript
import Audit from "../components/Audit";
```
With:
```typescript
import Audit from "../components/Audit.astro";
```

Also remove `client:load` from the `<Audit />` usage since the wrapper handles that:
```astro
<Audit />
```

- [ ] **Step 6: Verify build passes**

```bash
cd C:/repos/pixelboost-astro && npm run build 2>&1 | tail -20
```

Expected: build completes with no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/Audit.tsx src/components/Audit.astro src/pages/index.astro
git commit -m "feat: extract Audit copy to content collection, add email capture UI"
```

---

## Task 11: Update nav label and hero description

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Hero.astro`

- [ ] **Step 1: Rename Work → Results in Header.astro**

In `src/components/Header.astro`, find and replace both occurrences (desktop nav + mobile nav):

Desktop nav (around line 21):
```html
<a href="#work" style="color: inherit; transition: color 0.15s;" class="nav-link">Results</a>
```

Mobile nav (around line 52):
```html
<a href="#work" style="padding: 10px 0; border-bottom: 1px solid var(--color-line); color: inherit;">Results</a>
```

- [ ] **Step 2: Update Hero.astro to use description from content**

`Hero.astro` currently has the description hardcoded in the template (not fetched from hero.md). Check if it already fetches from content:

The description `<p>` in Hero.astro (around line 19) is hardcoded. Add a content fetch to the frontmatter and replace the hardcoded subhead.

Replace the empty `---` frontmatter block in `Hero.astro` with:

```typescript
---
import { getEntry } from "astro:content";
import logoBlack from "../assets/svgs/logo-black.svg";

const doc = await getEntry("landingHero", "hero");
if (!doc) throw new Error("Could not find hero content");
const { description } = doc.data;
---
```

Then replace the hardcoded subhead `<p>` (the one containing "I build fast, accessible..."):
```astro
<p style="font-size: clamp(16px, 1.35vw, 19px); color: var(--color-ink-500); line-height: 1.5; max-width: 56ch; margin: 0 0 28px 0; font-weight: 500;">
  {description}
</p>
```

- [ ] **Step 3: Verify build passes**

```bash
cd C:/repos/pixelboost-astro && npm run build 2>&1 | tail -20
```

Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.astro src/components/Hero.astro
git commit -m "feat: rename Work to Results in nav; pull hero description from content"
```

---

## Self-Review Checklist

After all tasks complete, verify against spec:

- [ ] Hero subhead updated via hero.md ✓ (Task 11)
- [ ] Problem cards — new copy + content-driven ✓ (Tasks 2, 4)
- [ ] Audit — new headline/body/footnote/verdict + email capture + content-driven ✓ (Tasks 2, 10)
- [ ] Features — new subhead, pillar 1 + 3 pitches + content-driven ✓ (Tasks 2, 5)
- [ ] Portfolio — new eyebrow/headline/subhead + content-driven ✓ (Tasks 3, 7)
- [ ] Pricing — descriptor per plan + content-driven ✓ (Tasks 3, 8)
- [ ] FAQ — new Q "What does my site score mean?", renamed Q "What tools..." + content-driven ✓ (Tasks 2, 6)
- [ ] ClosingCTA — new headline + body + content-driven ✓ (Tasks 3, 9)
- [ ] Nav Work → Results ✓ (Task 11)
- [ ] All 4 new collections registered in content.config.ts ✓ (Task 1)
- [ ] Audit email capture UI added ✓ (Task 10)
