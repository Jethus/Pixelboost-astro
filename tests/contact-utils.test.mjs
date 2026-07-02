import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildContactEmail,
  buildContactScanEmail,
  getContactRedirect,
  validateTurnstileToken,
  validateContactSubmission,
} from "../src/worker/contact-utils.js";

test("validateContactSubmission accepts a complete contact submission", () => {
  const formData = new FormData();
  formData.set("name", "Jane Smith");
  formData.set("email", "jane@example.com");
  formData.set("website", "example.com");
  formData.set("message", "I need help with a website redesign.");

  assert.deepEqual(validateContactSubmission(formData), {
    ok: true,
    value: {
      name: "Jane Smith",
      email: "jane@example.com",
      website: "example.com",
      message: "I need help with a website redesign.",
    },
  });
});

test("validateContactSubmission rejects missing required fields", () => {
  const formData = new FormData();
  formData.set("name", "Jane Smith");
  formData.set("email", "jane@example.com");

  assert.deepEqual(validateContactSubmission(formData), {
    ok: false,
    error: "Please fill out your name, email, and message.",
  });
});

test("validateContactSubmission rejects invalid email addresses", () => {
  const formData = new FormData();
  formData.set("name", "Jane Smith");
  formData.set("email", "not-an-email");
  formData.set("message", "I need help with a website redesign.");

  assert.deepEqual(validateContactSubmission(formData), {
    ok: false,
    error: "Please enter a valid email address.",
  });
});

test("buildContactEmail creates a plain text email for the site owner", () => {
  const email = buildContactEmail({
    name: "Jane Smith",
    email: "jane@example.com",
    website: "example.com",
    message: "I need help with a website redesign.",
  });

  assert.equal(email.from, "Pixelboost Website <hello@pixelboost.ca>");
  assert.equal(email.to, "hello@pixelboost.ca");
  assert.equal(email.replyTo, "jane@example.com");
  assert.equal(email.subject, "New Pixelboost contact form submission from Jane Smith");
  assert.match(email.raw, /From: Pixelboost Website <hello@pixelboost\.ca>/);
  assert.match(email.raw, /Reply-To: Jane Smith <jane@example\.com>/);
  assert.match(email.raw, /Website: example\.com/);
  assert.match(email.raw, /I need help with a website redesign\./);
});

test("buildContactScanEmail notifies Josh only, with lead context and scores", () => {
  const email = buildContactScanEmail(
    { name: "Jane Smith", email: "jane@example.com", website: "example.com", message: "Help!" },
    "https://example.com",
    { perf: 42, mobile: 55, seo: 80, a11y: 70, tracking: 100, trackingTools: ["Plausible"], lcp: 4000 },
  );

  assert.equal(email.from, "Josh from Pixelboost <josh@pixelboost.ca>");
  assert.equal(email.to, "josh@pixelboost.ca");
  assert.equal(email.replyTo, "jane@example.com");
  assert.equal(email.subject, "Contact lead site scan: example.com");
  assert.match(email.text, /Jane Smith \(jane@example\.com\) submitted the contact form/);
  assert.match(email.text, /Scanned URL: https:\/\/example\.com/);
  assert.match(email.text, /- Speed: 42/);
  assert.match(email.text, /- Lead tracking: Yes, Plausible/);
  assert.match(email.text, /Verdict: /);
});

test("buildContactScanEmail strips CRLF from header-bound values", () => {
  const email = buildContactScanEmail(
    { name: "Jane\r\nBcc: evil@example.com", email: "jane@example.com\r\nX-Evil: 1", website: "x", message: "" },
    "not a url\r\nBcc: evil@example.com",
    { perf: 0, mobile: 0, seo: 0, a11y: 0, tracking: 0, trackingTools: [], lcp: null },
  );

  assert.doesNotMatch(email.subject, /[\r\n]/);
  assert.doesNotMatch(email.replyTo, /[\r\n]/);
  assert.doesNotMatch(email.text.split("\n")[0], /\r/);
});

test("getContactRedirect preserves the submitting origin", () => {
  assert.equal(
    getContactRedirect("https://pixelboost.ca/contact", "sent"),
    "https://pixelboost.ca/contact?sent=1",
  );
  assert.equal(
    getContactRedirect("https://pixelboost.ca/contact", "error"),
    "https://pixelboost.ca/contact?error=1",
  );
});

test("validateTurnstileToken posts the token and visitor IP to Siteverify", async () => {
  const calls = [];
  const result = await validateTurnstileToken({
    token: "turnstile-token",
    secret: "turnstile-secret",
    remoteIp: "203.0.113.7",
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return Response.json({ success: true });
    },
  });

  assert.equal(result, true);
  assert.equal(calls[0].url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
  assert.equal(calls[0].init.method, "POST");
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    secret: "turnstile-secret",
    response: "turnstile-token",
    remoteip: "203.0.113.7",
  });
});

test("validateTurnstileToken rejects missing tokens", async () => {
  const result = await validateTurnstileToken({
    token: "",
    secret: "turnstile-secret",
    remoteIp: "203.0.113.7",
    fetchImpl: async () => {
      throw new Error("fetch should not be called");
    },
  });

  assert.equal(result, false);
});

test("validateTurnstileToken rejects failed Siteverify responses", async () => {
  const result = await validateTurnstileToken({
    token: "turnstile-token",
    secret: "turnstile-secret",
    remoteIp: "203.0.113.7",
    fetchImpl: async () => Response.json({ success: false }),
  });

  assert.equal(result, false);
});
