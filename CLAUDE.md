# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build to `./dist/`
- `npm run preview` — Preview production build locally (static only — no Worker routes)
- `npm run preview:worker` — Build, then run the Cloudflare Worker locally via `wrangler dev` (needed to exercise `/contact`, `/api/audit`, and CSP headers)
- `npm run deploy` — Build and deploy to Cloudflare Workers via `wrangler deploy`
- `node --test` — Run all tests (`node:test` files in `tests/`; there is no npm test script)
- `node --test tests/<file>.test.mjs` — Run a single test file
- `npx astro check` — Type-check `.astro` files
- No linter is configured

## Architecture

This is a marketing site for pixelboost.ca: a **static Astro build served by a Cloudflare Worker**. `astro build` emits `./dist`, and the Worker (`src/worker/index.js`, configured in `wrangler.toml`) serves those assets via the ASSETS binding, handles the two dynamic endpoints, and sets the **Content-Security-Policy header at the edge** (`CSP_HEADER` in `src/worker/index.js` — not in Astro config, so CSP never applies under `npm run dev`/`preview`; use `preview:worker` to verify it).

### Worker backend (`src/worker/`)

- `POST /contact` — Turnstile verification, then sends the lead email via Fastmail JMAP (`contact-utils.js`, `fastmail.js`). The form lives in `src/pages/contact.astro`.
- `POST /api/audit` — the free site-scan feature: calls Google PageSpeed Insights, scores perf/mobile/SEO/a11y, detects tracking tools, and emails a report asynchronously (`audit-utils.js`).
- Required Worker secrets (documented in `wrangler.toml`): `PSI_API_KEY`, `JMAP_FASTMAIL_API`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET`.
- The audit UI is a React island: `src/components/Audit.astro` wraps `src/components/Audit.tsx`. Verdict/scoring logic shared between the island and the Worker lives in `src/shared/verdict.js`.

### Content → Component → Page flow

Two collections are defined in `src/content.config.ts`:

- **`blog`** (`src/content/blog/`) — loads `.md` **and `.mdx`**, excluding `_`-prefixed files (so `_template.md` never builds). Frontmatter: `title`, `description`, `pubDate`, optional `updatedDate`/`heroImage`, `draft` (default false), and optional `faq` (array of `{ q, a }`) which renders a visible `BlogFAQ` section **and** emits FAQPage JSON-LD from the same data.
- **`portfolio`** (`src/content/portfolio/`) — display-only (no detail pages). Frontmatter: `title`, `order`, `tags`, `image`, plus optional `imageMobile`, `url`, `outcome`, `location`, `summary`, `stats` (array of `{label, before, after}`), `kpi`.

There are **no landing-section collections** — landing components (`Hero`, `Problem`, `Features`, `Pricing`, `FAQ`, …) inline their own copy in the component file. Among components, only `Portfolio.astro` calls `getCollection()` (sorted by `order`); the landing page (`src/pages/index.astro`) just composes components. The only dynamic route is `src/pages/blog/[slug].astro` (via `getStaticPaths()`, filtering drafts).

`.pages.yml` configures Pages CMS (pagescms.org) so the blog collection can be edited through a CMS.

### Layout, SEO, and site constants

- `src/layouts/BaseLayout.astro` is the single layout. It emits canonical URLs, OG/Twitter meta (default image `/og-image.png`), favicons/manifest, self-hosted Plausible analytics (`data.pixelboost.dev`), and WebSite + LocalBusiness JSON-LD. `blog/[slug].astro` adds BlogPosting (and FAQPage when `faq` is present).
- `src/consts.ts` holds `HOME_TITLE`/`SITE_NAME`/`SITE_TITLE`/`SITE_DESCRIPTION`. BaseLayout compares the page title against `SITE_TITLE` to detect the home page: home gets the geo-first title verbatim, every other page gets `"{title} | Pixelboost"`.
- Sitemap comes from `@astrojs/sitemap` (`/sitemap-index.xml`); `public/robots.txt` is checked in.

### Key non-obvious patterns

- **Blog read-time**: `blog/index.astro` computes read-time from `post.body` word count (~200 wpm) and passes it to `BlogCard` / the featured card — no `readTime` frontmatter field exists
- **Reuse components and primitives** — before building UI, check `src/components/` and the primitives in `src/components/ui/` (`BlogCard`, `Button`, `Card`, `ComparisonTable`, `Eyebrow`, `SectionHeader`) for an existing pattern. When the same element appears in two places (e.g. the FAQ accordion in `FAQ.astro` and `BlogFAQ.astro`), they must look and behave identically; if a context needs a variant, make a prop-driven sibling that reuses the same markup/styles (`BlogFAQ.astro` is the model) rather than hand-rolling new markup.
- **No emojis in UI** — always use inline SVG icons instead
- **Tests** (`tests/*.test.mjs`) are plain `node:test` and mostly cover the Worker utilities, the verdict logic, and static invariants of checked-in files (font loading, header nav, image dimensions). Run them after touching `src/worker/` or `src/shared/`.
- **Traps**: `@astrojs/rss` is installed but there is no RSS endpoint; `src/fonts/` contains unused legacy font files (the live font ships via fontsource — see Design System).

### Astro features in use

- Check `package.json` for the current Astro version. The Rust compiler (`rustCompiler: true`) and queued rendering are enabled under `experimental` in `astro.config.mjs`
- Integrations: `mdx()`, `sitemap()`, `react()` (React 19, but most components are `.astro`; `Audit.tsx` is the main island)
- Tailwind CSS v4 via the Vite plugin

## Brand: audience, voice, content

**Target audience.** Owners of small businesses in Toronto and the Durham Region (Ontario, Canada) — non-technical people who already have a website (often Wix or WordPress) that is slow, dated, or not bringing in leads. They care about customers and revenue, not web tech. Pixelboost is a one-person studio, so the brand voice is personal, not corporate "we-the-agency."

**Voice.** Plain-spoken, direct, and concrete. Address the reader as "you." Lead with the business cost ("3 leads a month you're losing to a loading spinner"), not the technology. Use local specifics (Ontario, Toronto, AODA) where they add credibility. No hype, no jargon walls — when a technical term is unavoidable, explain it in one plain sentence. Honest about trade-offs (Wix/WordPress "aren't inherently bad tools"). Calm and reassuring, never alarmist.

**Content rules.**
- **No emojis anywhere in the UI** — always use inline SVG icons instead.
- Blog posts live in `src/content/blog/*.md` (or `.mdx`); copy `_template.md` for new posts. `draft: true` hides a post from the index and from `getStaticPaths`. Add a `faq` array when a post should have an FAQ section — it feeds both the visible accordion and the FAQPage structured data.
- Headlines are sentence case, not Title Case. Keep them benefit-led and specific to a small-business worry.

## Design System

**Soft paper / mint aesthetic (v2).** Warm off-white "paper" surfaces float as rounded "section cards" (28px radius) on a mint-tinted shell, with a green "mint" brand accent, charcoal "ink" text, soft diffuse shadows, and bold tight-tracked headings. This is calm and editorial — **not** the older neo-brutalist look. (Brutalist utilities — `shadow-brutal`, `border-3`, `rounded-brutal` — still exist in `global.css` but are legacy; don't reach for them in new work.)

### Styling stack

- **Tailwind CSS v4** via Vite plugin (`@tailwindcss/vite`)
- Custom design tokens in `src/styles/global.css` under `@theme`, defined as **hex** values (not OKLCH)
- Core color tokens: `--color-paper` / `--color-paper-2` (surfaces), `--color-ink` + `--color-ink-700/500/400` (text), `--color-mint-50/100/200/300/500/600/700` (brand green — note there is **no `mint-400`**; `mint-500` is the primary accent), `--color-line` / `--color-line-2` (borders). Support: `--color-peach`, `--color-red`, `--color-yellow`.
- Font: a single family, **Plus Jakarta Sans** (`--font-sans`), used for both headings and body. It loads via `@font-face` in `global.css` pointing at `@fontsource-variable/plus-jakarta-sans` — not Astro's font API.
- Shared `@utility` classes to prefer over ad-hoc CSS: `section-card` (the page-section pill), `eyebrow-chip` + `eyebrow-dot` (section eyebrows), `section-subhead`, `card-body`, buttons `btn-mint` / `btn-outline` / `btn-outline-light` / `btn-ink` (+ size/layout modifiers `btn-sm`, `btn-block`, the press animation `btn-interactive`, and the `.btn-on-dark` class for buttons on dark surfaces), and surface fills `surface-paper` / `surface-paper-2` / `surface-ink` / `surface-mint`.
- **Scroll reveal**: add `data-reveal` to an element (and `--reveal-i` for stagger) — `BaseLayout.astro` wires an `IntersectionObserver` that adds `.is-in`. A `.no-js` body class guarantees content shows without JS, and `prefers-reduced-motion` is honored.

### Fluid typography

The type scale in `global.css` uses CSS `pow()` and `clamp()` for viewport-responsive sizing (320px–1500px). Utility classes `fs-xs` through `fs-xxxl` are defined as `@utility` rules. Headings (h1–h6) auto-scale via a `--fl` CSS variable. This is a custom system — don't replace it with Tailwind typography defaults.
