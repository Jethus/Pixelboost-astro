import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

// <title> is what shows in search results; Google cuts it at roughly 60
// characters. Blog posts skip the " | Pixelboost" suffix (BaseLayout noSuffix)
// and landing pages must leave room for it.

const SUFFIX = " | Pixelboost";
const MAX = 60;

test("blog post pages opt out of the title suffix", () => {
  const slug = readFileSync("src/pages/blog/[slug].astro", "utf8");
  assert.match(slug, /<BaseLayout[^>]*\bnoSuffix\b/);
});

test("blog frontmatter titles fit the SERP limit on their own", () => {
  for (const file of readdirSync("src/content/blog")) {
    if (file.startsWith("_") || !/\.mdx?$/.test(file)) continue;
    const src = readFileSync(`src/content/blog/${file}`, "utf8");
    const m = src.match(/^title:\s*"?(.+?)"?\s*$/m);
    assert.ok(m, `${file} has a title`);
    assert.ok(m[1].length <= MAX, `${file} title is ${m[1].length} chars: ${m[1]}`);
  }
});

test("static page titles fit the SERP limit with the suffix", () => {
  for (const file of readdirSync("src/pages")) {
    if (!file.endsWith(".astro") || file === "404.astro") continue;
    const src = readFileSync(`src/pages/${file}`, "utf8");
    const m = src.match(/<BaseLayout[^>]*\btitle=(?:"([^"]+)"|\{([^}]+)\})/);
    if (!m || !m[1]) continue; // index uses the HOME_TITLE constant
    const full = m[1] + SUFFIX;
    assert.ok(full.length <= MAX, `${file}: "${full}" is ${full.length} chars`);
  }
});
