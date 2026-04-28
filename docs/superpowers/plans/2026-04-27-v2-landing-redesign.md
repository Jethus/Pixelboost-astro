# Pixelboost Landing Page v2 Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current neo-brutalist Pixelboost landing page with the v2 "friendly-confident" design — mint frame page shell, 10 sections, animated report card Audit component.

**Architecture:** Full in-place rewrite of all landing page components. Astro 6 for all static sections; one React TSX component (`Audit.tsx`) for the stateful report card. Tailwind v4 tokens live in `global.css @theme`. Content collections retain structure; portfolio schema gets new optional stat fields.

**Tech Stack:** Astro 6, React 19, Tailwind CSS v4, Lucide React, Plus Jakarta Sans (Google Fonts), TypeScript

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/styles/global.css` | Rewrite | All design tokens, base element styles, fluid type scale |
| `src/layouts/BaseLayout.astro` | Modify | Add Google Fonts link, update body bg class |
| `astro.config.mjs` | Modify | Remove Lato/Noto Sans local font config |
| `src/pages/index.astro` | Rewrite | Updated imports, 28px page wrapper |
| `src/content.config.ts` | Modify | Add stats/kpi/location/summary to portfolio schema |
| `src/content/portfolio/*.md` | Modify (×4) | Add stats, kpi, location, summary fields |
| `src/content/landing/pricing.md` | Rewrite | New 2-plan v2 pricing data |
| `src/components/Header.astro` | Rewrite | Pill nav with logo + anchor links |
| `src/components/Hero.astro` | Rewrite | 2-col hero with browser card visual |
| `src/components/Problem.astro` | Create | 4-up cream problem cards |
| `src/components/Audit.tsx` | Create | React report card with rAF animation |
| `src/components/Features.astro` | Rewrite | 4-up pillars (rename responsibility, keep filename) |
| `src/components/Portfolio.astro` | Rewrite | Work before/after grid from portfolio collection |
| `src/components/Pricing.astro` | Rewrite | 2-card pricing section |
| `src/components/FAQ.astro` | Create | CSS-only details/summary accordion |
| `src/components/ClosingCTA.astro` | Rewrite | Dark gradient final CTA |
| `src/components/Footer.astro` | Rewrite | 3-col paper footer |

---

## Task 1: Design Tokens — Replace global.css

**Files:**
- Rewrite: `src/styles/global.css`

- [ ] **Step 1: Replace the full contents of global.css**

The existing fluid type scale mechanism (`--fl`, `pow()`, `clamp()`) is kept. Everything else is replaced.

```css
/* ============================================================
   global.css — Pixelboost v2
   Tailwind CSS v4 · Plus Jakarta Sans · Mint palette
   ============================================================ */

@import "tailwindcss";

/* ————————————————————————————————————————————————————————————
   @theme — Design tokens
   ———————————————————————————————————————————————————————————— */

@theme {
  /* Font */
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;

  /* Neutrals */
  --color-paper:   #F8F5EE;
  --color-paper-2: #EFEADC;
  --color-ink:     #0F1A14;
  --color-ink-700: #2A3A32;
  --color-ink-500: #556057;
  --color-ink-400: #8A968F;
  --color-line:    #E4E0D4;
  --color-line-2:  #D5D0C0;

  /* Mint brand */
  --color-mint-50:  #EAF7EF;
  --color-mint-100: #D6EFDF;
  --color-mint-200: #B0E0C1;
  --color-mint-300: #89CF9F;
  --color-mint-500: #3CCB8A;
  --color-mint-600: #1F9C6A;
  --color-mint-700: #137048;

  /* Support */
  --color-peach:  #F4B891;
  --color-red:    #C94F3B;
  --color-yellow: #E8B33A;

  /* Radii */
  --radius-section: 28px;
  --radius-card:    20px;
  --radius-icon:    10px;
  --radius-pill:    9999px;

  /* Shadows */
  --shadow-nav:  0 2px 0 rgba(15,26,20,0.04);
  --shadow-btn:  0 6px 18px -8px rgba(15,26,20,0.35);
  --shadow-card: 0 20px 60px -20px rgba(0,0,0,0.35);
}

/* ————————————————————————————————————————————————————————————
   Fluid Type Scale — unchanged mechanism, updated base sizes
   Min: 14px @ 320vw  →  Max: 20px @ 1500vw
   ———————————————————————————————————————————————————————————— */

@layer base {
  *, ::before, ::after {
    --fl: 0;
    --font-size-min: 14;
    --font-size-max: 20;
    --font-ratio-min: 1.25;
    --font-ratio-max: 1.3333333333333333;
    --font-width-min: 320;
    --font-width-max: 1500;
    --fluid-min: calc(var(--font-size-min) * pow(var(--font-ratio-min), var(--fl, 0)));
    --fluid-max: calc(var(--font-size-max) * pow(var(--font-ratio-max), var(--fl, 0)));
    --fluid-preferred: calc((var(--fluid-max) - var(--fluid-min)) / (var(--font-width-max) - var(--font-width-min)));
    --fluid-type: clamp(
      (var(--fluid-min) / 16) * 1rem,
      ((var(--fluid-min) / 16) * 1rem) - (((var(--fluid-preferred) * var(--font-width-min)) / 16) * 1rem) + (var(--fluid-preferred) * var(--variable-unit, 100vi)),
      (var(--fluid-max) / 16) * 1rem
    );
  }

  body, h1, h2, h3, h4, h5, h6, p, li, textarea, input, select, button, th, td {
    font-size: var(--fluid-type);
  }

  .fluid-text-container {
    container-type: inline-size;
    --variable-unit: 100cqi;
  }

  h1, .h1 { --fl: 5; }
  h2, .h2 { --fl: 4; }
  h3, .h3 { --fl: 3; }
  h4, .h4 { --fl: 2; }
  h5, .h5 { --fl: 1; }
  h6, .h6 { --fl: 0; }
  p, li, body { --fl: 0; }
}

/* ————————————————————————————————————————————————————————————
   Fluid size utilities
   ———————————————————————————————————————————————————————————— */

@utility fs-xs   { --fl: -1; font-size: var(--fluid-type); }
@utility fs-base { --fl: 0;  font-size: var(--fluid-type); }
@utility fs-s    { --fl: 1;  font-size: var(--fluid-type); }
@utility fs-m    { --fl: 2;  font-size: var(--fluid-type); }
@utility fs-l    { --fl: 3;  font-size: var(--fluid-type); }
@utility fs-xl   { --fl: 4;  font-size: var(--fluid-type); }
@utility fs-xxl  { --fl: 5;  font-size: var(--fluid-type); }
@utility fs-xxxl { --fl: 6;  font-size: var(--fluid-type); }

/* ————————————————————————————————————————————————————————————
   Base element defaults
   ———————————————————————————————————————————————————————————— */

@layer base {
  html {
    scroll-behavior: smooth;
    background: var(--color-mint-100);
  }

  body {
    font-family: var(--font-sans);
    color: var(--color-ink);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-sans);
    line-height: 1.1;
  }

  h1 {
    font-weight: 800;
    letter-spacing: -0.035em;
    text-wrap: balance;
  }

  h2 {
    font-weight: 800;
    letter-spacing: -0.03em;
    text-wrap: balance;
  }

  h3 {
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* .high — the mint-600 emphasis span used in h1/h2 */
  .high {
    color: var(--color-mint-600);
  }
}

[hidden] {
  display: none !important;
}
```

- [ ] **Step 2: Verify dev server still compiles**

```bash
cd /c/repos/pixelboost-astro && npm run build 2>&1 | tail -20
```

Expected: build completes (may have warnings about missing font CSS vars — fixed in next task). No TypeScript errors.

- [ ] **Step 3: Commit**

```bash
cd /c/repos/pixelboost-astro
git add src/styles/global.css
git commit -m "feat: replace design tokens with v2 mint palette and Plus Jakarta Sans"
```

---

## Task 2: Fonts — Switch to Plus Jakarta Sans

**Files:**
- Modify: `astro.config.mjs`
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Remove local font config from astro.config.mjs**

Replace the `fonts` array and remove unused `fontProviders` import:

```js
// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://pixelboost.ca",
  integrations: [mdx(), sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
  security: { csp: true },
  experimental: {
    rustCompiler: true,
    queuedRendering: { enabled: true },
  },
});
```

- [ ] **Step 2: Update BaseLayout.astro**

Replace the two `<Font>` tags with Google Fonts preconnect + stylesheet. Update body class to use new tokens:

```astro
---
import "../styles/global.css";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
import type { ImageMetadata } from "astro";

