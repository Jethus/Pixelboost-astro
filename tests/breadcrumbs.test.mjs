import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// BreadcrumbList JSON-LD is emitted by BaseLayout for every page except the
// homepage (it would be a one-item trail) and the 404 (not a real page).
// Search Console reports it under Enhancements > Breadcrumbs.

test("BaseLayout emits BreadcrumbList JSON-LD", () => {
  const layout = readFileSync("src/layouts/BaseLayout.astro", "utf8");
  assert.match(layout, /"@type": "BreadcrumbList"/);
  assert.match(layout, /set:html=\{JSON\.stringify\(breadcrumbLd\)\}/);
});

test("404 opts out of breadcrumbs", () => {
  const notFound = readFileSync("src/pages/404.astro", "utf8");
  assert.match(notFound, /breadcrumbs=\{false\}/);
});

test("blog posts nest under Blog in the breadcrumb trail", () => {
  const slug = readFileSync("src/pages/blog/[slug].astro", "utf8");
  assert.match(slug, /breadcrumbs=\{\[\s*\{ name: "Blog", path: "\/blog" \}/);
});
