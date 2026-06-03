import assert from "node:assert/strict";
import { test } from "node:test";

import { buildPageSpeedUrl, psiScore } from "../src/worker/audit-utils.js";

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