interface Props {
  title: string;
  description?: string;
  image?: ImageMetadata;
}

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const { title, description = SITE_DESCRIPTION, image } = Astro.props;
const pageTitle = title === SITE_TITLE ? title : `${title} | ${SITE_TITLE}`;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <meta name="generator" content={Astro.generator} />

    <!-- Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

    <link rel="canonical" href={canonicalURL} />

    <title>{pageTitle}</title>
    <meta name="title" content={pageTitle} />
    <meta name="description" content={description} />

    <meta property="og:type" content="website" />
    <meta property="og:url" content={Astro.url} />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    {image && <meta property="og:image" content={new URL(image.src, Astro.url)} />}
  </head>

  <body class="min-h-screen">
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Build to confirm no font-related errors**

```bash
cd /c/repos/pixelboost-astro && npm run build 2>&1 | tail -20
```

Expected: clean build, no `--font-lato` or `--font-noto-sans` references remaining.

- [ ] **Step 4: Commit**

```bash
cd /c/repos/pixelboost-astro
git add astro.config.mjs src/layouts/BaseLayout.astro
git commit -m "feat: switch to Plus Jakarta Sans via Google Fonts"
```

---

## Task 3: Page Shell — index.astro + 28px frame

**Files:**
- Rewrite: `src/pages/index.astro`

- [ ] **Step 1: Rewrite index.astro**

New component names: `Header.astro` stays as nav file, `Features.astro` becomes Pillars, `Portfolio.astro` becomes Work. `Comparison` is dropped. New components: `Problem`, `Audit`, `FAQ`.

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/Header.astro";
import Hero from "../components/Hero.astro";
import Problem from "../components/Problem.astro";
import Audit from "../components/Audit";
import Features from "../components/Features.astro";
import Portfolio from "../components/Portfolio.astro";
import Pricing from "../components/Pricing.astro";
import FAQ from "../components/FAQ.astro";
import ClosingCTA from "../components/ClosingCTA.astro";
import Footer from "../components/Footer.astro";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
---

<BaseLayout title={SITE_TITLE} description={SITE_DESCRIPTION}>
  <div class="min-h-screen" style="background: var(--color-mint-100); padding: 28px;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <Header />
    </div>
    <main>
      <Hero />
      <Problem />
      <Audit client:load />
      <Features />
      <Portfolio />
      <Pricing />
      <FAQ />
      <ClosingCTA />
    </main>
    <Footer />
  </div>
</BaseLayout>
```

- [ ] **Step 2: Build to confirm imports resolve**

```bash
cd /c/repos/pixelboost-astro && npm run build 2>&1 | grep -E "error|Error|warn" | head -20
```

Expected: errors about missing `Problem.astro`, `Audit`, `FAQ.astro` — those are created in later tasks. If only those missing-file errors appear, the shell is correct.

- [ ] **Step 3: Commit**

```bash
cd /c/repos/pixelboost-astro
git add src/pages/index.astro
git commit -m "feat: scaffold v2 page shell with 28px mint frame"
```

---

## Task 4: Nav (Header.astro rewrite)

**Files:**
- Rewrite: `src/components/Header.astro`

- [ ] **Step 1: Rewrite Header.astro**

Pill nav, paper bg, logo SVG preserved, anchor links, dark pill CTA. Mobile hamburger pattern from existing script kept.

```astro
---
import logoBlack from "../assets/svgs/logo-black.svg";
---

<header style="position: sticky; top: 28px; z-index: 50; margin-bottom: 0;">
  <nav
    style="display: flex; justify-content: space-between; align-items: center; background: var(--color-paper); border-radius: 9999px; padding: 10px 14px 10px 22px; box-shadow: var(--shadow-nav); max-width: 1200px; margin: 0 auto;"
    aria-label="Main navigation"
  >
    <!-- Logo -->
    <a href="/" style="display: flex; align-items: center;">
      <img src={logoBlack.src} alt="Pixelboost" style="height: 40px; width: auto;" />
    </a>

    <!-- Desktop links -->
    <div id="nav-links" style="display: flex; gap: 28px; align-items: center; font-weight: 500; font-size: 14.5px;">
      <a href="#problem" style="color: inherit; transition: color 0.15s;" class="nav-link">Why it matters</a>
      <a href="#audit"   style="color: inherit; transition: color 0.15s;" class="nav-link">Free audit</a>
      <a href="#work"    style="color: inherit; transition: color 0.15s;" class="nav-link">Work</a>
      <a href="/blog"    style="color: inherit; transition: color 0.15s;" class="nav-link">Blog</a>
      <a href="#pricing" style="color: inherit; transition: color 0.15s;" class="nav-link">Pricing</a>
      <a href="#faq"     style="color: inherit; transition: color 0.15s;" class="nav-link">FAQ</a>
      <a
        href="#audit"
        style="display: inline-flex; align-items: center; gap: 8px; background: var(--color-ink); color: var(--color-paper); border: 0; border-radius: 9999px; padding: 10px 18px; font-weight: 600; font-size: 14px; text-decoration: none; transition: transform 0.15s, box-shadow 0.15s;"
        class="nav-cta"
      >Score my site →</a>
    </div>

    <!-- Mobile hamburger -->
    <button
      id="nav-toggle"
      style="display: none; flex-direction: column; align-items: center; justify-content: center; gap: 5px; width: 40px; height: 32px; background: none; border: none; cursor: pointer;"
      aria-label="Toggle menu"
      aria-expanded="false"
      aria-controls="mobile-nav"
    >
      <span style="display: block; height: 2px; width: 100%; border-radius: 2px; background: var(--color-ink); transition: all 0.3s;" aria-hidden="true"></span>
      <span style="display: block; height: 2px; width: 100%; border-radius: 2px; background: var(--color-ink); transition: all 0.3s;" aria-hidden="true"></span>
      <span style="display: block; height: 2px; width: 100%; border-radius: 2px; background: var(--color-ink); transition: all 0.3s;" aria-hidden="true"></span>
    </button>
  </nav>

  <!-- Mobile menu -->
  <div
    id="mobile-nav"
    style="display: none; background: var(--color-paper); border-radius: 20px; margin-top: 8px; padding: 16px 24px; max-width: 1200px; margin-left: auto; margin-right: auto;"
  >
    <div style="display: flex; flex-direction: column; gap: 4px; font-weight: 500; font-size: 15px;">
      <a href="#problem" style="padding: 10px 0; border-bottom: 1px solid var(--color-line); color: inherit;">Why it matters</a>
      <a href="#audit"   style="padding: 10px 0; border-bottom: 1px solid var(--color-line); color: inherit;">Free audit</a>
      <a href="#work"    style="padding: 10px 0; border-bottom: 1px solid var(--color-line); color: inherit;">Work</a>
      <a href="/blog"    style="padding: 10px 0; border-bottom: 1px solid var(--color-line); color: inherit;">Blog</a>
      <a href="#pricing" style="padding: 10px 0; border-bottom: 1px solid var(--color-line); color: inherit;">Pricing</a>
      <a href="#faq"     style="padding: 10px 0; color: inherit;">FAQ</a>
      <a href="#audit" style="margin-top: 12px; display: block; text-align: center; background: var(--color-ink); color: var(--color-paper); border-radius: 9999px; padding: 12px 20px; font-weight: 600;">Score my site →</a>
    </div>
  </div>
</header>

<style>
  .nav-link:hover { color: var(--color-mint-600); }
  .nav-cta:hover { transform: translateY(-1px); box-shadow: var(--shadow-btn); }

  @media (max-width: 768px) {
    #nav-links { display: none !important; }
    #nav-toggle { display: flex !important; }
  }
</style>

<script is:inline>
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-nav');
  const spans = toggle.querySelectorAll('span');

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile nav when any anchor link is clicked
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.style.display = 'none';
      toggle.setAttribute('aria-expanded', 'false');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
</script>
```

- [ ] **Step 2: Build**

```bash
cd /c/repos/pixelboost-astro && npm run build 2>&1 | grep -E "^.*error" | head -10
```

Expected: no errors from Header.astro.

- [ ] **Step 3: Commit**

```bash
cd /c/repos/pixelboost-astro
git add src/components/Header.astro
git commit -m "feat: rewrite nav as pill-shaped sticky header with v2 design"
```

---

## Task 5: Hero (Hero.astro rewrite)

**Files:**
- Rewrite: `src/components/Hero.astro`

- [ ] **Step 1: Rewrite Hero.astro**

Two-column grid, browser card static visual, decorative blobs, proof row. No content collection — all hardcoded.

```astro
---
import logoBlack from "../assets/svgs/logo-black.svg";
---

