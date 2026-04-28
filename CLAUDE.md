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

Content lives in Markdown collections defined in `src/content.config.ts`. Each major landing page section has its own **singleton collection** (one MD file) in `src/content/landing/`: `landingHero`, `landingWhatWeOffer`, `landingPortfolio`, `landingComparison`, `landingPricing`, `landingCTA`. Multi-item collections (`services`, `portfolio`) live in their own `src/content/` subdirectories.

**Components fetch their own data.** Each section component (Hero, Features, Portfolio, etc.) calls `getEntry()` or `getCollection()` internally, then filters/sorts/transforms at render time. The landing page (`src/pages/index.astro`) simply composes these components with no data passing.

### Key non-obvious patterns

- **Service icons**: `Features.astro` has a hardcoded `iconMap` mapping service slugs to inline SVG strings — add entries here when creating new services
- **Dynamic routes**: Only services have detail pages via `src/pages/services/[slug].astro` using `getStaticPaths()`. Portfolio items and blog posts are display-only on the landing page (no detail pages)
- **Blog collection path**: Config references `src/data/blog/` but actual files are in `src/content/blog/` — this mismatch means blog content won't load

### Astro 6 features in use

- Rust compiler (`rustCompiler: true`) and queued rendering (experimental)
- Native font API via `fontProviders.local()` in `astro.config.mjs` — fonts are Lato (headings) and Noto Sans (body)
- Content Security Policy enabled (`security: { csp: true }`)
- React 19 integration available but most components are `.astro`

## Design System

**Neo-brutalist aesthetic** — thick 3px borders, offset drop shadows (`shadow-brutal`), 12px radius, bold typography, high contrast.

### Styling stack

- **Tailwind CSS v4** via Vite plugin (`@tailwindcss/vite`)
- Custom design tokens in `src/styles/global.css` under `@theme`
- Colors use **OKLCH color space**: `--color-primary` (green), `--color-accent` (yellow), `--color-ink` (charcoal), `--color-surface` (warm white)

### Fluid typography

The type scale in `global.css` uses CSS `pow()` and `clamp()` for viewport-responsive sizing (320px–1500px). Utility classes `fs-xs` through `fs-xxxl` are defined as `@utility` rules. Headings (h1–h6) auto-scale via a `--fl` CSS variable. This is a custom system — don't replace it with Tailwind typography defaults.
