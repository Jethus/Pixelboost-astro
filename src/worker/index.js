import { EmailMessage } from "cloudflare:email";

import { buildPageSpeedUrl, deriveLcp, deriveTracking, fetchPsiWithRetry, getTrackingTools, psiScore } from "./audit-utils.js";
import {
  buildContactEmail,
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

const CSP_HEADER = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
].join("; ");

function normalizeMobileMetric(value, good, poor) {
  if (value <= good) return 100;
  if (value >= poor) return 0;
  return Math.round(100 * (1 - (value - good) / (poor - good)));
}

function deriveMobile(audits) {
  const fcp = audits["first-contentful-paint"]?.numericValue ?? 3000;
  const tbt = audits["total-blocking-time"]?.numericValue ?? 600;
  const cls = audits["cumulative-layout-shift"]?.numericValue ?? 0.25;

  const fcpScore = normalizeMobileMetric(fcp, 1800, 3000);
  const tbtScore = normalizeMobileMetric(tbt, 200, 600);
  const clsScore = normalizeMobileMetric(cls, 0.1, 0.25);

  return Math.round(fcpScore * 0.3 + tbtScore * 0.4 + clsScore * 0.3);
}

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

  const psiEndpoint = buildPageSpeedUrl(targetUrl, env.PSI_API_KEY);

  let psiRes;
  try {
    psiRes = await fetchPsiWithRetry(psiEndpoint);
  } catch {
    return Response.json({ error: "Failed to reach PSI API" }, { status: 502, headers: JSON_HEADERS });
  }

  if (!psiRes.ok) {
    return Response.json({ error: `PSI API error: ${psiRes.status}` }, { status: 502, headers: JSON_HEADERS });
  }

  const data = await psiRes.json();
  const { categories, audits } = data.lighthouseResult;

  const scores = {
    perf: psiScore(categories, "performance"),
    a11y: psiScore(categories, "accessibility"),
    seo: psiScore(categories, "seo"),
    mobile: deriveMobile(audits),
    tracking: deriveTracking(audits),
    trackingTools: getTrackingTools(audits),
    lcp: deriveLcp(audits),
  };

  ctx.waitUntil(sendResultEmails(env, { email, siteUrl: targetUrl, scores }));

  return Response.json(scores, { headers: JSON_HEADERS });
}

async function sendResultEmails(env, { email, siteUrl, scores }) {
  // Lead notification — always (anonymous scans are still a prospecting signal).
  try {
    await sendViaFastmail(env, buildLeadNotificationEmail(email, siteUrl, scores));
  } catch (e) {
    console.error("lead notification failed", e);
  }
  // Prospect report — only when an email was provided.
  if (email) {
    try {
      await sendViaFastmail(env, buildProspectReportEmail(email, siteUrl, scores));
    } catch (e) {
      console.error("prospect report failed", e);
    }
  }
}

async function handleContact(request, env) {
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

  return Response.redirect(getContactRedirect(request.url, "sent"), 303);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/audit") {
      return handleAudit(request, env, ctx);
    }

    if (request.method === "POST" && url.pathname === "/contact") {
      return handleContact(request, env);
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