<section
  style="position: relative; overflow: hidden; background: var(--color-paper); border-radius: var(--radius-section); max-width: 1200px; margin: 16px auto 0; padding: clamp(56px, 7vw, 96px) clamp(28px, 5vw, 72px);"
>
  <!-- Decorative blobs -->
  <div aria-hidden="true" style="position: absolute; right: -80px; top: -80px; width: 360px; height: 360px; background: var(--color-mint-100); border-radius: 50%; z-index: 0;" class="hero-blob"></div>
  <div aria-hidden="true" style="position: absolute; right: 60px; top: 140px; width: 120px; height: 120px; background: var(--color-peach); border-radius: 50%; z-index: 0;" class="hero-blob"></div>

  <div class="hero-inner" style="position: relative; z-index: 1; display: grid; grid-template-columns: 1.2fr 1fr; gap: 60px; align-items: center;">

    <!-- Left: copy -->
    <div>
      <h1 style="font-size: clamp(44px, 6.2vw, 84px); font-weight: 800; line-height: 0.98; letter-spacing: -0.035em; margin: 0 0 22px 0; text-wrap: balance;">
        Websites that <span class="high">actually work</span> for your small business.
      </h1>

      <p style="font-size: clamp(16px, 1.35vw, 19px); color: var(--color-ink-500); line-height: 1.5; max-width: 56ch; margin: 0 0 28px 0; font-weight: 500;">
        I build fast, accessible, trackable websites for Canadian small businesses — then stick around as your web developer for updates, fixes, and improvements. No site-builder bloat, no surprise invoices.
      </p>

      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 18px;">
        <a href="#audit" class="btn-mint-lg">Score my site →</a>
        <a href="#work"  class="btn-secondary-lg">See recent work</a>
      </div>

      <p style="font-size: 13.5px; color: var(--color-ink-500); margin: 0 0 28px 0; font-style: italic;">
        Free report card. No email required. Takes 30 seconds.
      </p>

      <div style="display: flex; gap: 18px; align-items: center; font-size: 13px; color: var(--color-ink-500); font-weight: 500;">
        <!-- Avatar stack -->
        <div style="display: flex;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-mint-300); border: 2px solid var(--color-paper); display: grid; place-items: center; font-size: 11px; font-weight: 700; color: var(--color-ink); margin-left: 0;"></div>
          <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-peach);    border: 2px solid var(--color-paper); display: grid; place-items: center; font-size: 11px; font-weight: 700; color: var(--color-ink); margin-left: -8px;"></div>
          <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-mint-500); border: 2px solid var(--color-paper); display: grid; place-items: center; font-size: 11px; font-weight: 700; color: var(--color-ink); margin-left: -8px;"></div>
        </div>
        <span>Trusted by 20+ local businesses across Ontario &amp; the Maritimes</span>
      </div>
    </div>

    <!-- Right: browser card visual -->
    <div aria-hidden="true" style="background: var(--color-ink); border-radius: 24px; padding: 22px; box-shadow: var(--shadow-card); transform: rotate(1.5deg); color: var(--color-paper);">
      <!-- Chrome bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
        <div style="display: flex; gap: 6px;">
          <span style="width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.15); display: block;"></span>
          <span style="width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.15); display: block;"></span>
          <span style="width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.15); display: block;"></span>
        </div>
        <span style="font-size: 11px; color: rgba(255,255,255,0.4);">innatridgechristian.ca</span>
      </div>
      <!-- Score card body -->
      <div style="background: var(--color-mint-100); border-radius: 14px; padding: 22px; color: var(--color-ink);">
        <div style="display: flex; align-items: flex-end; gap: 10px; margin-bottom: 6px;">
          <span style="font-size: 64px; font-weight: 800; letter-spacing: -0.04em; line-height: 1; color: var(--color-mint-600);">97</span>
          <span style="font-size: 12px; font-weight: 600; color: var(--color-ink-500); padding-bottom: 8px;">Google<br/>performance</span>
        </div>
        <p style="font-size: 13.5px; color: var(--color-ink-500); font-weight: 500; margin: 0 0 16px 0;">Up from 54 on the old Squarespace site.</p>
        <div style="display: grid; gap: 8px;">
          {[
            { label: 'Speed',         val: 97  },
            { label: 'Accessibility', val: 100 },
            { label: 'SEO',           val: 100 },
          ].map(row => (
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 500;">
              <span>{row.label}</span>
              <div style="flex: 1; height: 6px; background: rgba(15,26,20,0.08); border-radius: 3px; overflow: hidden; margin: 0 12px;">
                <span style={`display: block; height: 100%; width: ${row.val}%; background: var(--color-mint-500); border-radius: 3px;`}></span>
              </div>
              <span style="color: var(--color-mint-600); font-weight: 700;">{row.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

  </div>
</section>

<style>
  .btn-mint-lg {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--color-mint-500); color: var(--color-ink);
    border-radius: 9999px; padding: 15px 24px;
    font-weight: 600; font-size: 15.5px; text-decoration: none;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .btn-mint-lg:hover { transform: translateY(-1px); box-shadow: var(--shadow-btn); background: var(--color-mint-600); color: var(--color-paper); }

  .btn-secondary-lg {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: var(--color-ink);
    border: 1.5px solid var(--color-ink); border-radius: 9999px; padding: 15px 24px;
    font-weight: 600; font-size: 15.5px; text-decoration: none;
    transition: transform 0.15s, box-shadow 0.15s;
    white-space: nowrap;
  }
  .btn-secondary-lg:hover { transform: translateY(-1px); box-shadow: var(--shadow-btn); }

  @media (max-width: 920px) {
    .hero-inner { grid-template-columns: 1fr !important; }
    .hero-blob  { display: none !important; }
  }
</style>
```

- [ ] **Step 2: Build**

```bash
cd /c/repos/pixelboost-astro && npm run build 2>&1 | grep -iE "error" | grep -v "node_modules" | head -10
```

Expected: no Hero-related errors.

- [ ] **Step 3: Commit**

```bash
cd /c/repos/pixelboost-astro
git add src/components/Hero.astro
git commit -m "feat: rewrite Hero with v2 two-column layout and browser card visual"
```

---

## Task 6: Problem section (new component)

**Files:**
- Create: `src/components/Problem.astro`

- [ ] **Step 1: Install lucide-react if not already installed**

```bash
cd /c/repos/pixelboost-astro && npm list lucide-react 2>/dev/null | grep lucide || npm install lucide-react
```

Expected: `lucide-react@x.x.x` in output, or install completes.

- [ ] **Step 2: Create Problem.astro**

Icons rendered as inline SVG strings (Astro can't use React components directly in `.astro` files without a React island — for static icons we use inline SVG matching Lucide's paths at stroke-width 1.5).

```astro
---
// Problem section — 4 symptom cards
// Icons are Lucide paths inlined as SVG (no React island needed for static icons)

const cards = [
  {
    title: 'Your site loads slowly.',
    body:  'Every extra second on mobile loses about 1 in 5 visitors. They leave before they ever see your menu, hours, or services.',
    icon:  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  },
  {
    title: "You can't see who's visiting.",
    body:  "No analytics, or Google Analytics that nobody understands. You're running your business blind.",
    icon:  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  },
  {
    title: "Some customers can't use it.",
    body:  'Older customers, mobile users, anyone with a disability — small accessibility issues turn into "this site is broken" moments.',
    icon:  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  },
  {
    title: "It's a pain to update.",
    body:  "Hours changed? New service? You either pay your old developer to come back, or wrestle with a builder you don't like opening.",
    icon:  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  },
];
---

<section
  id="problem"
  style="background: var(--color-paper-2); border-radius: var(--radius-section); max-width: 1200px; margin: 16px auto 0; padding: clamp(56px, 7vw, 96px) clamp(28px, 5vw, 72px);"
>
  <div style="max-width: 780px;">
    <span class="eyebrow-chip">
      <span class="eyebrow-dot"></span> Why it matters
    </span>
    <h2 style="margin: 0 0 16px 0;">
      Your current site might be quietly <span class="high">costing you leads.</span>
    </h2>
    <p style="font-size: clamp(16px, 1.35vw, 19px); color: var(--color-ink-500); line-height: 1.5; max-width: 56ch; margin: 0; font-weight: 500;">
      Most small-business websites have problems the owner can't see — but their customers feel them every day. Here's where it usually shows up:
    </p>
  </div>

  <div class="problem-grid">
    {cards.map(card => (
      <div class="problem-card">
        <div class="icon-tile" set:html={card.icon} />
        <h3 style="font-size: 18px; font-weight: 700; margin: 0; letter-spacing: -0.01em;">{card.title}</h3>
        <p style="margin: 0; font-size: 14.5px; color: var(--color-ink-500); line-height: 1.5;">{card.body}</p>
      </div>
    ))}
  </div>
</section>

<style>
  .eyebrow-chip {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--color-mint-100); color: var(--color-mint-600);
    font-weight: 600; font-size: 13px; letter-spacing: 0.04em;
    padding: 6px 14px; border-radius: 9999px; margin-bottom: 20px;
  }
  .eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--color-mint-500); display: inline-block;
  }

  .problem-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-top: 40px;
  }
  @media (max-width: 920px) { .problem-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px) { .problem-grid { grid-template-columns: 1fr; } }

  .problem-card {
    background: var(--color-paper-2);
    border: 1px solid var(--color-line);
    border-radius: var(--radius-card);
    padding: 24px;
    display: flex; flex-direction: column; gap: 10px;
  }

  .icon-tile {
    width: 40px; height: 40px; border-radius: var(--radius-icon);
    background: var(--color-mint-100);
    border: 1px solid var(--color-mint-200);
    color: var(--color-mint-700);
    display: grid; place-items: center;
    flex-shrink: 0;
  }
