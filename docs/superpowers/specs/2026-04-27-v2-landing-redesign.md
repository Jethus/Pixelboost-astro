# Pixelboost Landing Page v2 Redesign

**Date:** 2026-04-27  
**Status:** Approved for implementation

---

## Overview

Full replacement of the current neo-brutalist landing page with the v2 "friendly-confident" design direction. The page remains a single-scroll Astro 6 site. Every section gets rebuilt; the existing component files are overwritten in-place. Existing portfolio client data is preserved; all copy comes from v2-app.jsx.

---

## Design System Changes

### Tokens (global.css @theme — full replacement)

The current neo-brutalist token set (oklch primaries, shadow-brutal, Lato/Noto Sans) is replaced entirely with the v2 palette. Tailwind v4 uses `@theme` in `global.css` — no `tailwind.config.ts`.

**New color tokens:**
```css
--color-paper:   #F8F5EE   /* primary surface */
--color-paper-2: #EFEADC   /* cream sections */
--color-ink:     #0F1A14   /* primary text + dark bg */
--color-ink-700: #2A3A32
--color-ink-500: #556057
--color-ink-400: #8A968F
--color-line:    #E4E0D4
--color-line-2:  #D5D0C0
--color-mint-50:  #EAF7EF
--color-mint-100: #D6EFDF  /* page frame bg */
--color-mint-200: #B0E0C1
--color-mint-300: #89CF9F
--color-mint-500: #3CCB8A  /* brand / CTA / bars */
--color-mint-600: #1F9C6A  /* .high spans, links */
--color-mint-700: #137048  /* icon stroke, after-values */
--color-peach:   #F4B891
--color-red:     #C94F3B
--color-yellow:  #E8B33A
```

**Typography:** Replace Lato/Noto Sans with **Plus Jakarta Sans** (Google Fonts, weights 400/500/600/700/800). Single font family for both headings and body. Keep existing fluid type scale mechanism (`--fl` / `pow()` / `clamp()`) — the v2 explicit px sizes map well to the existing scale levels and this avoids rebuilding a working system.

**Remove:** All shadow-brutal tokens, radius-brutal, oklch colors, animate-fade-in/slide-up keyframes.

**Add radii:**
```css
--radius-section: 28px   /* section cards */
--radius-card:    20px   /* problem/pillar/work/price cards */
--radius-icon:    10px
--radius-pill:    9999px
```

**Shadows:**
```css
--shadow-nav:    0 2px 0 rgba(15,26,20,0.04)
--shadow-btn:    0 6px 18px -8px rgba(15,26,20,0.35)
--shadow-card:   0 20px 60px -20px rgba(0,0,0,0.35)
```

**Body/html base:**
- `background: var(--color-mint-100)` on `html` (the 28px mint frame effect comes from this)
- `scroll-behavior: smooth`
- font: Plus Jakarta Sans

---

## Page Shell

`.page` wrapper: `padding: 28px` on all sides. This creates the visible mint frame around all section cards. Max-width 1200px sections sit centered within it. The nav and footer are also wrapped — nav gets `border-radius: 999px`, footer gets `border-radius: 28px 28px 0 0`.

**index.astro** composition (same import pattern, updated components):
```
<BaseLayout>
  <Nav />         ← replaces Header.astro
  <main>
    <Hero />
    <Problem />   ← new component
    <Audit />     ← new component (React .tsx, client:load)
    <Pillars />   ← replaces Features.astro
    <Work />      ← replaces Portfolio.astro
    <Pricing />
    <FAQ />       ← new component
    <FinalCTA />  ← replaces ClosingCTA.astro
  </main>
  <Footer />
</BaseLayout>
```

The `Comparison.astro` component is dropped — the v2 design has no comparison table.

---

## Component Specs

### Nav (replaces Header.astro)

Pill-shaped sticky nav sitting inside the 28px mint frame. Paper background, 999px radius, nav shadow.

- Brand: 12px mint-500 dot with 3px mint-100 halo, "pixelboost" 16px/700
- Links: Why it matters / Free audit / Work / Pricing / FAQ (same anchors as v2)
- Blog link from current nav stays: add between Work and Pricing
- Right CTA: dark pill "Score my site →" anchors to `#audit`
- Mobile: hamburger collapses to stacked links (preserve existing toggle script pattern)

