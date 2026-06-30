import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildPageSpeedUrl,
  deriveLcp,
  deriveTracking,
  getTrackingSignals,
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

test("getTrackingSignals detects analytics, tag managers, and conversion pixels from Lighthouse third parties", () => {
  const signals = getTrackingSignals({
    "third-party-summary": {
      details: {
        items: [
          { entity: "Google Analytics" },
          { entity: "Google Tag Manager" },
          { entity: "Meta Pixel" },
        ],
      },
    },
  });

  assert.deepEqual(signals, {
    analyticsInstalled: true,
    tagManagerInstalled: true,
    conversionPixelInstalled: true,
    clickableLeadLinksPresent: false,
    formOrCtaPresent: false,
  });
});

test("getTrackingSignals detects phone links, email links, forms, and CTA links from DOM stats", () => {
  const signals = getTrackingSignals({
    "dom-size": {
      details: {
        items: [
          { selector: 'a[href^="tel:"]' },
          { selector: 'a[href^="mailto:"]' },
          { selector: "form.contact-form" },
          { selector: 'a[href="/contact"]' },
        ],
      },
    },
  });

  assert.deepEqual(signals, {
    analyticsInstalled: false,
    tagManagerInstalled: false,
    conversionPixelInstalled: false,
    clickableLeadLinksPresent: true,
    formOrCtaPresent: true,
  });
});

test("deriveTracking returns yes when any lead tracking signal is present", () => {
  assert.equal(deriveTracking({
    "third-party-summary": {
      details: {
        items: [{ entity: "plausible.io" }],
      },
    },
  }), 100);
});

test("deriveTracking returns no when no lead tracking signals are present", () => {
  assert.equal(deriveTracking({
    "third-party-summary": {
      details: {
        items: [{ entity: "Bootstrap CDN" }],
      },
    },
  }), 0);
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
