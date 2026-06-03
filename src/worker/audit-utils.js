const PAGE_SPEED_CATEGORIES = ["performance", "accessibility", "seo"];

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