**Logo:** Keep existing SVG logo. Black variant (`logo-black.svg`) in nav, white variant (`logo-white.svg`) in footer — same as current Header/Footer. The mint dot + text brand from v2 reference is not used.

### Hero (rewrite Hero.astro)

Two-column grid `1.2fr 1fr`, 60px gap, collapses to 1-col at 920px. Decorative blobs hidden below 920px.

Left column content:
- No eyebrow
- h1: "Websites that <span class="high">actually work</span> for your small business."
- Lede: "I build fast, accessible, trackable websites for Canadian small businesses — then stick around as your web developer for updates, fixes, and improvements. No site-builder bloat, no surprise invoices."
- CTAs: "Score my site →" (mint, lg) + "See recent work" (secondary, lg)
- Hero foot: italic "Free report card. No email required. Takes 30 seconds."
- Proof row: 3 overlapping 32px avatar circles (mint-300, peach, mint-500 colors) + "Trusted by 20+ local businesses across Ontario & the Maritimes" + (no star rating — not in reference)

Right column — browser card visual (static, no animation):
- Dark ink rounded card, rotated 1.5deg, heavy shadow
- Chrome: 3 traffic-light dots + URL "innatridgechristian.ca"
- Body: mint-100 card, score "97" mint-600/800, "Google performance" label, "Up from 54 on the old Squarespace site."
- 3 metric rows with bars: Speed 97 / Accessibility 100 / SEO 100 — all "good" (mint-500 bars)

Hero is pure Astro (no interactivity). No content collection needed — hero content is hardcoded in the component (v2 pattern).

### Problem (new component: Problem.astro)

Cream section (`paper-2` bg). Static Astro. No content collection.

- Eyebrow: `· Why it matters`
- h2: "Your current site might be quietly <span class="high">costing you leads.</span>"
- Lede: "Most small-business websites have problems the owner can't see — but their customers feel them every day. Here's where it usually shows up:"
- 4-up card grid (4→2→1 at 920px/560px), 14px gap, 40px top margin

Cards (exact copy from v2-app.jsx):
1. Clock icon / "Your site loads slowly." / "Every extra second on mobile loses about 1 in 5 visitors..."
2. EyeOff icon / "You can't see who's visiting." / "No analytics, or Google Analytics..."
3. AlertCircle icon / "Some customers can't use it." / "Older customers, mobile users..."
4. Lock icon / "It's a pain to update." / "Hours changed? New service?..."

Icons: **Lucide React** components. 22px, stroke 1.5, currentColor. Sit in 40×40 mint-100 tile with mint-200 border, mint-700 stroke, 10px radius. Mappings: Clock / EyeOff / AlertCircle / Lock.

### Audit (new component: Audit.tsx — React, client:load)

Dark section (`ink` bg). The only interactive, stateful component.

**State machine:**
```ts
type AuditState = 'idle' | 'scanning' | 'done'
const [url, setUrl] = useState('')
const [state, setState] = useState<AuditState>('idle')
const [scores, setScores] = useState({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0 })
```

**rAF animation (port exactly from v2-app.jsx lines 123–144):**
- Duration: 1400ms
- Easing: `1 - (1 - p)^3` (ease-out cubic)
- All 5 scores tick 0 → target simultaneously
- `cancelAnimationFrame` on unmount
- Targets: `{ perf: 58, a11y: 71, seo: 84, mobile: 49, tracking: 25 }`

**Layout:** Two-column `1fr 1.1fr`, 60px gap, collapses 1-col at 920px.

Left column:
- Eyebrow (dark-mode styled): `rgba(60,203,138,0.15)` bg, mint-300 text
- h2 in paper: "Get a free <span class='high'>website report card.</span>"
- Lede at 75% paper opacity
- Form: URL input + mint button, 10px gap, flex-wrap
  - Input: paper bg, ink border, 999px radius, focus = mint-500 border + 4px mint-100 glow
  - Button label: "Score my site" / "Scanning…" / "Run again"
  - `aria-label="Your website URL"` on input
