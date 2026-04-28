# Handoff: Pixelboost Landing — Report Card direction (v2)

## Overview

Pixelboost is a one-person freelance web-design studio for Canadian small businesses. This is the **landing page** — a single long-scroll page with one primary conversion goal: **get the visitor to run a free website report card on their own URL.** Booking a call and reading work samples are secondary.

The **report card** is the centerpiece of the page — it sits in section 3 (after hero + problem) and is the direction this version commits to. The visitor types their URL, the card animates real-looking scores in, and a verdict appears. The hero echoes the same visual (a smaller browser-card mock with a Lighthouse-style score) so the page feels cohesive top-to-bottom.

Tone: **friendly-confident, plain-language, technically credible.** Every section that makes a customer-facing claim ("your site loads slowly") is followed by an italicized *Technically:* line that backs it up with the real metric or tool name. That voice is not decoration — it's the entire positioning.

## About the Design Files

The files in `design-references/` are **design references created in HTML** — a working prototype showing the intended look, copy, and behavior. They are **not production code to copy directly.** The implementation task is to **recreate this design in the target codebase's environment** using its established patterns.

The reference is built with React 18 + Babel-in-the-browser + a single CSS file. None of that should ship to production. In particular:

- `tweaks-panel.jsx` is a **prototype-only authoring tool** for live-editing colors/fonts in the browser. **Do not port it.** Delete on import.
- The `?v=3` cache-buster query strings on the script/link tags are a prototype artifact. Drop them.
- `<script type="text/babel">` and the unpkg React/Babel CDN tags are prototype-only.

## Fidelity

**High-fidelity (hifi).** Final colors, typography, spacing, copy, and interactions. Recreate pixel-perfectly using the codebase's existing libraries and patterns. Every value in this README is taken from the reference CSS or component code — use them verbatim.

## Recommended Stack

The reference is framework-agnostic, but the natural fit is:

