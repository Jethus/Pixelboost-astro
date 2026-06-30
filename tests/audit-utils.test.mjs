import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildPageSpeedUrl,
  deriveLcp,
  deriveTracking,
  fetchPsiWithRetry,
  getTrackingTools,
  psiScore,
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
