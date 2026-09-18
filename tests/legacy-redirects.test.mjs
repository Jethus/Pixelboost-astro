import assert from "node:assert/strict";
import { test } from "node:test";

import worker, { LEGACY_REDIRECTS } from "../src/worker/index.js";

// Retired URLs still surface in Search Console (e.g. /case-studies/ at pos ~3).
// They must 301 somewhere real instead of 404ing, with or without the slash.

const env = { ASSETS: { fetch: async () => new Response("asset", { status: 200 }) } };

async function get(path) {
  return worker.fetch(new Request(`https://pixelboost.ca${path}`), env, {});
}

test("every legacy path 301s to its replacement", async () => {
  for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
    for (const path of [from, `${from}/`]) {
      const res = await get(path);
      assert.equal(res.status, 301, `${path} should 301`);
      assert.equal(res.headers.get("Location"), `https://pixelboost.ca${to}`);
    }
  }
});

test("live paths are not touched by the legacy map", async () => {
  const res = await get("/about");
  assert.equal(res.status, 200);
});
