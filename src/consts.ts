// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

// Home page <title> — geo-first for local SEO (primary keyword up front).
export const HOME_TITLE = "Web Design & Development in Toronto & Durham | Pixelboost";
// Short brand suffix appended to every OTHER page: "{Page title} | Pixelboost".
// Kept short so inner-page titles don't overflow the ~60-char SERP limit.
export const SITE_NAME = "Pixelboost";
// Back-compat alias: some layout logic compares against SITE_TITLE to detect
// the home page. Points at HOME_TITLE.
export const SITE_TITLE = HOME_TITLE;
export const SITE_DESCRIPTION =
  "Custom website design and redesign for small businesses in Toronto and Durham Region. Faster, cleaner sites that turn visitors into leads. Free site scan, no email required.";

// Recent site scans shown in the hero "Recently scanned" strip.
// PLACEHOLDER DATA — swap each entry for a real (anonymized) scan before
// this goes live: business type + town, and the mobile performance score
// from PageSpeed Insights / the audit tool. Keep 3–5 entries.
export const RECENT_SCANS: { label: string; score: number }[] = [
  { label: "Landscaper, Ajax", score: 38 },
  { label: "Dental clinic, Whitby", score: 52 },
  { label: "Café, Oshawa", score: 44 },
  { label: "Auto shop, Pickering", score: 41 },
];
