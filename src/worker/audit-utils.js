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