- Tech footnote at 55% paper opacity, italic

Right column — report card:
- Paper bg, 24px radius, card shadow, overflow hidden
- Header: paper-2 bg, traffic-light dots (line-2 color) + URL display ("Sample report — yourbusiness.ca" idle, entered URL when done)
- 5 metric rows: 3-col grid `[label+sub] [bar 1fr] [score 60px]`
  - Bars: 8px, line bg track, color by grade, width animated via rAF inline style
  - Scores: 17px/800, color by grade, "—" idle
  - Idle: all bars 0%, all scores "—"
- Footer: mint-50 bg, verdict text
  - idle: "Enter your URL above to run a real scan."
  - scanning: "Scanning your site…"
  - done: "5 fixes could save ~1 in 2 visitors."
- `aria-live="polite"` on report card container

**Grade function:** `n >= 90 → good (mint-500/600)`, `n >= 65 → mid (yellow)`, `< 65 → bad (red)`

### Pillars (replaces Features.astro)

Standard paper section. Static Astro. No content collection (hardcoded like v2).

- Eyebrow: `· What you actually get`
- h2: "Every site is built on the same <span class='high'>four pillars.</span>"
- Lede: "No template. No subscription you'll forget about. Just a clean site built around what your customers need to do next."
- 4-up grid (4→2→1), paper-2 cards, 20px radius, 26px padding

Pillar icons: **Lucide React** — Zap / Accessibility / BarChart3 / Wrench. Each card: icon tile → h3 → pitch (ink-700) → proof-line (ink-500, dashed top border, margin-top: auto).

Pillars data exact from v2-app.jsx.

### Work (replaces Portfolio.astro)

Mint-100 background section. Static Astro. **Reads from existing `portfolio` content collection** — adapts the 4 real clients to v2's before/after card format.

- Eyebrow: `· Recent work`
- h2: "Real Canadian small businesses, <span class='high'>real before-and-after.</span>"
- Lede: "Every project gets a Google Lighthouse score before and after. The numbers are how I keep myself honest."
- 3-up work-card grid (3→2→1). Since we have 4 clients, show all 4 in a 2×2 grid at desktop, 1-col mobile.

**Content collection schema change:** Add `before` and `after` arrays + `kpi` string to the portfolio collection schema. Existing MD files get updated with v2-style metrics. Client names and outcomes carry over; before/after numbers are mapped from current `outcome` field copy to the numeric format.

Client mapping (current → v2 format):
- **Success Installations** (Commercial/Racking) — "Doubled inbound lead volume, faster mobile-first" → Lighthouse before/after + load time + lead volume metric
- **Ontario College of Teachers FAQ** (Regulatory/Education) → Lighthouse + accessibility + outcome
- **Lunar Rhythm Gardens** (Agriculture) → Lighthouse + load time + orders
- **Crescendo Stage** (Finance/Automation) → Lighthouse + workflow metric

Exact before/after numbers will be reasonable estimates consistent with the outcome copy already in the files. No fabricated specifics beyond what the outcome field already implies.

Card structure: vis block (ink bg, diagonal stripe pattern, industry tag bottom-left in mint-200) → client name + location → 1-line summary → ba-table (label / red before / arrow / mint-700 after) → kpi badge (mint-100 bg, TrendingUp icon 14px).

### Pricing (rewrite Pricing.astro)

Standard paper section. Keep reading from `landingPricing` content collection but update the schema to match v2's 2-card layout (monthly + flat-rate) instead of 3-tier. Update the MD data file to match v2 pricing copy.

- Eyebrow: `· Pricing`
- h2: "Two ways to work together. <span class='high'>No surprise invoices.</span>"
- 2-card grid. Featured card (monthly, dark ink bg) + standard card (flat-rate).
- price-foot below cards: mint-100 bg, mint-200 border, ownership copy.

### FAQ (new component: FAQ.astro)

Cream section. Static Astro. Hardcoded questions from v2-app.jsx. Max-width 760px, single column.

`<details>`/`<summary>` elements. CSS-only open/close: `+` rotates to `×` on open (0.2s ease). 7 questions from v2-app.jsx.

### FinalCTA (replaces ClosingCTA.astro)

