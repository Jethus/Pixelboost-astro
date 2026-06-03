import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const auditComponent = readFileSync("src/components/Audit.astro", "utf8");

test("audit island does not hydrate during initial page load", () => {
  assert.doesNotMatch(
    auditComponent,
    /client:load/,
    "Audit pulls React into the critical path when it hydrates with client:load",
  );
  assert.match(
    auditComponent,
    /client:visible/,
    "Audit should hydrate when it nears the viewport",
  );
});
