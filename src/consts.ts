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

// Aggregate results from scanning real local small-business websites across
// Toronto, Oshawa, and Whitby (July 2026). These are genuine figures — refresh
// them from a new scan run rather than fabricating. The hero shows them as the
// backdrop to "every site I build ships at 95+".
export interface ScanStat {
  value: string; // the number, e.g. "89%"
  label: string; // what it measures, e.g. "score under 90 on mobile"
}

export const SCAN_SAMPLE_SIZE = 476;

export const SCAN_STATS: ScanStat[] = [
  { value: "1 in 3", label: "score under 50 on mobile" },
  { value: "60", label: "average mobile score, out of 100" },
  { value: "34%", label: "have no analytics at all" },
];
