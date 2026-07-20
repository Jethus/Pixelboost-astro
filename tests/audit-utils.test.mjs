import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildPageSpeedUrl,
  deriveField,
  deriveLcp,
  deriveMobile,
  deriveTracking,
  fetchPsiWithRetry,
  getTrackingTools,
  normalizeMobileMetric,
  psiScore,
  runScan,
} from "../src/worker/audit-utils.js";

test("buildPageSpeedUrl requests every score category shown in the audit UI", () => {
  const url = new URL(buildPageSpeedUrl("https://pixelboost.ca", "api-key"));

  assert.equal(url.origin + url.pathname, "https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  assert.equal(url.searchParams.get("url"), "https://pixelboost.ca");
  assert.equal(url.searchParams.get("strategy"), "mobile");
  assert.equal(url.searchParams.get("key"), "api-key");
  assert.deepEqual(url.searchParams.getAll("category"), [
    "performance",
    "accessibility",
    "seo",
  ]);
});

test("psiScore converts available category scores to whole percentages", () => {
  assert.equal(psiScore({ seo: { score: 0.92 } }, "seo"), 92);
});

test("psiScore leaves missing category scores at zero", () => {
  assert.equal(psiScore({}, "seo"), 0);
});

function networkAudit(urls) {
  return { "network-requests": { details: { items: urls.map((url) => ({ url })) } } };
}

test("getTrackingTools detects Google Tag Manager from a request URL", () => {
  const tools = getTrackingTools(networkAudit([
    "https://www.googletagmanager.com/gtm.js?id=GTM-ABC123",
    "https://example.com/style.css",
  ]));
  assert.deepEqual(tools, ["Google Tag Manager"]);
});

test("getTrackingTools detects multiple distinct tools, deduped and in catalogue order", () => {
  const tools = getTrackingTools(networkAudit([
    "https://connect.facebook.net/en_US/fbevents.js",
    "https://www.google-analytics.com/analytics.js",
    "https://www.google-analytics.com/collect",
    "https://plausible.io/js/script.js",
  ]));
  assert.deepEqual(tools, ["Google Analytics", "Meta Pixel", "Plausible"]);
});

test("getTrackingTools returns empty when no tracking requests present", () => {
  assert.deepEqual(getTrackingTools(networkAudit([
    "https://example.com/app.js",
    "https://cdn.jsdelivr.net/bootstrap.css",
  ])), []);
});

test("deriveTracking returns 100 when a tool is found, 0 otherwise", () => {
  assert.equal(deriveTracking(networkAudit(["https://plausible.io/js/script.js"])), 100);
  assert.equal(deriveTracking(networkAudit(["https://example.com/app.js"])), 0);
});

test("deriveLcp returns rounded LCP milliseconds from the Lighthouse audit", () => {
  assert.equal(
    deriveLcp({ "largest-contentful-paint": { numericValue: 6234.7 } }),
    6235,
  );
});

test("deriveLcp returns null when LCP audit is missing", () => {
  assert.equal(deriveLcp({}), null);
  assert.equal(deriveLcp({ "largest-contentful-paint": {} }), null);
});

// Build a fake fetch that returns a queued sequence of outcomes.
// Each item is either { status } (resolves to a Response-like) or { throw: true }.
function fakeFetch(sequence) {
  let i = 0;
  const calls = { count: 0 };
  const fn = async () => {
    calls.count++;
    const item = sequence[Math.min(i, sequence.length - 1)];
    i++;
    if (item.throw) throw new Error("network");
    return { status: item.status, ok: item.status >= 200 && item.status < 300 };
  };
  return { fn, calls };
}
const noSleep = () => Promise.resolve();
const opts = { sleep: noSleep };

test("fetchPsiWithRetry returns immediately on first success", async () => {
  const { fn, calls } = fakeFetch([{ status: 200 }]);
  const res = await fetchPsiWithRetry("u", fn, opts);
  assert.equal(res.status, 200);
  assert.equal(calls.count, 1);
});

test("fetchPsiWithRetry retries on 502 then succeeds", async () => {
  const { fn, calls } = fakeFetch([{ status: 502 }, { status: 200 }]);
  const res = await fetchPsiWithRetry("u", fn, opts);
  assert.equal(res.status, 200);
  assert.equal(calls.count, 2);
});

test("fetchPsiWithRetry gives up after 3 attempts of 5xx, returns last 5xx", async () => {
  const { fn, calls } = fakeFetch([{ status: 500 }, { status: 502 }, { status: 503 }]);
  const res = await fetchPsiWithRetry("u", fn, opts);
  assert.equal(res.status, 503);
  assert.equal(calls.count, 3);
});

test("fetchPsiWithRetry does NOT retry on 4xx", async () => {
  const { fn, calls } = fakeFetch([{ status: 400 }, { status: 200 }]);
  const res = await fetchPsiWithRetry("u", fn, opts);
  assert.equal(res.status, 400);
  assert.equal(calls.count, 1);
});

test("fetchPsiWithRetry retries on network throw then succeeds", async () => {
  const { fn, calls } = fakeFetch([{ throw: true }, { status: 200 }]);
  const res = await fetchPsiWithRetry("u", fn, opts);
  assert.equal(res.status, 200);
  assert.equal(calls.count, 2);
});

test("fetchPsiWithRetry throws last error if all attempts throw", async () => {
  const { fn, calls } = fakeFetch([{ throw: true }, { throw: true }, { throw: true }]);
  await assert.rejects(() => fetchPsiWithRetry("u", fn, opts), /network/);
  assert.equal(calls.count, 3);
});

test("normalizeMobileMetric maps good/poor thresholds to 100/0 and midpoints linearly", () => {
  assert.equal(normalizeMobileMetric(1800, 1800, 3000), 100);
  assert.equal(normalizeMobileMetric(1500, 1800, 3000), 100);
  assert.equal(normalizeMobileMetric(3000, 1800, 3000), 0);
  assert.equal(normalizeMobileMetric(3500, 1800, 3000), 0);
  assert.equal(normalizeMobileMetric(2400, 1800, 3000), 50);
});

test("deriveMobile weights FCP/TBT/CLS 30/40/30", () => {
  // All metrics at their "good" thresholds → perfect score.
  assert.equal(deriveMobile({
    "first-contentful-paint": { numericValue: 1800 },
    "total-blocking-time": { numericValue: 200 },
    "cumulative-layout-shift": { numericValue: 0.1 },
  }), 100);
  // All at midpoints → 50.
  assert.equal(deriveMobile({
    "first-contentful-paint": { numericValue: 2400 },
    "total-blocking-time": { numericValue: 400 },
    "cumulative-layout-shift": { numericValue: 0.175 },
  }), 50);
});

test("deriveMobile falls back to poor-threshold defaults when audits are missing", () => {
  assert.equal(deriveMobile({}), 0);
});

const psiFixture = {
  lighthouseResult: {
    categories: {
      performance: { score: 0.9 },
      accessibility: { score: 0.8 },
      seo: { score: 1 },
    },
    audits: {
      "largest-contentful-paint": { numericValue: 2500.4 },
      "first-contentful-paint": { numericValue: 1800 },
      "total-blocking-time": { numericValue: 200 },
      "cumulative-layout-shift": { numericValue: 0.1 },
      "network-requests": { details: { items: [{ url: "https://plausible.io/js/script.js" }] } },
    },
  },
};

test("runScan returns the full scores shape from a PSI response", async () => {
  const fetchImpl = async () => ({ ok: true, status: 200, json: async () => psiFixture });
  assert.deepEqual(await runScan("https://example.com", "api-key", fetchImpl), {
    perf: 90,
    a11y: 80,
    seo: 100,
    mobile: 100,
    tracking: 100,
    trackingTools: ["Plausible"],
    lcp: 2500,
    field: null,
  });
});

test("deriveField returns null when CrUX data is absent or NONE", () => {
  assert.equal(deriveField(undefined), null);
  assert.equal(deriveField({ overall_category: "NONE", metrics: {} }), null);
  assert.equal(deriveField({ metrics: { LARGEST_CONTENTFUL_PAINT_MS: { percentile: 2000 } } }), null);
});

test("deriveField extracts real-user metrics when present", () => {
  const field = deriveField({
    overall_category: "AVERAGE",
    metrics: {
      LARGEST_CONTENTFUL_PAINT_MS: { percentile: 3100, category: "AVERAGE" },
      INTERACTION_TO_NEXT_PAINT: { percentile: 180, category: "FAST" },
      CUMULATIVE_LAYOUT_SHIFT_SCORE: { percentile: 5, category: "FAST" },
    },
  });
  assert.deepEqual(field, {
    overall: "AVERAGE",
    lcpMs: 3100,
    lcpCategory: "AVERAGE",
    inpMs: 180,
    clsCategory: "FAST",
  });
});

test("runScan rejects with the PSI status on a non-ok response", async () => {
  const fetchImpl = async () => ({ ok: false, status: 403 });
  await assert.rejects(() => runScan("https://example.com", "api-key", fetchImpl), /PSI API error: 403/);
});

test("runScan rejects with the reach error when every fetch attempt throws", async () => {
  const fetchImpl = async () => { throw new Error("network"); };
  await assert.rejects(
    () => runScan("https://example.com", "api-key", fetchImpl, opts),
    /Failed to reach PSI API/,
  );
});