Dark section, gradient `ink → #14261d`. Centered. Anchors to `#audit`.
- h2: "Want to know what your site actually scores?"
- Lede
- CTAs: "Get my free report card" (mint lg) + "Or just email me" (secondary, paper border/text)

### Footer (rewrite Footer.astro)

Paper bg section. 3-column grid (brand col + Pixelboost links + Get in touch). Keeps real contact info from current footer (hello@pixelboost.ca, phone number). Border-radius `28px 28px 0 0`. Foot-bottom row: copyright + "Lighthouse 100/100/100/100."

Remove logo image — v2 uses text+dot brand in footer too. Keep Blog link.

---

## Content Collection Changes

### `portfolio` schema — add fields
```ts
// new optional fields for v2 work cards
stats: z.array(z.object({
  label: z.string(),
  before: z.string(),
  after: z.string(),
})).optional(),
kpi: z.string().optional(),
location: z.string().optional(),
summary: z.string().optional(),
```

### `landingPricing` schema — stays the same structure, data updated
The existing schema supports what's needed. Update the `pricing.md` data file to 2-plan structure.

### Remove from index.astro: Comparison section
`Comparison.astro` is not imported. The component file is left on disk but unused.

---

## Fonts

Remove Lato + Noto Sans from `astro.config.mjs` font provider. Add Plus Jakarta Sans via Google Fonts `<link>` in `BaseLayout.astro` (weights 400;500;600;700;800). The Astro native font API currently used for local fonts doesn't support Google Fonts variable weights cleanly — a standard `<link rel="preconnect">` + stylesheet is simpler and correct here.

---

## What Does NOT Change

- `BaseLayout.astro` — minor: add Google Fonts link, update body bg to mint-100
- `src/content.config.ts` — add portfolio stat fields, rest unchanged
- Blog, about, contact, services pages — untouched
- `consts.ts` — unchanged
- Existing content collection MD files for landing sections (hero, cta, etc.) — most will be deprecated in favor of hardcoded component content (v2 pattern), but left on disk

---

## File Inventory

**Modified:**
- `src/styles/global.css` — full token replacement
- `src/layouts/BaseLayout.astro` — font link, body bg
- `src/pages/index.astro` — updated imports
- `src/content.config.ts` — portfolio schema additions
- `src/content/landing/pricing.md` — new 2-plan data
- `src/content/portfolio/*.md` — add stats/kpi/location/summary fields

**Replaced (overwrite):**
- `src/components/Header.astro` → Nav
- `src/components/Hero.astro`
- `src/components/Features.astro` → Pillars
- `src/components/Portfolio.astro` → Work
- `src/components/Pricing.astro`
- `src/components/Footer.astro`
- `src/components/ClosingCTA.astro` → FinalCTA

**New:**
- `src/components/Problem.astro`
- `src/components/Audit.tsx` (React client component)
- `src/components/FAQ.astro`

---

## Responsive Breakpoints

| Breakpoint | Hero | Audit | 4-up grids | Work | Pricing |
|---|---|---|---|---|---|
| ≥ 1000px | 2-col | 2-col | 4 cols | 2×2 grid | 2 cols |
| ≤ 920px | 1-col, blobs hidden | 1-col | 2 cols | 2 cols | 1 col |
| ≤ 560px | — | — | 1 col | 1 col | — |

---

## Interactions

- Smooth scroll: `html { scroll-behavior: smooth }` — already in base
- Button hover: `translateY(-1px)` + shadow-btn, 0.15s transition
- Input focus: mint-500 border + 4px mint-100 glow
- FAQ open/close: `+` rotates 45deg, 0.2s ease (CSS only, no JS)
- Report card rAF animation: only meaningful animation on the page
- No scroll-triggered animations, no framer-motion

---

## Accessibility

- `aria-live="polite"` on report card container
- `aria-label="Your website URL"` on audit input
- Focus rings: browser defaults kept; form input uses custom mint ring
- Color contrast: paper on ink = 14.8:1 (AAA); lede at 75% opacity on ink ≈ 11:1 (AAA)
- No emoji in production — Lucide `TrendingUp` icon replaces 📈 in KPI badges