</style>
```

- [ ] **Step 3: Build**

```bash
cd /c/repos/pixelboost-astro && npm run build 2>&1 | grep -iE "error" | grep -v "node_modules" | head -10
```

Expected: no Problem.astro errors.

- [ ] **Step 4: Commit**

```bash
cd /c/repos/pixelboost-astro
git add src/components/Problem.astro
git commit -m "feat: add Problem section with 4-up symptom cards"
```

---

## Task 7: Audit component (Audit.tsx — React, rAF animation)

**Files:**
- Create: `src/components/Audit.tsx`

This is the most critical component. Port the rAF math exactly from v2-app.jsx lines 123–144.

- [ ] **Step 1: Create Audit.tsx**

```tsx
import { useState, useEffect, useRef } from 'react';

type AuditState = 'idle' | 'scanning' | 'done';

interface Scores {
  perf: number;
  a11y: number;
  seo: number;
  mobile: number;
  tracking: number;
}

const TARGETS: Scores = { perf: 58, a11y: 71, seo: 84, mobile: 49, tracking: 25 };

const ROWS: { key: keyof Scores; label: string; sub: string }[] = [
  { key: 'perf',     label: 'Speed',             sub: 'How fast pages load on mobile' },
  { key: 'a11y',     label: 'Accessibility',      sub: 'Can everyone actually use it?' },
  { key: 'seo',      label: 'SEO basics',         sub: 'Can Google find and read it?' },
  { key: 'mobile',   label: 'Mobile experience',  sub: 'Tap targets, layout, readability' },
  { key: 'tracking', label: 'Visitor tracking',   sub: 'Privacy-friendly analytics setup' },
];

function grade(n: number): 'good' | 'mid' | 'bad' {
  return n >= 90 ? 'good' : n >= 65 ? 'mid' : 'bad';
}

const GRADE_COLOR = {
  good: 'var(--color-mint-600)',
  mid:  'var(--color-yellow)',
  bad:  'var(--color-red)',
};

const BAR_COLOR = {
  good: 'var(--color-mint-500)',
  mid:  'var(--color-yellow)',
  bad:  'var(--color-red)',
};

