import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const layout = readFileSync("src/layouts/BaseLayout.astro", "utf8");
const globalCss = readFileSync("src/styles/global.css", "utf8");

test("fonts are self-hosted instead of loaded from Google Fonts", () => {
  assert.doesNotMatch(
    layout,
    /fonts\.(googleapis|gstatic)\.com/,
    "Base layout should not create Google Fonts network dependencies",
  );
  assert.match(
    globalCss,
    /@fontsource-variable\/plus-jakarta-sans\/files\/plus-jakarta-sans-latin-wght-normal\.woff2/,
    "Plus Jakarta Sans should be loaded from the local Fontsource package",
  );
});
