import { verdictFromScores } from "../shared/verdict.js";

// TODO: back to hello@pixelboost.ca once it's a real (verified) inbox.
const CONTACT_EMAIL = "josh@pixelboost.ca";
// All email sends via Fastmail JMAP, which requires the From address to be a
// VERIFIED sending identity on the account. hello@pixelboost.ca is NOT one (only
// josh@pixelboost.ca is) — sending from an unverified identity is rejected with
// `forbiddenFrom`. The display names differ so contact leads and audit results
// are distinguishable in the inbox.
const FROM_EMAIL = "Pixelboost Website <josh@pixelboost.ca>";
const AUDIT_FROM_EMAIL = "Josh from Pixelboost <josh@pixelboost.ca>";
// Audit lead notifications (including anonymous scans) go to josh@ directly,
// not the shared hello@ inbox — the contact form still uses CONTACT_EMAIL (hello@).
const LEAD_NOTIFY_TO = "josh@pixelboost.ca";

function formValue(formData, key) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function stripHeaderValue(value) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function encodeHeader(value) {
  return stripHeaderValue(value).replace(/[<>]/g, "");
}

export function validateContactSubmission(formData) {
  const submission = {
    name: formValue(formData, "name"),
    email: formValue(formData, "email"),
    website: formValue(formData, "website"),
    message: formValue(formData, "message"),
  };

  if (!submission.name || !submission.email || !submission.message) {
    return {
      ok: false,
      error: "Please fill out your name, email, and message.",
    };
  }

  if (!isValidEmail(submission.email)) {
    return {
      ok: false,
      error: "Please enter a valid email address.",
    };
  }

  return { ok: true, value: submission };
}

export function buildContactEmail(submission) {
  const safeName = encodeHeader(submission.name);
  const subject = `New Pixelboost contact form submission from ${safeName}`;
  const text = [
    "New contact form submission from pixelboost.ca",
    "",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Website: ${submission.website || "Not provided"}`,
    "",
    "Message:",
    submission.message,
  ].join("\n");

  return {
    from: FROM_EMAIL,
    to: CONTACT_EMAIL,
    replyTo: stripHeaderValue(submission.email),
    subject,
    text,
  };
}

function trackingLine(scores) {
  if (scores.tracking > 0 && scores.trackingTools?.length > 0) {
    return `Yes, ${scores.trackingTools.join(', ')}`;
  }
  return 'No';
}

function scoreLines(scores) {
  return [
    `- Speed: ${scores.perf ?? 'n/a'}`,
    `- Mobile: ${scores.mobile ?? 'n/a'}`,
    `- SEO: ${scores.seo ?? 'n/a'}`,
    `- Accessibility: ${scores.a11y ?? 'n/a'}`,
    `- Lead tracking: ${trackingLine(scores)}`,
  ];
}

// Bare host for display: "https://example.com/path" -> "example.com".
// Falls back to the sanitized input if it isn't a parseable URL.
function siteHost(siteUrl) {
  try {
    return new URL(siteUrl).host;
  } catch {
    return stripHeaderValue(siteUrl);
  }
}

export function buildProspectReportEmail(email, siteUrl, scores) {
  const to = stripHeaderValue(email);
  const host = siteHost(siteUrl);
  const subject = `Your site report: ${host}`;
  const verdict = verdictFromScores(scores);

  const text = [
    `Here's how ${host} did when I scanned it:`,
    '',
    ...scoreLines(scores),
    '',
    verdict.text,
    verdict.cta,
    '',
    "If you'd like, reply to this email or book a call and I'll walk you through the quickest wins:",
    'https://pixelboost.ca/contact',
    '',
    'Josh, Pixelboost',
  ].join('\n');

  return { from: AUDIT_FROM_EMAIL, to, subject, text };
}

export function buildLeadNotificationEmail(email, siteUrl, scores) {
  const replyTo = email ? stripHeaderValue(email) : undefined;
  const safeUrl = stripHeaderValue(siteUrl);
  const subject = replyTo ? `Site scan: ${safeUrl}` : `Site scan: ${safeUrl} (anonymous)`;
  const verdict = verdictFromScores(scores);

  const text = [
    'Someone ran the site scan.',
    '',
    `Scanned URL: ${siteUrl}`,
    `Their email: ${replyTo || '(anonymous, no email given)'}`,
    '',
    'Scores:',
    ...scoreLines(scores),
    '',
    `Verdict: ${verdict.text}`,
    verdict.cta,
  ].join('\n');

  const message = { from: AUDIT_FROM_EMAIL, to: LEAD_NOTIFY_TO, subject, text };
  if (replyTo) message.replyTo = replyTo;
  return message;
}

// Lead-notify email for a contact-form submission that included a website —
// the background scan result. Josh-only: the prospect never asked for a scan,
// so they are never emailed a report from this path.
export function buildContactScanEmail(submission, siteUrl, scores) {
  const replyTo = stripHeaderValue(submission.email);
  const safeName = stripHeaderValue(submission.name);
  const subject = `Contact lead site scan: ${siteHost(siteUrl)}`;
  const verdict = verdictFromScores(scores);

  const text = [
    `${safeName} (${replyTo}) submitted the contact form and included their website. Here's how it scores:`,
    '',
    `Scanned URL: ${siteUrl}`,
    '',
    'Scores:',
    ...scoreLines(scores),
    '',
    `Verdict: ${verdict.text}`,
    verdict.cta,
  ].join('\n');

  return { from: AUDIT_FROM_EMAIL, to: LEAD_NOTIFY_TO, subject, text, replyTo };
}

export function getContactRedirect(requestUrl, state) {
  const url = new URL("/contact", requestUrl);
  url.searchParams.set(state, "1");
  return url.toString();
}

export async function validateTurnstileToken({
  token,
  secret,
  remoteIp,
  fetchImpl = fetch,
}) {
  if (!token || !secret) {
    console.error("turnstile: missing", token ? "secret" : "token");
    return false;
  }

  try {
    const response = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: remoteIp,
      }),
    });

    const result = await response.json();
    if (result.success !== true) {
      console.error("turnstile: siteverify rejected", JSON.stringify(result["error-codes"] ?? result));
    }
    return result.success === true;
  } catch (e) {
    console.error("turnstile: siteverify unreachable", e);
    return false;
  }
}
