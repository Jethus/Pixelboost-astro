import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const SHARED_COMPONENTS = [
  "src/components/Header.astro",
  "src/components/Footer.astro",
];

test("shared raw image elements declare intrinsic dimensions", () => {
  for (const file of SHARED_COMPONENTS) {
    const source = readFileSync(file, "utf8");
    const imageTags = source.match(/<img\b[^>]*>/g) ?? [];

    for (const tag of imageTags) {
      assert.match(tag, /\bwidth=/, `${file} has an image without width: ${tag}`);
      assert.match(tag, /\bheight=/, `${file} has an image without height: ${tag}`);
    }
  }
});
