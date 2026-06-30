import assert from "node:assert/strict";
import { test } from "node:test";
import { verdictFromScores } from "../src/shared/verdict.js";

const base = { perf: 100, mobile: 100, seo: 100, a11y: 100, tracking: 0, lcp: null, trackingTools: [] };

test("perf worst + bad + lcp → load-time verdict line", () => {
  const v = verdictFromScores({ ...base, perf: 52, mobile: 56, seo: 85, a11y: 77, lcp: 6200 });
  assert.match(v.text, /^Loads in 6\.2s on mobile/);
  assert.match(v.cta, /No analytics detected/);
});

test("seo worst at 80 → mid line, not all-good", () => {
  const v = verdictFromScores({ ...base, seo: 80, a11y: 96 });
  assert.equal(v.text, "Search basics are mostly there, with a few gaps holding back your ranking.");
});

test("all >= 90 → strong scores, names biggest opportunity", () => {
  const v = verdictFromScores({ ...base, perf: 98 });
  assert.equal(v.text, "Strong scores. Biggest opportunity: Speed.");
});

test("tracking present names the tool in cta", () => {
  const v = verdictFromScores({ ...base, perf: 50, tracking: 100, trackingTools: ["Google Tag Manager"] });
  assert.match(v.cta, /You're running Google Tag Manager/);
});
