const PAGE_SPEED_CATEGORIES = ["performance", "accessibility", "seo"];

const TRACKING_TOOLS = [
  { name: "Google Analytics",   patterns: ["google-analytics.com", "googletagmanager.com/gtag", "/gtag/js", "/ga.js", "/analytics.js"] },
  { name: "Google Tag Manager", patterns: ["googletagmanager.com/gtm", "/gtm.js"] },
  { name: "Meta Pixel",         patterns: ["connect.facebook.net", "facebook.com/tr"] },
  { name: "Plausible",          patterns: ["plausible.io"] },
  { name: "Fathom",             patterns: ["usefathom.com"] },
  { name: "Matomo",             patterns: ["/matomo.js", "/matomo.php", "/piwik.js", "/piwik.php"] },
  { name: "PostHog",            patterns: ["posthog.com"] },
  { name: "Hotjar",             patterns: ["hotjar.com"] },
  { name: "Mixpanel",           patterns: ["mixpanel.com"] },
  { name: "Heap",               patterns: ["heap.io"] },
  { name: "Segment",            patterns: ["segment.io", "segment.com"] },
  { name: "LinkedIn Insight",   patterns: ["snap.licdn.com"] },
  { name: "TikTok Pixel",       patterns: ["analytics.tiktok.com"] },
  { name: "Microsoft Ads",      patterns: ["bat.bing.com"] },
  { name: "Pinterest Tag",      patterns: ["ct.pinterest.com"] },
  { name: "Reddit Pixel",       patterns: ["redditstatic.com/ads"] },
];


export function buildPageSpeedUrl(targetUrl, apiKey) {
  const url = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  url.searchParams.set("url", targetUrl);
  url.searchParams.set("strategy", "mobile");
  url.searchParams.set("key", apiKey);

  for (const category of PAGE_SPEED_CATEGORIES) {
    url.searchParams.append("category", category);
  }

  return url.toString();
}

export function psiScore(categories, key) {
  return Math.round((categories[key]?.score ?? 0) * 100);
}

export function deriveLcp(audits) {
  const v = audits["largest-contentful-paint"]?.numericValue;
  return typeof v === "number" ? Math.round(v) : null;
}

// Real-user (CrUX) field data from the PSI response, when the site has enough
// traffic to have any. This is the "top block" of PSI — actual Chrome users
// over a 28-day window — as opposed to the single throttled lab run everything
// else here is derived from. Absent for low-traffic sites (returns null).
export function deriveField(loadingExperience) {
  const metrics = loadingExperience?.metrics;
  const overall = loadingExperience?.overall_category;
  // No metrics, or overall NONE, means CrUX had insufficient data for this URL.
  if (!metrics || !overall || overall === "NONE") return null;

  const lcp = metrics.LARGEST_CONTENTFUL_PAINT_MS;
  const inp = metrics.INTERACTION_TO_NEXT_PAINT;
  const cls = metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE;

  return {
    overall,                                   // FAST | AVERAGE | SLOW
    lcpMs: typeof lcp?.percentile === "number" ? lcp.percentile : null,
    lcpCategory: lcp?.category ?? null,
    // INP percentile is already in ms; CLS percentile is score × 100.
    inpMs: typeof inp?.percentile === "number" ? inp.percentile : null,
    clsCategory: cls?.category ?? null,
  };
}

export function normalizeMobileMetric(value, good, poor) {
  if (value <= good) return 100;
  if (value >= poor) return 0;
  return Math.round(100 * (1 - (value - good) / (poor - good)));
}

export function deriveMobile(audits) {
  const fcp = audits["first-contentful-paint"]?.numericValue ?? 3000;
  const tbt = audits["total-blocking-time"]?.numericValue ?? 600;
  const cls = audits["cumulative-layout-shift"]?.numericValue ?? 0.25;

  const fcpScore = normalizeMobileMetric(fcp, 1800, 3000);
  const tbtScore = normalizeMobileMetric(tbt, 200, 600);
  const clsScore = normalizeMobileMetric(cls, 0.1, 0.25);

  return Math.round(fcpScore * 0.3 + tbtScore * 0.4 + clsScore * 0.3);
}

function collectRequestUrls(audits) {
  const items = audits["network-requests"]?.details?.items ?? [];
  return items
    .map((item) => (typeof item.url === "string" ? item.url.toLowerCase() : ""))
    .join("\n");
}

export function getTrackingTools(audits) {
  const haystack = collectRequestUrls(audits);
  return TRACKING_TOOLS
    .filter((tool) => tool.patterns.some((p) => haystack.includes(p)))
    .map((tool) => tool.name);
}

export function deriveTracking(audits) {
  return getTrackingTools(audits).length > 0 ? 100 : 0;
}

export async function fetchPsiWithRetry(endpoint, fetchImpl = fetch, opts = {}) {
  const retries = opts.retries ?? 2;
  const backoffsMs = opts.backoffsMs ?? [500, 1500];
  const sleep = opts.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));

  let lastResponse;
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      await sleep(backoffsMs[attempt - 1] ?? backoffsMs[backoffsMs.length - 1]);
    }
    try {
      const res = await fetchImpl(endpoint);
      if (res.status < 500) return res; // 2xx/3xx/4xx are final
      lastResponse = res;               // 5xx → retry
    } catch (err) {
      lastError = err;                  // network throw → retry
    }
  }
  if (lastResponse) return lastResponse;
  throw lastError;
}

// Full PSI scan for one URL → the scores object shared by the audit endpoint
// and the contact-form background scan. Error messages are part of the
// /api/audit response contract — don't reword them.
export async function runScan(targetUrl, apiKey, fetchImpl = fetch, retryOpts = {}) {
  const endpoint = buildPageSpeedUrl(targetUrl, apiKey);

  let res;
  try {
    res = await fetchPsiWithRetry(endpoint, fetchImpl, retryOpts);
  } catch {
    throw new Error("Failed to reach PSI API");
  }
  if (!res.ok) {
    throw new Error(`PSI API error: ${res.status}`);
  }

  const data = await res.json();
  const { categories, audits } = data.lighthouseResult;

  return {
    perf: psiScore(categories, "performance"),
    a11y: psiScore(categories, "accessibility"),
    seo: psiScore(categories, "seo"),
    mobile: deriveMobile(audits),
    tracking: deriveTracking(audits),
    trackingTools: getTrackingTools(audits),
    lcp: deriveLcp(audits),
    // Real-user CrUX data (null when the site has too little traffic). The
    // scores above are a single lab run; this is what actual visitors get.
    field: deriveField(data.loadingExperience),
  };
}
