# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build to `./dist/`
- `npm run preview` — Preview production build locally
- No test runner or linter is configured

## Architecture

This is a **static marketing site** for pixelboost.ca built on **Astro 6.0** with content-driven design.

### Content → Component → Page flow

Three Markdown collections are defined in `src/content.config.ts`: `blog` (`src/content/blog/`), `services` (`src/content/services/`), and `portfolio` (`src/content/portfolio/`). There are **no landing-section collections** — landing components inline their own copy in the component file rather than reading from MD.

**Data-driven components fetch their own data.** Components backed by a collection (e.g. `Portfolio.astro`, `Features.astro`) call `getCollection()` internally, then filter/sort/transform at render time. The landing page (`src/pages/index.astro`) just composes components; the `blog/index.astro` page composes `BlogCard` over the `blog` collection.

### Key non-obvious patterns

- **Service icons**: `Features.astro` has a hardcoded `iconMap` mapping service slugs to inline SVG strings — add entries here when creating new services
- **Dynamic routes**: Services have detail pages via `src/pages/services/[slug].astro`, and blog posts via `src/pages/blog/[slug].astro`, both using `getStaticPaths()`. Portfolio items are display-only (no detail pages)
- **Blog read-time**: `blog/index.astro` computes read-time from `post.body` word count (~200 wpm) and passes it to `BlogCard` / the featured card — no `readTime` frontmatter field exists
- **No emojis in UI** — always use inline SVG icons instead

### Astro 6 features in use

- Rust compiler (`rustCompiler: true`) and queued rendering (experimental)
- Native font API via `fontProviders.local()` in `astro.config.mjs`
- Content Security Policy enabled (`security: { csp: true }`) — CSP only applies to the production build (`npm run build` + `preview`), not `dev`. Verify CSP-sensitive changes against a build.
- React 19 integration available but most components are `.astro`

## Brand: audience, voice, content

**Target audience.** Owners of small businesses in Toronto and the Durham Region (Ontario, Canada) — non-technical people who already have a website (often Wix or WordPress) that is slow, dated, or not bringing in leads. They care about customers and revenue, not web tech. Pixelboost is a one-person studio, so the brand voice is personal, not corporate "we-the-agency."

**Voice.** Plain-spoken, direct, and concrete. Address the reader as "you." Lead with the business cost ("3 leads a month you're losing to a loading spinner"), not the technology. Use local specifics (Ontario, Toronto, AODA) where they add credibility. No hype, no jargon walls — when a technical term is unavoidable, explain it in one plain sentence. Honest about trade-offs (Wix/WordPress "aren't inherently bad tools"). Calm and reassuring, never alarmist.

**Content rules.**
- **No emojis anywhere in the UI** — always use inline SVG icons instead.
- Blog posts live in `src/content/blog/*.md`; copy `_template.md` for new posts. Frontmatter: `title`, `description`, `pubDate`, optional `updatedDate`/`heroImage`, `draft` (defaults false). `draft: true` hides a post from the index and from `getStaticPaths`.
- Headlines are sentence case, not Title Case. Keep them benefit-led and specific to a small-business worry.

## Design System

**Soft paper / mint aesthetic (v2).** Warm off-white "paper" surfaces float as rounded "section cards" (28px radius) on a mint-tinted shell, with a green "mint" brand accent, charcoal "ink" text, soft diffuse shadows, and bold tight-tracked headings. This is calm and editorial — **not** the older neo-brutalist look. (Brutalist utilities — `shadow-brutal`, `border-3`, `rounded-brutal` — still exist in `global.css` but are legacy; don't reach for them in new work.)

### Styling stack

- **Tailwind CSS v4** via Vite plugin (`@tailwindcss/vite`)
- Custom design tokens in `src/styles/global.css` under `@theme`, defined as **hex** values (not OKLCH)
- Core color tokens: `--color-paper` / `--color-paper-2` (surfaces), `--color-ink` + `--color-ink-700/500/400` (text), `--color-mint-50…700` (brand green, `mint-500` is the primary accent), `--color-line` / `--color-line-2` (borders). Support: `--color-peach`, `--color-red`, `--color-yellow`.
- Font: a single family, **Plus Jakarta Sans** (`--font-sans`), used for both headings and body.
- Shared `@utility` classes to prefer over ad-hoc CSS: `section-card` (the page-section pill), `eyebrow-chip` + `eyebrow-dot` (section eyebrows), `section-subhead`, `card-body`, `btn-mint` / `btn-outline` (+ `btn-interactive` for the press animation).
- **Scroll reveal**: add `data-reveal` to an element (and `--reveal-i` for stagger) — `BaseLayout.astro` wires an `IntersectionObserver` that adds `.is-in`. A `.no-js` body class guarantees content shows without JS.

### Fluid typography

The type scale in `global.css` uses CSS `pow()` and `clamp()` for viewport-responsive sizing (320px–1500px). Utility classes `fs-xs` through `fs-xxxl` are defined as `@utility` rules. Headings (h1–h6) auto-scale via a `--fl` CSS variable. This is a custom system — don't replace it with Tailwind typography defaults.
