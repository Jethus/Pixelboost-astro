# PageSpeed Insights Audit Integration — Design Spec

**Date:** 2026-05-01  
**Status:** Approved

## Overview

Replace the fake animated scores in the `Audit` section with real data from the Google PageSpeed Insights API. A Cloudflare Pages Function proxies the API call, keeping the API key server-side. The existing UI shell is preserved; only the data flow and state machine change.

---

## Architecture

### Cloudflare Pages Function

**File:** `functions/api/audit.ts`

- Route: `GET /api/audit?url=https://example.com`
- Validates `url` param — returns 400 if missing or not a valid URL
- Fetches PSI API:
  ```
  https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=...&strategy=mobile&key=...
  ```
- API key read from `env.PSI_API_KEY` (Cloudflare secret)
- Returns JSON: `{ perf, a11y, seo, mobile, tracking }` — all integers 0–100
- Adds `Access-Control-Allow-Origin: *` CORS header

**Score derivations:**

| Key | Source |
|-----|--------|
| `perf` | `categories.performance.score * 100` |
| `a11y` | `categories.accessibility.score * 100` |
| `seo` | `categories.seo.score * 100` |
| `mobile` | Weighted: FCP 30% + TBT 40% + CLS 30%, each normalized 0–100 against PSI thresholds |
| `tracking` | 100 if any `third-party-summary` item matches known analytics domains, else 0 |

**Mobile normalization thresholds (PSI mobile strategy):**

| Metric | Good (100) | Poor (0) |
|--------|-----------|---------|
| FCP | ≤ 1800ms | ≥ 3000ms |
| TBT | ≤ 200ms | ≥ 600ms |
| CLS | ≤ 0.1 | ≥ 0.25 |

Linear interpolation between good/poor bounds, clamped 0–100.

**Tracking domain list:**
- `google-analytics.com`
- `googletagmanager.com`
- `hotjar.com`
- `plausible.io`
- `usefathom.com`
- `heap.io`
- `mixpanel.com`
- `segment.io` / `segment.com`

---

### Audit.tsx Changes

**State machine:** `'idle' | 'scanning' | 'done' | 'error'`

**New flow:**
1. User submits URL
2. Prepend `https://` if no protocol present
3. `setState('scanning')`
4. `fetch('/api/audit?url=...')`
5. On success → `setScores(data)` → `setState('done')`
6. On error → `setState('error')` → show error message in card footer

**Removed:**
- `TARGETS` hardcoded score object
- RAF animation loop (`useEffect` + `useRef` + `requestAnimationFrame`)
- `rafRef`

**Added:**
- `'error'` to `AuditState` type
- Error message in card footer: "Couldn't reach that URL — double-check it and try again"
- Card header shows actual scanned URL + dynamic current month/year (not hardcoded "Apr 2026")

---

## Deployment & Config

- `functions/api/audit.ts` deploys automatically as a CF Pages Function — no extra Astro or CF config required
- API key stored as CF Pages secret: `PSI_API_KEY` (CF dashboard → Pages project → Settings → Environment Variables)
- Local dev: `.dev.vars` file (gitignored) with `PSI_API_KEY=your_key_here`, run via `wrangler pages dev`
- No changes to `astro.config.mjs`, `content.config.ts`, or any content/landing files

---

## Out of Scope

- Email capture form wiring (already exists as UI, not connected to any backend)
- Meta/Facebook Pixel tracking detection
- Desktop strategy PSI scores (mobile only)
- Caching PSI responses
