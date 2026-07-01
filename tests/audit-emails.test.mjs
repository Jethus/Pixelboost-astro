import assert from "node:assert/strict";
import { test } from "node:test";
import { buildProspectReportEmail, buildLeadNotificationEmail } from "../src/worker/contact-utils.js";

const scores = { perf: 52, mobile: 56, seo: 85, a11y: 77, tracking: 100, trackingTools: ["Google Tag Manager"], lcp: 6200 };

test("prospect report is addressed to the prospect and contains scores + verdict", () => {
  const m = buildProspectReportEmail("owner@shop.ca", "https://shop.ca", scores);
  assert.equal(m.to, "owner@shop.ca");
  assert.match(m.subject, /shop\.ca/);
  assert.match(m.text, /Speed/);
  assert.match(m.text, /Loads in 6\.2s on mobile/);     // verdict text (perf worst + lcp)
  assert.match(m.text, /Google Tag Manager/);           // verdict cta names the tool
  assert.ok(!m.replyTo);                                 // prospect email has no replyTo by design
});

test("lead notification goes to the owner and includes the prospect email + replyTo when present", () => {
  const m = buildLeadNotificationEmail("owner@shop.ca", "https://shop.ca", scores);
  assert.match(m.text, /owner@shop\.ca/);
  assert.match(m.text, /shop\.ca/);
  assert.equal(m.replyTo, "owner@shop.ca");
});

test("lead notification marks anonymous when no email given and sets no replyTo", () => {
  const m = buildLeadNotificationEmail("", "https://shop.ca", scores);
  assert.match(m.text, /anonymous/i);
  assert.ok(!m.replyTo); // undefined or empty — no prospect reply-to
});