export default function Audit() {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<AuditState>('idle');
  const [scores, setScores] = useState<Scores>({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (state !== 'scanning') return;
    const start = performance.now();
    const dur = 1400;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setScores({
        perf:     Math.round(TARGETS.perf     * e),
        a11y:     Math.round(TARGETS.a11y     * e),
        seo:      Math.round(TARGETS.seo      * e),
        mobile:   Math.round(TARGETS.mobile   * e),
        tracking: Math.round(TARGETS.tracking * e),
      });
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setState('done');
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    if (state === 'done') {
      // Reset for "Run again"
      setScores({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0 });
      setState('scanning');
    } else {
      setState('scanning');
    }
  };

  const showScores = state !== 'idle';
  const displayUrl = state === 'idle' ? 'yourbusiness.ca' : (url || 'yourbusiness.ca');

  return (
    <section
      id="audit"
      style={{
        background: 'var(--color-ink)',
        color: 'var(--color-paper)',
        borderRadius: 'var(--radius-section)',
        maxWidth: '1200px',
        margin: '16px auto 0',
        padding: 'clamp(56px, 7vw, 96px) clamp(28px, 5vw, 72px)',
      }}
    >
      <div className="audit-shell">

        {/* Left column */}
        <div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(60,203,138,0.15)', color: 'var(--color-mint-300)',
            fontWeight: 600, fontSize: '13px', letterSpacing: '0.04em',
            padding: '6px 14px', borderRadius: '9999px', marginBottom: '20px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-mint-500)', display: 'inline-block' }}></span>
            Free, no email required
          </span>

          <h2 style={{ color: 'var(--color-paper)', margin: '0 0 16px 0' }}>
            Get a free <span style={{ color: 'var(--color-mint-600)' }}>website report card.</span>
          </h2>

          <p style={{
            fontSize: 'clamp(16px, 1.35vw, 19px)',
            color: 'rgba(248,245,238,0.75)',
            lineHeight: 1.5, maxWidth: '56ch', margin: '0 0 28px 0', fontWeight: 500,
          }}>
            I check your site the way Google and real customers experience it: how fast it loads, whether people can use it easily, whether search engines can understand it, and whether you're tracking what visitors do.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', margin: '20px 0 14px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="yourbusiness.ca"
              value={url}
              onChange={e => setUrl(e.target.value)}
              aria-label="Your website URL"
              style={{
                flex: 1, minWidth: '200px',
                fontFamily: 'inherit', fontSize: '15px',
                padding: '14px 18px',
                background: 'var(--color-paper)',
                border: '1.5px solid var(--color-ink)',
                borderRadius: '9999px',
                outline: 'none',
                color: 'var(--color-ink)',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-mint-500)'; e.currentTarget.style.boxShadow = '0 0 0 4px var(--color-mint-100)'; }}
              onBlur={e =>  { e.currentTarget.style.borderColor = 'var(--color-ink)';      e.currentTarget.style.boxShadow = 'none'; }}
            />
            <button
              type="submit"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'var(--color-mint-500)', color: 'var(--color-ink)',
                border: 0, borderRadius: '9999px', padding: '14px 22px',
                fontWeight: 600, fontSize: '14.5px', fontFamily: 'inherit', cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-btn)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
            >
              {state === 'scanning' ? 'Scanning…' : state === 'done' ? 'Run again' : 'Score my site'} →
            </button>
          </form>

          <p style={{ fontSize: '12.5px', color: 'rgba(248,245,238,0.55)', fontStyle: 'italic', margin: '0 0 0 2px' }}>
            <em style={{ color: 'var(--color-mint-300)', fontStyle: 'normal' }}>Technically:</em> I use Google Lighthouse, axe accessibility checks, and a Plausible tracking audit to back the report up. You'll get it whether or not we work together.
          </p>
        </div>

        {/* Right column — report card */}
        <div
          aria-live="polite"
          style={{
            background: 'var(--color-paper)',
            color: 'var(--color-ink)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Card header */}
          <div style={{
            padding: '16px 22px',
            borderBottom: '1px solid var(--color-line)',
            background: 'var(--color-paper-2)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: '12px', fontWeight: 600, color: 'var(--color-ink-500)',
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[0,1,2].map(i => <span key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-line-2)', display: 'block' }}/>)}
            </div>
            <div>Sample report — {displayUrl} · Apr 2026</div>
          </div>

          {/* Metric rows */}
          <div style={{ padding: '10px 22px' }}>
            {ROWS.map(row => {
              const val = scores[row.key];
              const g = grade(val);
              return (
                <div key={row.key} style={{
                  display: 'grid',
                  gridTemplateColumns: '1.3fr 1fr 60px',
                  alignItems: 'center', gap: '16px',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--color-line)',
                  fontSize: '14px',
                }}>
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>{row.label}</span>
                    <span style={{ color: 'var(--color-ink-500)', fontSize: '12.5px', fontWeight: 500 }}>{row.sub}</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--color-line)', borderRadius: '4px', overflow: 'hidden' }}>
                    <span style={{
                      display: 'block', height: '100%', borderRadius: '4px',
                      background: BAR_COLOR[g],
                      width: showScores ? `${val}%` : '0%',
                      transition: 'width 0.05s linear',
                    }}/>
                  </div>
                  <div style={{
                    fontWeight: 800, fontSize: '17px', textAlign: 'right',
                    letterSpacing: '-0.02em',
                    color: showScores ? GRADE_COLOR[g] : 'var(--color-ink-400)',
                  }}>
                    {showScores ? val : '—'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Card footer / verdict */}
          <div style={{
            padding: '16px 22px',
            background: 'var(--color-mint-50)',
            borderTop: '1px solid var(--color-line)',
          }}>
            <p style={{ fontSize: '13.5px', fontWeight: 600, margin: 0 }}>
              {state === 'done'
                ? <>Verdict → <strong style={{ color: 'var(--color-mint-700)' }}>5 fixes could save ~1 in 2 visitors.</strong></>
                : state === 'scanning'
                  ? 'Scanning your site…'
                  : <>Verdict → <strong>Enter your URL above to run a real scan.</strong></>
              }
            </p>
          </div>
        </div>

      </div>

      <style>{`
        .audit-shell {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: clamp(32px, 4vw, 64px);
          align-items: center;
          margin-top: 32px;
        }
        @media (max-width: 920px) {
          .audit-shell { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 2: Build**

```bash
cd /c/repos/pixelboost-astro && npm run build 2>&1 | grep -iE "error" | grep -v "node_modules" | head -20
```

Expected: clean build. The `<style>` tag inside the TSX uses a template literal — this is valid React.

- [ ] **Step 3: Commit**

```bash
cd /c/repos/pixelboost-astro
git add src/components/Audit.tsx
git commit -m "feat: add Audit report card component with rAF score animation"
```

---

## Task 8: Pillars (Features.astro rewrite)

**Files:**
- Rewrite: `src/components/Features.astro`

- [ ] **Step 1: Rewrite Features.astro**

Hardcoded pillar data, inline SVG icons (Lucide paths), no content collection.

```astro
---
const pillars = [
  {
    title: 'Fast on mobile.',
    pitch: 'Your site should load quickly on phones, even on slow connections.',
    proof: 'I target 95+ Google Lighthouse performance scores on real devices.',
    // Lucide Zap
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  },
  {
    title: 'Accessible by default.',
    pitch: 'Your site should work for every customer — older folks, mobile users, anyone with a disability.',
    proof: 'WCAG 2.1 AA, AODA-aligned, tested with axe and real assistive tech.',
    // Lucide Accessibility
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-5.87.94"/><path d="m5 8 3-3 5.5 1.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/></svg>`,
  },
  {
    title: 'Tracked with simple analytics.',
    pitch: "You should know which pages bring in leads — without cookie banners or creepy tracking.",
    proof: 'Privacy-friendly Plausible analytics. GDPR/PIPEDA-compliant. No banner needed.',
    // Lucide BarChart3
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
  },
  {
    title: 'Maintained after launch.',
    pitch: "After launch, I'm still your developer. Hours changed, new service, copy fix? Send it.",
    proof: 'Included in the monthly plan. Same-week turnaround for small changes.',
    // Lucide Wrench
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  },
];
---

<section
  style="background: var(--color-paper); border-radius: var(--radius-section); max-width: 1200px; margin: 16px auto 0; padding: clamp(56px, 7vw, 96px) clamp(28px, 5vw, 72px);"
>
  <div style="max-width: 780px;">
    <span class="eyebrow-chip">
      <span class="eyebrow-dot"></span> What you actually get
    </span>
    <h2 style="margin: 0 0 16px 0;">
      Every site is built on the same <span class="high">four pillars.</span>
    </h2>
    <p style="font-size: clamp(16px, 1.35vw, 19px); color: var(--color-ink-500); line-height: 1.5; max-width: 56ch; margin: 0; font-weight: 500;">
      No template. No subscription you'll forget about. Just a clean site built around what your customers need to do next.
    </p>
  </div>

  <div class="pillars-grid">
    {pillars.map(p => (
      <div class="pillar-card">
        <div class="icon-tile" set:html={p.icon} />
        <h3 style="font-size: 19px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; margin: 4px 0 0 0;">{p.title}</h3>
        <p style="font-size: 14.5px; line-height: 1.5; color: var(--color-ink-700); margin: 0;">{p.pitch}</p>
        <p class="proof-line"><em>Technically:</em> {p.proof}</p>
      </div>
    ))}
  </div>
</section>

<style>
  .eyebrow-chip {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--color-mint-100); color: var(--color-mint-600);
    font-weight: 600; font-size: 13px; letter-spacing: 0.04em;
    padding: 6px 14px; border-radius: 9999px; margin-bottom: 20px;
  }
  .eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--color-mint-500); display: inline-block;
  }

  .pillars-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-top: 36px;
  }
  @media (max-width: 1000px) { .pillars-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px)  { .pillars-grid { grid-template-columns: 1fr; } }

  .pillar-card {
    background: var(--color-paper-2);
    border-radius: var(--radius-card);
    padding: 26px;
    border: 1px solid var(--color-line);
    display: flex; flex-direction: column; gap: 12px;
  }

  .icon-tile {
    width: 40px; height: 40px; border-radius: var(--radius-icon);
    background: var(--color-mint-100);
    border: 1px solid var(--color-mint-200);
    color: var(--color-mint-700);
    display: grid; place-items: center;
    flex-shrink: 0;
  }

  .proof-line {
    font-size: 12.5px; color: var(--color-ink-500);
    padding-top: 12px; margin-top: auto;
    border-top: 1px dashed var(--color-line-2);
    line-height: 1.5; margin-bottom: 0;
  }
  .proof-line em { color: var(--color-ink); font-style: italic; font-weight: 600; }
</style>
```

- [ ] **Step 2: Build**

```bash
cd /c/repos/pixelboost-astro && npm run build 2>&1 | grep -iE "error" | grep -v "node_modules" | head -10
```

- [ ] **Step 3: Commit**

```bash
cd /c/repos/pixelboost-astro
git add src/components/Features.astro
git commit -m "feat: rewrite Features as v2 Pillars section with Lucide icons"
```

---

## Task 9: Portfolio schema + content updates

**Files:**
- Modify: `src/content.config.ts`
- Modify: `src/content/portfolio/success-installations.md`
- Modify: `src/content/portfolio/ontario-college-of-teachers.md`
- Modify: `src/content/portfolio/lunar-rhythm-gardens.md`
- Modify: `src/content/portfolio/crescendo-stage.md`

- [ ] **Step 1: Add new fields to portfolio schema in content.config.ts**

Find the `portfolio` collection definition and replace it:

```ts
const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tags: z.string(),
      image: image(),
      outcome: z.string().optional(),
      location: z.string().optional(),
      summary: z.string().optional(),
      stats: z.array(z.object({
        label:  z.string(),
        before: z.string(),
        after:  z.string(),
      })).optional(),
      kpi: z.string().optional(),
    }),
});
```

- [ ] **Step 2: Update success-installations.md**

```markdown
---
title: Success Installations
tags: Commercial / Racking
image: ../../assets/webp/racking.webp
location: Burlington, ON
summary: Commercial racking company. Rebuilt for mobile leads with a faster, cleaner service-area focus.
outcome: "Doubled inbound lead volume with a faster, mobile-first design"
stats:
  - label: Lighthouse
    before: "43"
    after: "96"
  - label: Load time
    before: "5.1s"
    after: "1.3s"
  - label: Inbound leads/mo
    before: "11"
    after: "28"
kpi: "Doubled inbound lead volume in 60 days"
---
```

- [ ] **Step 3: Update ontario-college-of-teachers.md**

```markdown
---
title: Ontario College of Teachers FAQ
tags: Regulatory / Education
image: ../../assets/webp/oct.webp
location: Toronto, ON
summary: Provincial regulatory body. Rebuilt the FAQ experience to reduce support call volume.
outcome: "Reduced support calls by clarifying the application process"
stats:
  - label: Lighthouse
    before: "62"
    after: "100"
  - label: Accessibility
    before: "Fail"
    after: "WCAG AA"
  - label: Tracking
    before: "GA3"
    after: "Plausible"
kpi: "Support call volume down 35% post-launch"
---
```

- [ ] **Step 4: Update lunar-rhythm-gardens.md**

```markdown
---
title: Lunar Rhythm Gardens
tags: Agriculture / Local Markets
image: ../../assets/jpg/lunar-farm.jpg
location: Prince Edward Island
summary: Family farm selling at local markets. Built an online order flow that actually converts.
outcome: "Increased local online orders by 40% in the first season"
stats:
  - label: Lighthouse
    before: "51"
    after: "97"
  - label: Load time
    before: "4.4s"
    after: "1.0s"
  - label: Online orders/wk
    before: "6"
    after: "22"
kpi: "Online orders up 40% in the first season"
---
```

- [ ] **Step 5: Update crescendo-stage.md**

```markdown
---
title: Crescendo Stage
tags: Finance / Automation
image: ../../assets/webp/abstract-poly.webp
location: Ottawa, ON
summary: Finance workflow platform. Redesigned around automation to cut manual processing time.
outcome: "Automated workflows, reducing manual processing time by 60%"
stats:
  - label: Lighthouse
    before: "48"
    after: "94"
  - label: Load time
    before: "3.8s"
    after: "0.9s"
  - label: Manual processing
    before: "High"
    after: "–60%"
kpi: "Manual processing time cut by 60%"
---
```

- [ ] **Step 6: Build to confirm schema validates**

```bash
cd /c/repos/pixelboost-astro && npm run build 2>&1 | grep -iE "error|warn" | grep -v "node_modules" | head -20
```

Expected: no content validation errors.

- [ ] **Step 7: Commit**

```bash
cd /c/repos/pixelboost-astro
git add src/content.config.ts src/content/portfolio/
git commit -m "feat: extend portfolio schema with stats/kpi/location fields, update all 4 clients"
```

---

## Task 10: Work section (Portfolio.astro rewrite)

**Files:**
- Rewrite: `src/components/Portfolio.astro`

- [ ] **Step 1: Rewrite Portfolio.astro**

Reads from portfolio collection, renders v2 before/after cards. TrendingUp icon inlined as SVG.

```astro
---
import { getCollection } from "astro:content";

const clientsDocs = await getCollection("portfolio");

// Trending up icon (Lucide TrendingUp, 14px)
const trendingUp = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`;
---

<section
  id="work"
  style="background: var(--color-mint-100); border-radius: var(--radius-section); max-width: 1200px; margin: 16px auto 0; padding: clamp(56px, 7vw, 96px) clamp(28px, 5vw, 72px);"
>
  <div style="max-width: 780px;">
    <span class="eyebrow-chip" style="background: var(--color-paper);">
      <span class="eyebrow-dot"></span> Recent work
    </span>
    <h2 style="margin: 0 0 16px 0;">
      Real Canadian small businesses, <span class="high">real before-and-after.</span>
    </h2>
    <p style="font-size: clamp(16px, 1.35vw, 19px); color: var(--color-ink-500); line-height: 1.5; max-width: 56ch; margin: 0; font-weight: 500;">
      Every project gets a Google Lighthouse score before and after. The numbers are how I keep myself honest.
    </p>
  </div>

  <div class="work-grid">
    {clientsDocs.map(client => (
      <div class="work-card">
        <!-- Visual block -->
        <div class="vis-block">
          <span class="vis-tag">{client.data.tags}</span>
        </div>

        <!-- Card body -->
        <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
          <div>
            <h3 style="font-size: 17px; font-weight: 700; margin: 0 0 2px 0;">{client.data.title}</h3>
            {client.data.location && (
              <span style="font-size: 13px; color: var(--color-ink-500);">{client.data.location}</span>
            )}
          </div>
          {client.data.summary && (
            <p style="font-size: 14.5px; color: var(--color-ink-700); margin: 0; line-height: 1.5;">{client.data.summary}</p>
          )}

          {client.data.stats && client.data.stats.length > 0 && (
            <div class="ba-table">
              {client.data.stats.map(stat => (
                <div class="ba-row">
                  <span class="ba-label">{stat.label}</span>
                  <span class="ba-before">{stat.before}</span>
                  <span class="ba-arrow">→</span>
                  <span class="ba-after">{stat.after}</span>
                </div>
              ))}
            </div>
          )}

          {client.data.kpi && (
            <div class="kpi-badge">
              <span set:html={trendingUp} style="flex-shrink: 0; color: var(--color-mint-700);" />
              {client.data.kpi}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</section>

<style>
  .eyebrow-chip {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--color-mint-100); color: var(--color-mint-600);
    font-weight: 600; font-size: 13px; letter-spacing: 0.04em;
    padding: 6px 14px; border-radius: 9999px; margin-bottom: 20px;
  }
  .eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--color-mint-500); display: inline-block;
  }

  .work-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 36px;
  }
  @media (max-width: 920px) { .work-grid { grid-template-columns: 1fr; } }

  .work-card {
    background: var(--color-paper-2);
    border-radius: var(--radius-card);
    padding: 24px;
    border: 1px solid var(--color-line);
    display: flex; flex-direction: column; gap: 14px;
  }

  .vis-block {
    aspect-ratio: 16/10; border-radius: 12px; background: var(--color-ink);
    position: relative; overflow: hidden;
    background-image: repeating-linear-gradient(135deg, rgba(147,222,170,0.1) 0 12px, transparent 12px 24px);
  }

  .vis-tag {
    position: absolute; left: 14px; bottom: 12px; z-index: 1;
    color: var(--color-mint-200); font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.08em;
  }

  .ba-table {
    display: grid; gap: 6px;
    padding-top: 14px; margin-top: auto;
    border-top: 1px dashed var(--color-line-2);
  }
  .ba-row {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: 10px; align-items: baseline;
    font-size: 13px;
  }
  .ba-label  { font-size: 11px; font-weight: 600; color: var(--color-ink-500); text-transform: uppercase; letter-spacing: 0.06em; }
  .ba-before { color: var(--color-red);    font-weight: 700; font-variant-numeric: tabular-nums; }
  .ba-arrow  { color: var(--color-ink-400); font-size: 12px; }
  .ba-after  { color: var(--color-mint-700); font-weight: 700; font-variant-numeric: tabular-nums; }

  .kpi-badge {
    display: flex; align-items: center; gap: 8px;
    margin-top: 4px;
    padding: 10px 12px;
    background: var(--color-mint-100);
    border-radius: 10px;
    font-size: 13px; font-weight: 600;
    color: var(--color-ink);
  }
</style>
```

- [ ] **Step 2: Build**

```bash
cd /c/repos/pixelboost-astro && npm run build 2>&1 | grep -iE "error" | grep -v "node_modules" | head -10
```

- [ ] **Step 3: Commit**

```bash
cd /c/repos/pixelboost-astro
git add src/components/Portfolio.astro
git commit -m "feat: rewrite Work section with before/after cards from portfolio collection"
```

---

## Task 11: Pricing section + data update

**Files:**
- Rewrite: `src/components/Pricing.astro`
- Rewrite: `src/content/landing/pricing.md`

- [ ] **Step 1: Update pricing.md to v2 two-plan structure**

The existing schema (`variant`, `title`, `price`, `priceNote`, `features[].text/included`) maps cleanly to the v2 plans. Rewrite the file:

```markdown
---
eyebrow: Pricing
headline: "Two ways to work together. No surprise invoices."
plans:
  - variant: monthly
    title: Pixelboost monthly
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

- [ ] **Step 2: Rewrite Pricing.astro**

```astro
---
import { getEntry } from "astro:content";

const pricingDoc = await getEntry("landingPricing", "pricing");
if (!pricingDoc) throw new Error("Could not find pricing content");
const { plans } = pricingDoc.data;

// monthly plan is featured (dark card)
const featured = plans.find(p => p.variant === 'monthly')!;
const standard = plans.find(p => p.variant === 'lump')!;
---

<section
  id="pricing"
  style="background: var(--color-paper); border-radius: var(--radius-section); max-width: 1200px; margin: 16px auto 0; padding: clamp(56px, 7vw, 96px) clamp(28px, 5vw, 72px);"
>
  <div style="max-width: 780px;">
    <span class="eyebrow-chip">
      <span class="eyebrow-dot"></span> Honest pricing
    </span>
    <h2 style="margin: 0 0 16px 0;">
      Two ways to work together. <span class="high">No surprise invoices.</span>
    </h2>
    <p style="font-size: clamp(16px, 1.35vw, 19px); color: var(--color-ink-500); line-height: 1.5; max-width: 56ch; margin: 0; font-weight: 500;">
      Pick the monthly plan if you want a partner. Pick the flat rate if you'd rather pay once and own it outright. Both include the same build quality.
    </p>
  </div>

  <div class="price-grid">
    <!-- Featured: monthly -->
    <div class="price-card featured">
      <span class="badge">Most chosen</span>
      <h3 class="plan-name">{featured.title}</h3>
      <p class="plan-blurb">Custom site + ongoing care, all-in.</p>
      <div class="plan-price">{featured.price}<small>{featured.priceNote}</small></div>
      <ul class="plan-features">
        {featured.features.map(f => <li>{f.text}</li>)}
      </ul>
      <a href="#audit" class="plan-btn mint">Start with a free audit →</a>
    </div>

    <!-- Standard: flat -->
    <div class="price-card">
      <h3 class="plan-name">{standard.title}</h3>
      <p class="plan-blurb">One-time build, you take it from there.</p>
      <div class="plan-price">{standard.price}<small>{standard.priceNote}</small></div>
      <ul class="plan-features">
        {standard.features.map(f => <li>{f.text}</li>)}
      </ul>
      <a href="#audit" class="plan-btn dark">Talk it through →</a>
    </div>
  </div>

  <!-- Ownership footnote -->
  <div class="price-foot">
    <strong>You own the site.</strong> After 12 months, you can keep me on monthly, switch to a lighter care plan, or take the site with you to another developer. Either way, the code, content, and domain are yours.
  </div>
</section>

<style>
  .eyebrow-chip {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--color-mint-100); color: var(--color-mint-600);
    font-weight: 600; font-size: 13px; letter-spacing: 0.04em;
    padding: 6px 14px; border-radius: 9999px; margin-bottom: 20px;
  }
  .eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--color-mint-500); display: inline-block;
  }

  .price-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 36px;
    align-items: start;
  }
  @media (max-width: 820px) { .price-grid { grid-template-columns: 1fr; } }

  .price-card {
    background: var(--color-paper-2);
    border-radius: 24px;
    padding: 32px;
    border: 1px solid var(--color-line);
    display: flex; flex-direction: column; gap: 16px;
  }
  .price-card.featured {
    background: var(--color-ink);
    color: var(--color-paper);
    border-color: var(--color-ink);
  }

  .badge {
    align-self: flex-start;
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 5px 10px; border-radius: 9999px;
    background: var(--color-mint-500); color: var(--color-ink);
  }

  .plan-name  { font-size: 15px; font-weight: 700; margin: 0; }
  .plan-blurb { font-size: 14px; margin: 0; color: var(--color-ink-500); }
  .featured .plan-blurb { color: rgba(248,245,238,0.65); }

  .plan-price {
    font-size: 48px; font-weight: 800; letter-spacing: -0.035em; line-height: 1; margin: 6px 0;
  }
  .plan-price small {
    font-size: 14px; font-weight: 500; color: var(--color-ink-500);
  }
  .featured .plan-price small { color: rgba(248,245,238,0.55); }

  .plan-features {
    margin: 8px 0 0 0; padding: 0; list-style: none; display: grid; gap: 8px;
  }
  .plan-features li {
    display: flex; gap: 10px; font-size: 14px; color: var(--color-ink-700); line-height: 1.45;
  }
  .plan-features li::before { content: "✓"; color: var(--color-mint-600); font-weight: 700; flex-shrink: 0; }
  .featured .plan-features li { color: rgba(248,245,238,0.85); }
  .featured .plan-features li::before { color: var(--color-mint-300); }

  .plan-btn {
    display: flex; justify-content: center; align-items: center;
    border-radius: 9999px; padding: 13px 20px;
    font-weight: 600; font-size: 14.5px; text-decoration: none; margin-top: auto;
    transition: transform 0.15s, box-shadow 0.15s;
    border: 0;
  }
  .plan-btn:hover { transform: translateY(-1px); box-shadow: var(--shadow-btn); }
  .plan-btn.mint { background: var(--color-mint-500); color: var(--color-ink); }
  .plan-btn.mint:hover { background: var(--color-mint-600); color: var(--color-paper); }
  .plan-btn.dark { background: var(--color-ink); color: var(--color-paper); }

  .price-foot {
    margin-top: 28px;
    padding: 20px 24px;
    background: var(--color-mint-100);
    border: 1px solid var(--color-mint-200);
    border-radius: 16px;
    font-size: 14.5px; line-height: 1.55; color: var(--color-ink-700);
    max-width: 780px;
  }
  .price-foot strong { color: var(--color-ink); font-weight: 700; }
</style>
```

- [ ] **Step 3: Build**

```bash
cd /c/repos/pixelboost-astro && npm run build 2>&1 | grep -iE "error" | grep -v "node_modules" | head -10
```

- [ ] **Step 4: Commit**

```bash
cd /c/repos/pixelboost-astro
git add src/components/Pricing.astro src/content/landing/pricing.md
git commit -m "feat: rewrite Pricing with v2 two-plan layout and updated copy"
```

---

## Task 12: FAQ section (new component)

**Files:**
- Create: `src/components/FAQ.astro`

- [ ] **Step 1: Create FAQ.astro**

CSS-only accordion using `<details>`/`<summary>`. The `+` sign rotates to `×` via CSS on `[open]`.

```astro
---
const questions = [
  {
    q: 'How long does a project take?',
    a: 'About 3–4 weeks from kickoff for most small-business sites. Larger projects with more pages, custom integrations, or content I have to write run 5–6 weeks. I only take on two projects at a time so timelines are honest.',
  },
  {
    q: "What's included in the $200/month plan?",
    a: "The full custom build, hosting, domain setup, SSL, analytics installed, and ongoing updates — copy changes, new pages, fixing things, swapping photos. Anything that takes me less than an hour or two is just included. Big new features get quoted separately so there are no surprises.",
  },
  {
    q: 'Am I locked into a contract?',
    a: "No. The monthly plan is month-to-month, cancel anytime. If you leave, I help you migrate the site to wherever you want — you own the code and the content.",
  },
  {
    q: 'Who owns the website?',
    a: "You do, on both plans. The code, the design, the content, the domain, the analytics — all yours. I don't hold anything hostage.",
  },
  {
    q: 'What if I already have a site?',
    a: 'Then we start with a free audit (above). About a third of the time, the right answer is "your site is mostly fine, here are 3 small fixes." If a rebuild does make sense, we go from there.',
  },
  {
    q: 'Do you only work with Ontario businesses?',
    a: "No, just Canadian. I work with clients across Ontario and the Maritimes mostly, but anywhere in Canada is fine. Time zones matter more than borders.",
  },
  {
    q: 'Why do you keep mentioning "Lighthouse" and "Plausible"?',
    a: "Lighthouse is Google's free tool that grades website speed, accessibility, and SEO — it's the industry standard, and I use it as honest proof that the site is actually good. Plausible is privacy-friendly analytics: visitor counts and traffic sources without cookie banners or selling data. You'll see the dashboards, not me.",
  },
];
---

<section
  id="faq"
  style="background: var(--color-paper-2); border-radius: var(--radius-section); max-width: 1200px; margin: 16px auto 0; padding: clamp(56px, 7vw, 96px) clamp(28px, 5vw, 72px);"
>
  <div style="max-width: 760px;">
    <span class="eyebrow-chip">
      <span class="eyebrow-dot"></span> FAQ
    </span>
    <h2 style="margin: 0 0 0 0;">Reasonable questions, plain answers.</h2>
  </div>

  <div class="faq-list" style="max-width: 760px; margin-top: 32px;">
    {questions.map((item, i) => (
      <details class="faq-item" open={i === 0}>
        <summary class="faq-q">{item.q}</summary>
        <div class="faq-a">{item.a}</div>
      </details>
    ))}
  </div>
</section>

<style>
  .eyebrow-chip {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--color-mint-100); color: var(--color-mint-600);
    font-weight: 600; font-size: 13px; letter-spacing: 0.04em;
    padding: 6px 14px; border-radius: 9999px; margin-bottom: 20px;
  }
  .eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--color-mint-500); display: inline-block;
  }

  .faq-list { border-top: 1px solid var(--color-line); }

  .faq-item { border-bottom: 1px solid var(--color-line); padding: 20px 0; }

  .faq-q {
    display: flex; justify-content: space-between; align-items: center; gap: 20px;
    cursor: pointer; font-size: 17px; font-weight: 600; letter-spacing: -0.01em;
    list-style: none;
  }
  .faq-q::-webkit-details-marker { display: none; }
  .faq-q::after {
    content: "+"; font-weight: 400; font-size: 22px;
    color: var(--color-ink-500); flex-shrink: 0;
    transition: transform 0.2s ease;
    display: inline-block;
  }
  .faq-item[open] .faq-q::after { transform: rotate(45deg); }

  .faq-a {
    margin-top: 10px;
    font-size: 15px; color: var(--color-ink-500); line-height: 1.6;
    max-width: 64ch;
  }
</style>
```

- [ ] **Step 2: Build**

```bash
cd /c/repos/pixelboost-astro && npm run build 2>&1 | grep -iE "error" | grep -v "node_modules" | head -10
```

- [ ] **Step 3: Commit**

```bash
cd /c/repos/pixelboost-astro
git add src/components/FAQ.astro
git commit -m "feat: add FAQ section with CSS-only details/summary accordion"
```

---

## Task 13: Final CTA (ClosingCTA.astro rewrite)

**Files:**
- Rewrite: `src/components/ClosingCTA.astro`

- [ ] **Step 1: Rewrite ClosingCTA.astro**

```astro
---
---

<section
  id="cta"
  style="background: linear-gradient(135deg, var(--color-ink) 0%, #14261d 100%); color: var(--color-paper); border-radius: var(--radius-section); max-width: 1200px; margin: 16px auto 0; padding: clamp(56px, 7vw, 96px) clamp(28px, 5vw, 72px); text-align: center;"
>
  <h2 style="color: var(--color-paper); margin: 0 0 16px 0;">
    Want to know what your site actually scores?
  </h2>
  <p style="font-size: clamp(16px, 1.35vw, 19px); color: rgba(248,245,238,0.7); line-height: 1.5; max-width: 56ch; margin: 0 auto 32px; font-weight: 500;">
    Free audit, no email required, no sales pitch attached. You'll get a plain-English report card and the three fixes I'd start with — whether or not we end up working together.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
    <a href="#audit" class="cta-btn-mint">Get my free report card →</a>
    <a href="mailto:hi@pixelboost.ca" class="cta-btn-secondary">Or just email me</a>
  </div>
</section>

<style>
  .cta-btn-mint {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--color-mint-500); color: var(--color-ink);
    border-radius: 9999px; padding: 15px 24px;
    font-weight: 600; font-size: 15.5px; text-decoration: none;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .cta-btn-mint:hover { transform: translateY(-1px); box-shadow: var(--shadow-btn); background: var(--color-mint-600); color: var(--color-paper); }

  .cta-btn-secondary {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: var(--color-paper);
    border: 1.5px solid var(--color-paper); border-radius: 9999px; padding: 15px 24px;
    font-weight: 600; font-size: 15.5px; text-decoration: none;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .cta-btn-secondary:hover { transform: translateY(-1px); box-shadow: var(--shadow-btn); }
</style>
```

- [ ] **Step 2: Build**

```bash
cd /c/repos/pixelboost-astro && npm run build 2>&1 | grep -iE "error" | grep -v "node_modules" | head -10
```

- [ ] **Step 3: Commit**

```bash
cd /c/repos/pixelboost-astro
git add src/components/ClosingCTA.astro
git commit -m "feat: rewrite Final CTA with dark gradient section"
```

---

## Task 14: Footer (Footer.astro rewrite)

**Files:**
- Rewrite: `src/components/Footer.astro`

- [ ] **Step 1: Rewrite Footer.astro**

Paper bg, 3-col grid, white logo preserved, real contact info retained.

```astro
---
import logoWhite from "../assets/svgs/logo-white.svg";
const year = new Date().getFullYear();
---

<footer
  style="background: var(--color-paper); max-width: 1200px; margin: 16px auto 0; border-radius: 28px 28px 0 0; padding: 40px clamp(28px, 5vw, 72px) 0; font-size: 14px; color: var(--color-ink-500);"
>
  <div class="foot-grid">
    <!-- Brand col -->
    <div>
      <a href="/">
        <img src={logoWhite.src} alt="Pixelboost" style="height: 40px; width: auto; filter: invert(1);" />
      </a>
      <p style="margin: 14px 0 0 0; max-width: 40ch; line-height: 1.5; font-size: 14px; color: var(--color-ink-500);">
        A one-person web studio in Ontario, building fast, accessible custom websites for Canadian small businesses.
      </p>
    </div>

    <!-- Nav links -->
    <div>
      <h4 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; color: var(--color-ink); letter-spacing: -0.01em;">Pixelboost</h4>
      <a href="#problem" class="foot-link">Why it matters</a>
      <a href="#audit"   class="foot-link">Free audit</a>
      <a href="#work"    class="foot-link">Recent work</a>
      <a href="#pricing" class="foot-link">Pricing</a>
      <a href="#faq"     class="foot-link">FAQ</a>
      <a href="/blog"    class="foot-link">Blog</a>
    </div>

    <!-- Contact -->
    <div>
      <h4 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; color: var(--color-ink); letter-spacing: -0.01em;">Get in touch</h4>
      <a href="mailto:hello@pixelboost.ca" class="foot-link">hello@pixelboost.ca</a>
      <a href="tel:+19057812464"           class="foot-link">(905) 781-2464</a>
    </div>
  </div>

  <!-- Bottom bar -->
  <div style="margin-top: 32px; padding: 16px 0 32px; border-top: 1px solid var(--color-line); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: 12px; color: var(--color-ink-500);">
    <span>&copy; {year} Pixelboost · Made in Ontario, Canada</span>
    <span>Built on this site. Lighthouse 100/100/100/100.</span>
  </div>
</footer>

<style>
  .foot-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 40px;
  }
  @media (max-width: 720px) { .foot-grid { grid-template-columns: 1fr; } }

  .foot-link {
    display: block; color: var(--color-ink-500);
    text-decoration: none; padding: 4px 0;
    transition: color 0.15s;
  }
  .foot-link:hover { color: var(--color-mint-600); }
</style>
```

- [ ] **Step 2: Build — full clean build**

```bash
cd /c/repos/pixelboost-astro && npm run build 2>&1 | tail -30
```

Expected: successful build output, no errors. Note the dist output path and file count.

- [ ] **Step 3: Commit**

```bash
cd /c/repos/pixelboost-astro
git add src/components/Footer.astro
git commit -m "feat: rewrite Footer with v2 paper layout and 3-column grid"
```

---

## Task 15: Smoke test + visual review

- [ ] **Step 1: Start dev server**

```bash
cd /c/repos/pixelboost-astro && npm run dev
```

Open `http://localhost:4321` in a browser.

- [ ] **Step 2: Visual checklist**

Work through the page top to bottom:

- [ ] Mint-100 frame visible around all sections (28px gap between sections and viewport edge)
- [ ] Nav: pill-shaped, paper bg, logo visible, links correct, CTA "Score my site →" present
- [ ] Hero: two-column layout, browser card rotated 1.5deg, proof row avatars visible
- [ ] Problem: cream bg, 4 cards in a row, icon tiles mint-100 with mint-700 stroke
- [ ] Audit: dark ink section, URL input + button, report card on right
- [ ] Audit animation: type any URL, click "Score my site" — scores count up from 0 over ~1.4s with ease-out feel, bars animate in lockstep, verdict appears
- [ ] Pillars: 4-up grid, paper bg, dashed proof-line borders visible
- [ ] Work: mint-100 bg, 2×2 grid, before/after table with red before / mint after values, KPI badge
- [ ] Pricing: 2 cards, featured (dark) has "Most chosen" badge, ownership footnote below
- [ ] FAQ: first item open by default, click others to expand — `+` rotates to `×`
- [ ] Final CTA: dark gradient, centered, two buttons
- [ ] Footer: paper bg, 3 columns, rounded top corners

- [ ] **Step 3: Responsive check**

Resize browser to 900px — hero/audit collapse to 1-col, grids go 2-col.
Resize to 560px — grids go 1-col.

- [ ] **Step 4: Final build + commit**

```bash
cd /c/repos/pixelboost-astro && npm run build && echo "BUILD OK"
```

```bash
cd /c/repos/pixelboost-astro
git add -A
git commit -m "feat: complete Pixelboost v2 landing page redesign"
```
