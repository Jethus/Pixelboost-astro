import { EmailMessage } from "cloudflare:email";

import { runScan } from "./audit-utils.js";
import {
  buildContactEmail,
  buildContactScanEmail,
  buildLeadNotificationEmail,
  buildProspectReportEmail,
  getContactRedirect,
  validateTurnstileToken,
  validateContactSubmission,
} from "./contact-utils.js";
import { sendViaFastmail } from "./fastmail.js";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

// Turnstile needs the *.challenges.cloudflare.com wildcard in connect-src:
// its challenge platform fetches per-colo subdomains (e.g. brunhild.…) from
// page context, and blocking them kills token issuance even though the
// widget still renders. data.pixelboost.dev is the self-hosted Plausible
// (script load + event POSTs).
const CSP_HEADER = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://data.pixelboost.dev",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com https://*.challenges.cloudflare.com https://data.pixelboost.dev",
  "frame-src https://challenges.cloudflare.com https://*.challenges.cloudflare.com",
].join("; ");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function handleAudit(request, env, ctx) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400, headers: JSON_HEADERS });
  }

  const rawUrl = (body.url || "").trim();
  const email = (body.email || "").trim();

  if (!rawUrl) {
    return Response.json({ error: "Missing url" }, { status: 400, headers: JSON_HEADERS });
  }
  if (email && !EMAIL_RE.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400, headers: JSON_HEADERS });
  }

  let targetUrl;
  try {
    const u = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
    new URL(u);
    targetUrl = u;
  } catch {
    return Response.json({ error: "Invalid URL" }, { status: 400, headers: JSON_HEADERS });
  }

  let scores;
  try {
    scores = await runScan(targetUrl, env.PSI_API_KEY);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 502, headers: JSON_HEADERS });
  }

  ctx.waitUntil(sendResultEmails(env, { email, siteUrl: targetUrl, scores }));

  return Response.json(scores, { headers: JSON_HEADERS });
}

async function sendResultEmails(env, { email, siteUrl, scores }) {
  // Lead notification — always (anonymous scans are still a prospecting signal).
  try {
    await sendViaFastmail(env, buildLeadNotificationEmail(email, siteUrl, scores));
  } catch (e) {
    console.error("lead notification failed", siteUrl, e);
  }
  // Prospect report — only when an email was provided.
  if (email) {
    try {
      await sendViaFastmail(env, buildProspectReportEmail(email, siteUrl, scores));
    } catch (e) {
      console.error("prospect report failed", siteUrl, e);
    }
  }
}

// Background scan of the website a contact-form lead volunteered, so the
// first reply can open with something concrete about their site. Never
// allowed to affect the contact flow: any failure (garbage URL, PSI down,
// email rejected) is logged and swallowed. `website` is unvalidated free
// text — the new URL() guard rejects garbage before spending a PSI call.
async function runContactScan(env, submission) {
  try {
    const raw = submission.website;
    const targetUrl = raw.startsWith("http") ? raw : `https://${raw}`;
    new URL(targetUrl);
    const scores = await runScan(targetUrl, env.PSI_API_KEY);
    await sendViaFastmail(env, buildContactScanEmail(submission, targetUrl, scores));
  } catch (e) {
    console.error("contact scan failed", submission.website, e);
  }
}

async function handleContact(request, env, ctx) {
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.redirect(getContactRedirect(request.url, "error"), 303);
  }

  const verified = await validateTurnstileToken({
    token: formData.get("cf-turnstile-response"),
    secret: env.TURNSTILE_SECRET,
    remoteIp: request.headers.get("CF-Connecting-IP"),
  });

  if (!verified) {
    return Response.redirect(getContactRedirect(request.url, "error"), 303);
  }

  const result = validateContactSubmission(formData);
  if (!result.ok) {
    return Response.redirect(getContactRedirect(request.url, "error"), 303);
  }

  const email = buildContactEmail(result.value);
  const message = new EmailMessage(email.from, email.to, email.raw);

  try {
    await env.CONTACT_EMAIL.send(message);
  } catch {
    return Response.redirect(getContactRedirect(request.url, "error"), 303);
  }

  if (result.value.website) {
    ctx.waitUntil(runContactScan(env, result.value));
  }

  return Response.redirect(getContactRedirect(request.url, "sent"), 303);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/audit") {
      return handleAudit(request, env, ctx);
    }

    if (request.method === "POST" && url.pathname === "/contact") {
      return handleContact(request, env, ctx);
    }

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get("Content-Type") || "";

    if (
      request.method === "GET" &&
      (url.pathname === "/contact" || url.pathname === "/contact/") &&
      contentType.includes("text/html")
    ) {
      return new HTMLRewriter()
        .on("[data-turnstile-sitekey]", {
          element(element) {
            element.setAttribute("data-sitekey", env.TURNSTILE_SITE_KEY || "");
          },
        })
        .transform(withSecurityHeaders(response));
    }

    if (request.method === "GET" && contentType.includes("text/html")) {
      return withSecurityHeaders(response);
    }

    return response;
  },
};

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set("Content-Security-Policy", CSP_HEADER);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
