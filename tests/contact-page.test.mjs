import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const contactPage = readFileSync("src/pages/contact.astro", "utf8");

test("contact submit button uses the shared mint interactive button style", () => {
  assert.match(
    contactPage,
    /class="submit-btn btn-mint btn-interactive"/,
    "Contact submit should use the same mint hover variables as other primary buttons",
  );

  const submitBtnCss = contactPage.match(/\.submit-btn\s*\{(?<body>[\s\S]*?)\n  \}/)?.groups?.body ?? "";

  assert.doesNotMatch(
    submitBtnCss,
    /\b(background|color|border|border-radius|padding|font-size|font-weight)\s*:/,
    "submit-btn should only handle contact-form layout, not duplicate the shared button skin",
  );
});

test("contact page can receive a Turnstile sitekey from static env or Worker injection", () => {
  assert.match(contactPage, /PUBLIC_TURNSTILE_SITE_KEY/);
  assert.match(contactPage, /data-turnstile-sitekey/);
  assert.match(contactPage, /data-sitekey=\{turnstileSiteKey\}/);
});
