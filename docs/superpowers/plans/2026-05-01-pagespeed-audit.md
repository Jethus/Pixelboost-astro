# PageSpeed Insights Audit Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace fake animated scores in the Audit section with real data from the Google PageSpeed Insights API, proxied through a Cloudflare Pages Function.

**Architecture:** A CF Pages Function at `functions/api/audit.ts` receives a URL, calls the PSI API server-side, derives 5 scores, and returns JSON. `Audit.tsx` is updated to fetch from this endpoint, replacing the RAF animation loop with a loading state and real score display.

**Tech Stack:** TypeScript, Cloudflare Pages Functions, Google PageSpeed Insights API v5, React 19

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `functions/api/audit.ts` | Create | CF Pages Function — PSI proxy, score derivation |
| `src/components/Audit.tsx` | Modify | Remove fake scores, add real fetch + error state |
| `.dev.vars` | Create | Local dev secrets (gitignored) |
| `.gitignore` | Modify | Add `.dev.vars` |

---

## Task 1: Scaffold the CF Pages Function with URL validation

**Files:**
- Create: `functions/api/audit.ts`

- [ ] **Step 1: Create the functions directory and stub file**

```bash
mkdir -p functions/api
```

Create `functions/api/audit.ts`:

```typescript
interface Env {
  PSI_API_KEY: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return new Response(JSON.stringify({ error: 'Missing url param' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  let targetUrl: string;
  try {
    const u = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    new URL(u); // throws if invalid
    targetUrl = u;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  return new Response(JSON.stringify({ targetUrl }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};
```

- [ ] **Step 2: Verify the function file exists**

```bash
ls functions/api/audit.ts
```

Expected: file listed.

- [ ] **Step 3: Commit**

```bash
git add functions/api/audit.ts
git commit -m "feat: scaffold CF Pages Function with URL validation"
```

---

## Task 2: Add score derivation helpers

**Files:**
- Modify: `functions/api/audit.ts`

- [ ] **Step 1: Add the score derivation helpers above the handler**

Replace the contents of `functions/api/audit.ts` with:

```typescript
interface Env {
  PSI_API_KEY: string;
}

interface AuditScores {
  perf: number;
  a11y: number;
  seo: number;
  mobile: number;
  tracking: number;
}

const TRACKING_DOMAINS = [
  'google-analytics.com',
  'googletagmanager.com',
  'hotjar.com',
  'plausible.io',
  'usefathom.com',
  'heap.io',
  'mixpanel.com',
  'segment.io',
  'segment.com',
];

function normalizeMobileMetric(value: number, good: number, poor: number): number {
  if (value <= good) return 100;
  if (value >= poor) return 0;
  return Math.round(100 * (1 - (value - good) / (poor - good)));
}

function deriveMobile(audits: Record<string, { numericValue?: number }>): number {
  const fcp = audits['first-contentful-paint']?.numericValue ?? 3000;
  const tbt = audits['total-blocking-time']?.numericValue ?? 600;
  const cls = audits['cumulative-layout-shift']?.numericValue ?? 0.25;

  const fcpScore = normalizeMobileMetric(fcp, 1800, 3000);
  const tbtScore = normalizeMobileMetric(tbt, 200, 600);
  const clsScore = normalizeMobileMetric(cls, 0.1, 0.25);

  return Math.round(fcpScore * 0.3 + tbtScore * 0.4 + clsScore * 0.3);
}

function deriveTracking(audits: Record<string, { details?: { items?: Array<{ entity?: string }> } }>): number {
  const items = audits['third-party-summary']?.details?.items ?? [];
  const found = items.some((item) => {
    const entity = (item.entity ?? '').toLowerCase();
    return TRACKING_DOMAINS.some((domain) => entity.includes(domain));
  });
  return found ? 100 : 0;
}

function psiScore(categories: Record<string, { score: number | null }>, key: string): number {
  return Math.round((categories[key]?.score ?? 0) * 100);
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return new Response(JSON.stringify({ error: 'Missing url param' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  let targetUrl: string;
  try {
    const u = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    new URL(u);
    targetUrl = u;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Placeholder — PSI fetch added in Task 3
  return new Response(JSON.stringify({ targetUrl }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};
```

- [ ] **Step 2: Commit**

```bash
git add functions/api/audit.ts
git commit -m "feat: add score derivation helpers to audit function"
```

---

## Task 3: Wire up the PSI API fetch

**Files:**
- Modify: `functions/api/audit.ts`

