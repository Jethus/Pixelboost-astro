import { verdictFromScores } from "../shared/verdict.js";

const CONTACT_EMAIL = "hello@pixelboost.ca";
const FROM_EMAIL = "Pixelboost Website <hello@pixelboost.ca>";
// Audit emails send via Fastmail JMAP, which requires the From address to be a
// VERIFIED sending identity on the account. hello@pixelboost.ca is NOT one (only
// josh@pixelboost.ca is), so audit emails send from josh@ — sending from an
// unverified identity is rejected with `forbiddenFrom`. The contact form keeps
// FROM_EMAIL (hello@) because it goes through the Cloudflare send_email binding,
// not Fastmail.
const AUDIT_FROM_EMAIL = "Josh from Pixelboost <josh@pixelboost.ca>";

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
  const safeEmail = stripHeaderValue(submission.email);
  const subject = `New Pixelboost contact form submission from ${safeName}`;
  const body = [
    "New contact form submission from pixelboost.ca",
    "",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Website: ${submission.website || "Not provided"}`,
    "",
    "Message:",
    submission.message,
  ].join("\r\n");

  const raw = [
    `From: ${FROM_EMAIL}`,
    `To: ${CONTACT_EMAIL}`,
    `Reply-To: ${safeName} <${safeEmail}>`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    body,
  ].join("\r\n");

  return {
    from: FROM_EMAIL,
    to: CONTACT_EMAIL,
    replyTo: safeEmail,
    subject,
    raw,
  };
}

function trackingLine(scores) {
  if (scores.tracking > 0 && scores.trackingTools?.length > 0) {
    return `Yes — ${scores.trackingTools.join(', ')}`;
  }
  return 'No';
}

function scoreLines(scores) {
  return [
    `- Speed: ${scores.perf ?? '—'}`,
    `- Mobile: ${scores.mobile ?? '—'}`,
    `- SEO: ${scores.seo ?? '—'}`,
    `- Accessibility: ${scores.a11y ?? '—'}`,
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
    '— Josh, Pixelboost',
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
    `Their email: ${replyTo || '(anonymous — no email given)'}`,
    '',
    'Scores:',
    ...scoreLines(scores),
    '',
    `Verdict: ${verdict.text}`,
    verdict.cta,
  ].join('\n');

  const message = { from: AUDIT_FROM_EMAIL, to: CONTACT_EMAIL, subject, text };
  if (replyTo) message.replyTo = replyTo;
  return message;
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
    return result.success === true;
  } catch {
    return false;
  }
}
