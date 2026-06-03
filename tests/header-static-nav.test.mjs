import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const header = readFileSync("src/components/Header.astro", "utf8");

test("header does not change nav styling on scroll", () => {
  assert.doesNotMatch(header, /\.scrolled\b/);
  assert.doesNotMatch(header, /addEventListener\('scroll'/);
  assert.doesNotMatch(header, /window\.scrollY/);
});