- [ ] **Step 1: Replace the placeholder response with the real PSI fetch**

Replace only the handler body from `// Placeholder` onwards with:

```typescript
  const psiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=mobile&key=${env.PSI_API_KEY}`;

  let psiRes: Response;
  try {
    psiRes = await fetch(psiEndpoint);
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to reach PSI API' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  if (!psiRes.ok) {
    return new Response(JSON.stringify({ error: `PSI API error: ${psiRes.status}` }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const data = await psiRes.json() as {
    categories: Record<string, { score: number | null }>;
    audits: Record<string, { numericValue?: number; details?: { items?: Array<{ entity?: string }> } }>;
  };

  const scores: AuditScores = {
    perf:     psiScore(data.categories, 'performance'),
    a11y:     psiScore(data.categories, 'accessibility'),
    seo:      psiScore(data.categories, 'seo'),
    mobile:   deriveMobile(data.audits),
    tracking: deriveTracking(data.audits),
  };

  return new Response(JSON.stringify(scores), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
```

The full final handler should look like:

```typescript
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return new Response(JSON.stringify({ error: 'Missing url param' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  let targetUrl: string;
  try {
    const u = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    new URL(u);
    targetUrl = u;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const psiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=mobile&key=${env.PSI_API_KEY}`;

  let psiRes: Response;
  try {
    psiRes = await fetch(psiEndpoint);
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to reach PSI API' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  if (!psiRes.ok) {
    return new Response(JSON.stringify({ error: `PSI API error: ${psiRes.status}` }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const data = await psiRes.json() as {
    categories: Record<string, { score: number | null }>;
    audits: Record<string, { numericValue?: number; details?: { items?: Array<{ entity?: string }> } }>;
  };

  const scores: AuditScores = {
    perf:     psiScore(data.categories, 'performance'),
    a11y:     psiScore(data.categories, 'accessibility'),
    seo:      psiScore(data.categories, 'seo'),
    mobile:   deriveMobile(data.audits),
    tracking: deriveTracking(data.audits),
  };

  return new Response(JSON.stringify(scores), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};
```

- [ ] **Step 2: Commit**

```bash
git add functions/api/audit.ts
git commit -m "feat: wire PSI API fetch and score derivation in audit function"
```

---

## Task 4: Set up local dev environment

**Files:**
- Create: `.dev.vars`
- Modify: `.gitignore`

- [ ] **Step 1: Add `.dev.vars` to `.gitignore`**

Open `.gitignore` and add this line (create the file if it doesn't exist):

```
.dev.vars
```

- [ ] **Step 2: Create `.dev.vars` with your PSI API key**

Create `.dev.vars` in the project root (get a free key at https://console.cloud.google.com — enable "PageSpeed Insights API"):

```
PSI_API_KEY=your_actual_key_here
```

- [ ] **Step 3: Install wrangler if not present**

```bash
npx wrangler --version
```

If not installed:

```bash
npm install -D wrangler
```

- [ ] **Step 4: Verify the function works locally**

```bash
npx wrangler pages dev ./dist --compatibility-date=2024-01-01
```

This serves the built site + CF functions. In another terminal, build first:

```bash
npm run build
```

Then in a browser or curl:

```bash
curl "http://localhost:8788/api/audit?url=pixelboost.ca"
```

Expected: JSON with `{ perf, a11y, seo, mobile, tracking }` — all integers 0–100.

- [ ] **Step 5: Commit .gitignore change**

```bash
git add .gitignore
git commit -m "chore: ignore .dev.vars local secrets file"
```

---

## Task 5: Update Audit.tsx — state machine and fetch

**Files:**
- Modify: `src/components/Audit.tsx`

- [ ] **Step 1: Replace the top of Audit.tsx**

Replace from the top of the file through the closing `}` of the `Audit` function's state declarations (lines 1–63 approx) with:

```typescript
import { useState } from 'react';

type AuditState = 'idle' | 'scanning' | 'done' | 'error';

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
  const [url, setUrl] = useState('');
  const [state, setState] = useState<AuditState>('idle');
  const [scores, setScores] = useState<Scores>({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0 });
  const [scannedUrl, setScannedUrl] = useState('');
```

- [ ] **Step 2: Replace the handleSubmit function**

Find the existing `handleSubmit` function (around line 91) and replace it with:

```typescript
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || state === 'scanning') return;
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    setScannedUrl(normalized);
    setScores({ perf: 0, a11y: 0, seo: 0, mobile: 0, tracking: 0 });
    setState('scanning');
    try {
      const res = await fetch(`/api/audit?url=${encodeURIComponent(normalized)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Scores = await res.json();
      setScores(data);
      setState('done');
    } catch {
      setState('error');
    }
  };
```

- [ ] **Step 3: Update displayUrl**

Find this line:

```typescript
  const displayUrl = state === 'idle' ? 'yourbusiness.ca' : (url || 'yourbusiness.ca');
```

Replace with:

```typescript
  const showScores = state === 'done';
  const displayUrl = state === 'idle' ? 'yourbusiness.ca' : (scannedUrl || url || 'yourbusiness.ca');
  const headerDate = (() => {
    const now = new Date();
    return now.toLocaleString('en-CA', { month: 'short', year: 'numeric' });
  })();
```

Also remove the existing `const showScores = state !== 'idle';` line (it's now included above).

- [ ] **Step 4: Update the card header date**

Find:

```typescript
            <div>Sample report — {displayUrl} · Apr 2026</div>
```

Replace with:

```typescript
            <div>Site report — {displayUrl} · {headerDate}</div>
```

- [ ] **Step 5: Update the card footer verdict**

Find the verdict footer block (inside `{/* Card footer / verdict */}`):

```typescript
            <p style={{ fontSize: '13.5px', fontWeight: 600, margin: 0 }}>
              {state === 'done'
                ? <>{verdictDone} <strong style={{ color: 'var(--color-mint-700)' }}>5 fixes could save ~1 in 2 visitors.</strong></>
                : state === 'scanning'
                  ? 'Scanning your site…'
                  : <>Verdict → <strong>{verdictIdle}</strong></>
              }
            </p>
```

Replace with:

```typescript
            <p style={{ fontSize: '13.5px', fontWeight: 600, margin: 0 }}>
              {state === 'done'
                ? <>{verdictDone} <strong style={{ color: 'var(--color-mint-700)' }}>5 fixes could save ~1 in 2 visitors.</strong></>
                : state === 'scanning'
                  ? 'Scanning your site…'
                  : state === 'error'
                    ? <span style={{ color: 'var(--color-red)' }}>Couldn't reach that URL — double-check it and try again.</span>
                    : <>Verdict → <strong>{verdictIdle}</strong></>
              }
            </p>
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Audit.tsx
git commit -m "feat: replace fake scan with real PSI API fetch in Audit component"
```

---

## Task 6: End-to-end verification

- [ ] **Step 1: Build the site**

```bash
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 2: Run with wrangler pages dev**

```bash
npx wrangler pages dev ./dist --compatibility-date=2024-01-01
```

- [ ] **Step 3: Test the function endpoint directly**

```bash
curl "http://localhost:8788/api/audit?url=pixelboost.ca"
```

Expected: JSON like `{"perf":72,"a11y":88,"seo":91,"mobile":64,"tracking":0}` — real numbers, all 0–100.

- [ ] **Step 4: Test missing URL param**

```bash
curl "http://localhost:8788/api/audit"
```

Expected: `{"error":"Missing url param"}` with HTTP 400.

- [ ] **Step 5: Test invalid URL**

```bash
curl "http://localhost:8788/api/audit?url=not-a-url!!!"
```

Expected: `{"error":"Invalid URL"}` with HTTP 400. (Note: bare domains like `pixelboost.ca` are valid — the function prepends `https://`.)

- [ ] **Step 6: Test the UI in a browser**

Open `http://localhost:8788`, scroll to the Audit section. Enter a URL and click "Score my site". Verify:
- Button shows "Scanning…" while waiting
- Scores populate with real numbers when done
- Card header shows correct URL and current month/year
- Enter a bad URL (e.g. `not://valid`) — verify error message appears in card footer

---

## Task 7: CF Pages deployment config

- [ ] **Step 1: Add PSI_API_KEY to Cloudflare Pages**

In the Cloudflare dashboard:
1. Go to Pages → your pixelboost project → Settings → Environment Variables
2. Add variable: `PSI_API_KEY` = your Google API key
3. Set for both Production and Preview environments
4. Save

- [ ] **Step 2: Deploy and verify**

Push to your deployment branch:

```bash
git push origin main
```

Once deployed, test the live function:

```bash
curl "https://pixelboost.ca/api/audit?url=pixelboost.ca"
```

Expected: same JSON shape as local test.

- [ ] **Step 3: Smoke test the live UI**

Open `https://pixelboost.ca`, scroll to Audit section, run a scan. Confirm real scores load.
