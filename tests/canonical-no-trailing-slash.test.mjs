import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// Canonical URLs are slash-free (/about, not /about/). Three pieces must agree
// or Google sees duplicate URLs and splits ranking signal between them:
//   1. Astro emits slash-free canonical tags + sitemap  (trailingSlash: never)
//   2. Cloudflare Assets serves the bare path + redirects the slash form
//   3. The worker upgrades that redirect from a temporary 307 to permanent 308
// See the 2026-07 Search Console duplicate-URL fix.

const astroConfig = readFileSync("astro.config.mjs", "utf8");
const wranglerToml = readFileSync("wrangler.toml", "utf8");
const worker = readFileSync("src/worker/index.js", "utf8");

test("astro is configured for slash-free canonical URLs", () => {
  assert.match(astroConfig, /trailingSlash:\s*["']never["']/);
  // build.format "file" would append .html to canonical URLs — must stay off.
  assert.doesNotMatch(astroConfig, /format:\s*["']file["']/);
});

test("cloudflare assets drops the trailing slash", () => {
  assert.match(wranglerToml, /html_handling\s*=\s*"drop-trailing-slash"/);
});

test("worker upgrades the slash-drop redirect to a permanent 308", () => {
  assert.match(worker, /response\.status === 307/);
  assert.match(worker, /\b308\b/);
});
