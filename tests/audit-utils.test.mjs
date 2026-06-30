import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildPageSpeedUrl,
  deriveLcp,
  deriveTracking,
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