- **Next.js 15 (App Router)** with React Server Components for the static sections
- **Tailwind CSS** with the design tokens below ported to `tailwind.config.ts`
- **MDX** for the journal/case-study content (currently hardcoded in `v2-app.jsx` as a `POSTS` array stand-in — wire up MDX from the start so you don't migrate twice)
- **`@vercel/og`** for OG image generation (~30 lines of route handler)
- **Plausible** for analytics (the design references it by name; using anything else will require copy edits)

Swap any of the above for the codebase's existing choices. The design has no hard framework dependencies.

## Page Structure

The page is a single scroll with these sections in order:

1. **Nav** — pill-shaped sticky nav
2. **Hero** — headline + 2 CTAs + browser-card visual on the right
3. **Problem** — "Your current site might be quietly costing you leads" — 4-up symptom grid
4. **Audit (Report Card)** — ⭐ THE FOCAL POINT. Dark section, URL input, animated report card on the right
5. **Offer (4 Pillars)** — "Every site is built on the same four pillars" — 4-up capability grid
6. **Work** — recent work with before/after metrics tables
7. **Pricing** — 3 tiers with featured middle card
8. **FAQ** — 5–6 expandable Q&As
9. **Final CTA** — repeats the report card invitation
10. **Footer**

Component files map 1:1 to these sections. See `design-references/v2-app.jsx`.

## Design Tokens

Port these into `tailwind.config.ts` (or your token system) before building anything else.

### Colors

```ts
// neutrals (warm, paper-like)
paper:       '#F8F5EE',  // primary surface
paper2:      '#EFEADC',  // cream — used for Problem section bg
ink:         '#0F1A14',  // primary text + dark surface
ink700:      '#2A3A32',  // secondary text
ink500:      '#556057',  // muted text
ink400:      '#8A968F',  // disabled / arrow chrome
line:        '#E4E0D4',  // hairlines
line2:       '#D5D0C0',  // stronger hairlines

// brand mint (the only brand color)
mint50:      '#EAF7EF',
mint100:     '#D6EFDF',  // page bg, eyebrow chip bg, icon-tile bg
mint200:     '#B0E0C1',  // icon-tile border
mint300:     '#89CF9F',
mint500:     '#3CCB8A',  // brand dot, CTA, score bar
mint600:     '#1F9C6A',  // links, .high accent in headlines
mint700:     '#137048',  // icon stroke, "after" numbers in B/A tables

// support (used sparingly)
peach:       '#F4B891',  // 1 of 3 stack avatars in hero
red:         '#C94F3B',  // bad scores
yellow:      '#E8B33A',  // mid scores
```

The page background is `mint-100`. The page wraps everything in 28px of padding — sections sit on the mint background as rounded "paper" cards, like a magazine spread. **This is intentional.** Don't put `mint-100` only behind sections.

### Typography

```ts
fontFamily: {
  sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
}
```

Loaded from Google Fonts with weights 400/500/600/700/800. Keep `text-wrap: balance` on h1/h2.

| Role            | Size                       | Weight | Tracking | Notes |
|---|---|---|---|---|
| h1              | `clamp(44px, 6vw, 76px)`   | 800    | -0.03em  | line-height 1.05, balanced |
| h2              | `clamp(34px, 4.5vw, 54px)` | 800    | -0.025em | line-height 1.1 |
| h3              | 19px (pillars) / 18px (problem) | 700 | -0.02em  | |
| Lede            | `clamp(16px, 1.6vw, 18.5px)` | 500 | —       | color `ink-500`, max-width 60ch |
| Eyebrow         | 13px                       | 600    | 0.06em UPPERCASE | mint-100 chip with mint-500 dot |
| Body            | 14.5–15px                  | 400–500 | —      | line-height 1.5 |
| Tech footnote   | 12.5–13px italic           | 400    | —        | `*Technically:* ...` pattern |
| Button          | 14.5–15.5px                | 600    | —        | |

The **`.high` span** inside h1/h2 colors a phrase mint-600. Used once per headline — the noun that's most important ("**costing you leads**", "**four pillars**", "**website report card**"). Don't overuse.

### Spacing

- Page padding: `28px` (the colored mint frame around everything)
- Section padding-block: `clamp(56px, 7vw, 96px)`
- Section padding-inline: `clamp(28px, 5vw, 64px)`
- Section radius: `28px`
- Card radius: `20px` (problem cards, pillar cards, work cards, price cards)
- Icon tile radius: `10px`
- Pill / button radius: `999px`
- Wrap max-width: `1200px`

### Shadows

Used very sparingly. Only two shadows in the whole design:

```css
/* nav resting */
box-shadow: 0 2px 0 rgba(15, 26, 20, 0.04);
/* btn hover */
box-shadow: 0 6px 18px -8px rgba(15, 26, 20, 0.35);
/* report card (the one heavy shadow on the page) */
box-shadow: 0 20px 60px -20px rgba(0, 0, 0, 0.35);
```

### Icons

All icons are **22px stroked SVGs at stroke-width 1.5, currentColor, round caps & joins.** They sit in a 40×40px tile: `mint-100` bg, `1px mint-200` border, `mint-700` stroke, `10px` radius. **No emoji anywhere.**

The reference defines them inline via a `_ico()` helper in `v2-app.jsx`. For implementation, prefer **Lucide React** with these mappings:

| Section  | Concept                  | Lucide name          |
|---|---|---|
| Pillars  | Fast on mobile           | `Zap`                |
| Pillars  | Accessible by default    | `Accessibility`      |
| Pillars  | Tracked w/ analytics     | `BarChart3`          |
| Pillars  | Maintained after launch  | `Wrench`             |
| Problem  | Slow load                | `Clock`              |
| Problem  | No visibility            | `EyeOff`             |
| Problem  | Inaccessible             | `AlertCircle`        |
| Problem  | Hard to update           | `Lock`               |

Pillars and Problem use **disjoint icon sets** — that's intentional. Pillars = capabilities, Problem = symptoms. Don't reuse the same icon in both.

---

## Section-by-Section Spec

### 1. Nav

Pill-shaped, paper-bg, sits inside the 28px mint frame at the top.

- Layout: `flex justify-between items-center`, `padding: 10px 14px 10px 22px`, `border-radius: 999px`
- Brand: `mint-500` 12px dot with `mint-100` 3px halo, "pixelboost" 16px/700
- Links: 28px gap, 14.5px/500, hover → `mint-600`
- Right-side CTA: dark pill button "Score my site →" — anchors to `#audit`

Anchors: `#problem`, `#audit`, `#work`, `#pricing`, `#faq`.

### 2. Hero

Two-column grid `1.2fr 1fr`, 60px gap, collapses to single column at 920px.

**Left column:**
- Eyebrow: `· Booking April 2026`
- h1: "Websites for small businesses **that actually convert.**" (`.high` on the bold phrase)
- Lede: explain the offer in plain language
- CTA row: dark pill "Score my site free" + secondary outlined "See recent work"
- Foot: italic *Technically:* line establishing credibility (Lighthouse, axe, AODA-aligned)
- Proof row: 3 overlapping 32px circular avatars (mint-300, peach, mint-500) + "Trusted by 40+ small businesses" + 5-star rating

**Right column — browser-card visual:**
- Dark `ink` rounded card with chrome (3 traffic-light dots + URL bar)
- Inside: `mint-100` body card showing a sample Lighthouse-style score
- Score row: 64px/800 mint-600 number "92" + "Performance" label + "Up from 41 last month" sub
- 4 metric rows with progress bars: Speed / Accessibility / SEO / Mobile, all hitting "good" state

The hero has two decorative blobs (`mint-100` 360px circle top-right, `peach` 200px circle below it) — `position: absolute`, hidden below 920px.

### 3. Problem

Cream-background section (`paper-2`).

- Eyebrow: `· Why it matters`
- h2: "Your current site might be quietly **costing you leads.**"
- Lede: "Most small-business websites have problems the owner can't see..."
- 4-up grid (1200px+: 4 cols, 920px: 2 cols, 560px: 1 col), 14px gap, 40px top margin
- Each card: `paper-2` bg, `1px line` border, 20px radius, 22px padding, `flex flex-col gap 14px`
  - 40×40 icon tile (see Icons spec)
  - h3 18px/700: title with terminal period
  - p 14.5px/`ink-500`: 2–3 sentence explanation

**Cards (exact copy):**

| Icon     | Title                          | Body |
|---|---|---|
| Clock    | Your site loads slowly.        | Every extra second on mobile loses about 1 in 5 visitors. They leave before they ever see your menu, hours, or services. |
| EyeOff   | You can't see who's visiting.  | No analytics, or Google Analytics that nobody understands. You're running your business blind. |
| AlertCircle | Some customers can't use it. | Older customers, mobile users, anyone with a disability — small accessibility issues turn into "this site is broken" moments. |
| Lock     | It's a pain to update.         | Hours changed? New service? You either pay your old developer to come back, or wrestle with a builder you don't like opening. |

### 4. Audit (Report Card) — ⭐ FOCAL POINT

Dark section (`bg ink`, `text paper`). Two-column grid `1fr 1.1fr`, 60px gap.

**Left column:**
- Eyebrow with custom dark-mode styling: `bg rgba(60, 203, 138, 0.15)`, `color mint-300`
- h2 in `paper`: "Get a free **website report card.**"
- Lede in `rgba(248, 245, 238, 0.75)` explaining what gets checked
- Form: text input + mint pill button side-by-side, 10px gap
  - Input: `paper` bg, `ink` text, `var(--line)` border, 14px radius, 14px padding, focus ring = `mint-500` border + 4px `mint-100` glow
  - Button label changes by state: `Score my site` / `Scanning…` / `Run again`
- Tech footnote in `rgba(248, 245, 238, 0.55)` italic: "*Technically:* I use Google Lighthouse, axe accessibility checks, and a Plausible tracking audit..."

**Right column — the report card:**
- `paper` bg, 24px radius, heavy shadow (see tokens), `overflow: hidden`
- Header: `flex justify-between` 16px/22px padding, bottom border `var(--line)`
  - Left: 3 traffic-light dots (`line-2` color, 8px each, 6px gap)
  - Right: "Sample report — yourbusiness.ca · Apr 2026" — replaces with the entered URL once submitted
- Rows container: 10px/22px padding
- Each row (`.rrow`): 3-col grid `[label_block] [bar 1fr] [score 56px]`, 14px vertical padding, hairline divider between rows
  - Label block: 14px/700 metric name + 12px/`ink-500` sub
  - Bar: 8px tall, `rgba(15, 26, 20, 0.06)` track, fill colored by grade, `transition: width 0.6s ease-out`
  - Score: 17px/800 right-aligned, color matches grade
- Footer (`.report-foot`): `mint-50` bg, top border, 16px/22px padding
  - "Verdict → **5 fixes could save ~1 in 2 visitors.**"

**Grade thresholds:**
- ≥ 90 → `good` → mint-500 / mint-600
- 65–89 → `mid` → yellow `#E8B33A`
- < 65 → `bad` → red `#C94F3B`

**Rows (with target sample scores):**

| Metric             | Sub                                   | Target |
|---|---|---|
| Speed              | How fast pages load on mobile          | 58 (mid→bad — yellow) |
| Accessibility      | Can everyone actually use it?          | 71 (mid) |
| SEO basics         | Can Google find and read it?           | 84 (mid) |
| Mobile experience  | Tap targets, layout, readability       | 49 (bad) |
| Visitor tracking   | Privacy-friendly analytics setup       | 25 (bad) |

**Behavior:**

State machine: `idle` → (submit) → `scanning` → `done`.

1. **Idle:** rows show "—" instead of numbers, all bars at 0% width, verdict reads "Enter your URL above to run a real scan."
2. **Submit:** validate URL non-empty (`url.trim()`), set state to `scanning`.
3. **Scanning:** `requestAnimationFrame` loop, **1400ms duration, ease-out cubic** (`1 - (1-p)^3`). All 5 scores tick from 0 to their targets simultaneously. Bars animate width in lockstep. Verdict reads "Scanning your site…"
4. **Done:** scores settle on targets, verdict reveals "5 fixes could save ~1 in 2 visitors." Button becomes "Run again".

The animated counter is **the moment of delight** in the whole page — get the easing and duration right. Don't use a CSS keyframe; use rAF so the numbers and bars move in lockstep.

> **For production:** these are sample numbers in the prototype. The intent is that this hits a real backend (Lighthouse + axe + a small heuristic check) and animates real results in. Wire the form to whatever backend the team picks; keep the rAF animation on the way in.

The `aria-live="polite"` on the report container is required for screen-reader updates during state changes. Keep it.

### 5. Offer (4 Pillars)

Standard `paper` section. Same 4-up grid mechanics as Problem but `gap: 14px`, slightly taller cards (`gap: 14px` between children, includes a "proof line" beneath the pitch).

- Eyebrow: `· What you actually get`
- h2: "Every site is built on the same **four pillars.**"
- Lede: "No template. No subscription you'll forget about..."

**Card structure:**
- 40×40 icon tile
- h3 19px: title with period
- `.pitch` 14.5px/`ink-700`: customer-language pitch
- `.proof-line` 12.5px/`ink-500`, `padding-top 12px`, `margin-top auto`: italic *Technically:* line backing the claim. Italic phrase rendered with `<em>` styled as `ink/600/italic`.

**Pillars (exact copy):**

| Icon | Title | Pitch | Proof line |
|---|---|---|---|
| Zap | Fast on mobile. | Your site should load quickly on phones, even on slow connections. | *Technically:* I target 95+ Google Lighthouse performance scores on real devices. |
| Accessibility | Accessible by default. | Your site should work for every customer — older folks, mobile users, anyone with a disability. | *Technically:* WCAG 2.1 AA, AODA-aligned, tested with axe and real assistive tech. |
| BarChart3 | Tracked with simple analytics. | You should know which pages bring in leads — without cookie banners or creepy tracking. | *Technically:* Privacy-friendly Plausible analytics. GDPR/PIPEDA-compliant. No banner needed. |
| Wrench | Maintained after launch. | After launch, I'm still your developer. Hours changed, new service, copy fix? Send it. | *Technically:* Included in every project: 3 months of post-launch tweaks, no hourly billing. |

### 6. Work

`paper` section. 3 case studies as cards in a 3-up grid (collapses 920 → 2, 600 → 1).

Each card:
- Top: `vis` block — abstract dark `ink` rectangle with 4:3 aspect, 16px radius. Bottom-left corner shows industry tag (e.g. "RESTAURANT") in `mint-200` 11px caps, `letter-spacing: 0.08em`.
- Card body padding 22px
- Client name 17px/700 + location 13px/`ink-500`
- 1-line summary 14.5px/`ink-700`
- **B/A table** (`.ba-table`) — the proof artifact:
  - 2-row grid: each row is `[label] [before strikethrough] [→] [after mint-700 bold]`
  - `font-variant-numeric: tabular-nums` on numbers
  - Examples: "Mobile Lighthouse: ~~41~~ → **94**", "Reservations/wk: ~~12~~ → **31**"
- KPI badge below table: `mint-100` bg, `mint-200` 1px border, 10px radius, 12px padding
  - "📈 reservations up 158% in 60 days" — but **without the emoji** in production. Use a `TrendingUp` Lucide icon at 14px instead.

**Cases (use these or replace with real ones — but keep the structure & numeric framing):**

| Tag | Client | Location | Summary | Before/After 1 | Before/After 2 | KPI |
|---|---|---|---|---|---|---|
| RESTAURANT | Pickle's Diner | Hamilton, ON | Reservation flow rebuilt around the menu | Mobile Lighthouse 41 → 94 | Reservations/wk 12 → 31 | reservations up 158% in 60 days |
| TRADES | Reliable HVAC | Mississauga, ON | Service-area + emergency-call landing pages | Page load 4.8s → 1.2s | Form submits/mo 8 → 27 | qualified calls up 3.4× |
| RETAIL | Maple & Thread | Toronto, ON | Store locator + product visibility on mobile | Mobile a11y 62 → 100 | Bounce rate 71% → 38% | weekend foot traffic up 42% |

### 7. Pricing

3-card row, middle card featured (dark, scaled up slightly).

- Eyebrow: `· Honest pricing`
- h2: "One price. **No subscriptions.**"
- Lede: clarifies project-based pricing

**Cards (`.price-card`):** 24px padding, 22px radius, 1px `line` border, `flex-col gap 14px`. Featured card (`.featured`): `bg ink`, `color paper`, `transform: translateY(-8px)`, "MOST POPULAR" mint-500 chip top-right.

| Tier | Price | Best for | Includes |
|---|---|---|---|
| Starter | $2,400 | 3–5 page brochure sites | 5 pages, mobile design, Plausible setup, 1 round of revisions, 30-day post-launch support |
| **Standard** ⭐ | $4,800 | most small businesses | 8–12 pages, content help, integrations (booking/forms/maps), 2 rounds of revisions, **3 months** post-launch support |
| Custom | from $7,200 | multi-location or e-commerce | unlimited pages, custom integrations, e-commerce, content writing, 6 months post-launch support |

CTAs: Starter & Custom = secondary outline pill, Standard = mint pill. All anchor to `#audit` ("Start with a free report card").

Below the cards: `.price-foot` — mint-100 bg, mint-200 border, 16px radius, 20px/24px padding. Italic *Technically:* line about ownership: "*Technically:* You own everything — domain, hosting, content, code. I hand over keys on day one."

### 8. FAQ

Standard `paper` section, max-width 760px, single column.

`<details>` elements with custom styled `<summary>`. Open state rotates a chevron 90° (CSS-only transition). 5–6 questions:

- "How long does a project take?" — about 3–4 weeks for typical sites, 5–6 for larger
- "Do I need to write the content?" — no, content help included
- "What happens after launch?" — 3 months post-launch support, then hourly or retainer
- "Will it work with my existing booking/POS system?" — yes, common ones are easy
- "Do you do SEO?" — technical SEO baked in, content SEO is separate
- "What if I don't like the design?" — 2 rounds of revisions; never had a project not converge

### 9. Final CTA

Dark section. Repeats the report card invitation but as a single centered headline + button. Same anchor (`#audit`) — clicking scrolls back up to the form.

### 10. Footer

`paper` bg, 4-column grid: brand col + Why it matters / Free audit / Recent work / Pricing / FAQ as link columns. Bottom row: "© 2026 Pixelboost · Hamilton, ON · hello@pixelboost.ca" + nav back to top.

---

## Interactions

**Smooth-scroll anchors** — `html { scroll-behavior: smooth; }` handles it. Every nav link, every CTA, every mention of "report card" anchors to `#audit`.

**Buttons** — `transition: transform 0.15s, box-shadow 0.15s` on hover; `translateY(-1px)` + soft shadow.

**Form input focus** — mint-500 border + 4px mint-100 outer glow.

**Report card animation** — see Audit spec above. The only meaningful animation on the page; everything else is static.

**FAQ details/summary** — chevron rotation 0.2s ease.

No scroll-triggered animations, no parallax, no fade-ins on scroll. The page is editorial, not theatrical. Resist the urge to add `framer-motion` choreography — it will undercut the friendly-confident voice.

## State Management

The whole page is static **except** the Audit component:

```ts
const [url, setUrl] = useState('')
const [state, setState] = useState<'idle' | 'scanning' | 'done'>('idle')
const [scores, setScores] = useState({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0 })
```

Use rAF (not setInterval, not CSS animation) for the score-counter. Cancel the animation frame on unmount. See `v2-app.jsx` lines 118–150 for the full implementation — port the math 1:1.

For production: the form should POST to a `/api/audit` route that runs Lighthouse + axe against the URL server-side and returns real scores. Animate from 0 → real-score on response.

## Responsive Behavior

Three breakpoints:

| Breakpoint | Hero | Audit | 4-up grids | Pricing |
|---|---|---|---|---|
| ≥ 1000px | 2-col | 2-col | 4 cols | 3 cols |
| 920px | 1-col, blobs hidden | 1-col | 2 cols | 1 col, featured loses translateY |
| 600px | — | — | 1 col | — |

Section padding scales with `clamp()` so nothing else needs explicit breakpoints.

## SEO / Meta

Wire up `generateMetadata` (Next App Router) per route:

- Title: `Pixelboost — Websites for Canadian small businesses`
- Description: same lede as hero
- OG image: generate via `@vercel/og` showing the brand mint dot + "Get a free website report card" + the Plus Jakarta Sans treatment. ~30-line route.
- Schema: `LocalBusiness` JSON-LD (Hamilton, ON address, hello@pixelboost.ca)

The reference HTML has a basic `<title>` and meta — mirror those and extend.

## Accessibility

- `aria-live="polite"` on the report card container — already in the reference. **Required.**
- Form input has `aria-label="Your website URL"`.
- Color contrast on the dark section is checked: `paper` on `ink` = 14.8:1, lede `rgba(248,245,238,0.75)` on `ink` = ~11:1 — both AAA.
- The page should pass axe at WCAG 2.1 AA — that's the brand promise. Don't ship anything that fails.
- Focus rings: don't suppress them globally. The form input has a custom mint focus ring; everything else should keep browser defaults or use a custom ring at `mint-500` 2px offset.

## Files in This Bundle

- `design-references/Pixelboost Landing v2.html` — entry HTML, sets up React/Babel and mounts `<App/>`
- `design-references/v2-app.jsx` — all components: `Nav`, `Hero`, `Problem`, `Audit`, `Offer`, `Work`, `Pricing`, `FAQ`, `FinalCTA`, `Foot`, `App`. Component boundaries map 1:1 to production component files — split them out the same way.
- `design-references/v2-styles.css` — the source of truth for all tokens, layout, and styling. Read this before writing any Tailwind config.
- `design-references/tweaks-panel.jsx` — **prototype-only authoring tool. Do not port. Delete on import.**

## Recommended Build Order

1. **Tokens first.** Port colors, type scale, spacing, radii into `tailwind.config.ts`. Verify a stub page renders the right `bg-mint-100` page background and `font-sans` headline.
2. **Page chrome.** 28px-frame layout shell + Nav + Footer. Anchors only, no content.
3. **Hero.** Two-column grid + browser-card visual. The visual is static — don't animate it.
4. **Audit (report card).** Build this third — it's the focal point and the only stateful piece. Get the rAF animation right before moving on.
5. **Problem + Pillars.** Same grid mechanics, near-identical card patterns. Build the icon-tile component once, reuse.
6. **Work.** Build the B/A table component carefully — `tabular-nums` and the strikethrough-arrow-bold pattern is the visual signature.
7. **Pricing + FAQ + Final CTA.** Mostly markup.
8. **OG image route + meta.** Last 30 minutes of the build.

Build top-down, ship one section at a time, review against the reference HTML before moving on.
