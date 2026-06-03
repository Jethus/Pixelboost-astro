const PAGE_SPEED_CATEGORIES = ["performance", "accessibility", "seo"];

const ANALYTICS_MATCHERS = [
  "google analytics",
  "google-analytics.com",
  "googletagmanager.com/gtag",
  "ga.js",
  "analytics.js",
  "plausible",
  "plausible.io",
  "fathom",
  "usefathom.com",
  "heap",
  "heap.io",
  "mixpanel",
  "mixpanel.com",
  "segment",
  "segment.io",
  "segment.com",
  "matomo",
  "matomo.org",
  "posthog",
  "posthog.com",
];

const TAG_MANAGER_MATCHERS = [
  "google tag manager",
  "googletagmanager.com/gtm",
  "gtm.js",
  "tealium",
  "tealiumiq",
  "adobe launch",
  "assets.adobedtm.com",
];

const CONVERSION_PIXEL_MATCHERS = [
  "meta pixel",
  "facebook pixel",
  "connect.facebook.net",
  "facebook.com/tr",
  "google ads",
  "googleadservices.com",
  "doubleclick.net",
  "linkedin insight",
  "snap pixel",
  "tiktok pixel",
  "analytics.tiktok.com",
  "bat.bing.com",
  "microsoft advertising",
  "pinterest tag",
  "ct.pinterest.com",
  "twitter ads",
  "static.ads-twitter.com",
  "reddit pixel",
];

const FORM_OR_CTA_MATCHERS = [
  "form",
  "button",
  "contact",
  "book",
  "quote",
  "call",
  "cta",
  "submit",
  "lead",
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

export function getTrackingSignals(audits) {
  const thirdPartyText = collectAuditItemText(audits["third-party-summary"]);
  const domText = collectAuditItemText(audits["dom-size"]);

  const analyticsInstalled = includesAny(thirdPartyText, ANALYTICS_MATCHERS);
  const tagManagerInstalled = includesAny(thirdPartyText, TAG_MANAGER_MATCHERS);
  const conversionPixelInstalled = includesAny(thirdPartyText, CONVERSION_PIXEL_MATCHERS);
  const clickableLeadLinksPresent =
    domText.includes("tel:") ||
    domText.includes("mailto:") ||
    domText.includes("phone") ||
    domText.includes("email");
  const formOrCtaPresent = includesAny(domText, FORM_OR_CTA_MATCHERS);

  return {
    analyticsInstalled,
    tagManagerInstalled,
    conversionPixelInstalled,
    clickableLeadLinksPresent,
    formOrCtaPresent,
  };
}

export function deriveTracking(audits) {
  const signals = getTrackingSignals(audits);
  return Object.values(signals).some(Boolean) ? 100 : 0;
}

function collectAuditItemText(audit) {
  const items = audit?.details?.items ?? [];
  return items.map((item) => Object.values(item).join(" ")).join(" ").toLowerCase();
}

function includesAny(value, matchers) {
  return matchers.some((matcher) => value.includes(matcher));
}
