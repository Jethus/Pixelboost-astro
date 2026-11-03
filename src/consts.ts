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
  "Website design and redesign for small businesses in Toronto and Durham Region. Faster sites that turn visitors into leads. Free site scan, no email required.";

// Aggregate results from scanning real local small-business websites across
// Toronto, Oshawa, and Whitby (July 2026). These are genuine figures — refresh
// them from a new scan run rather than fabricating. The hero shows them as the
// backdrop to "every site I build ships at 95+".
//
// The hero compares ONE metric on ONE scale (Google mobile score out of 100):
// the local average vs. mine, as two bars. The other findings are supporting
// facts in a sentence, so the strip reads at a glance instead of mixing units.
export const SCAN_RESULTS = {
  sampleSize: 476,
  avgMobileScore: 60, // average Google mobile score, out of 100
  under50: "1 in 3", // share scoring under 50 on mobile
  noAnalytics: "34%", // share with no analytics at all
};

/** What every site I build ships at (Google mobile score, out of 100). */
export const MY_MOBILE_SCORE = 95;
