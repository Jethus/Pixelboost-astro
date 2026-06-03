import { EmailMessage } from "cloudflare:email";

import { buildPageSpeedUrl, deriveTracking, psiScore } from "./audit-utils.js";
import {
  buildContactEmail,
  buildReportRequestEmail,
  getContactRedirect,
  validateTurnstileToken,
  validateContactSubmission,
} from "./contact-utils.js";

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

async function handleAudit(request, env) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return Response.json({ error: "Missing url param" }, { status: 400, headers: JSON_HEADERS });
  }

  let targetUrl;
  try {
    const url = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
    new URL(url);
    targetUrl = url;
  } catch {
    return Response.json({ error: "Invalid URL" }, { status: 400, headers: JSON_HEADERS });
  }

  const psiEndpoint = buildPageSpeedUrl(targetUrl, env.PSI_API_KEY);

  let psiRes;
  try {
    psiRes = await fetch(psiEndpoint);
  } catch {
    return Response.json({ error: "Failed to reach PSI API" }, { status: 502, headers: JSON_HEADERS });
  }

  if (!psiRes.ok) {
    return Response.json({ error: `PSI API error: ${psiRes.status}` }, { status: 502, headers: JSON_HEADERS });
  }

  const data = await psiRes.json();
  const { categories, audits } = data.lighthouseResult;

  return Response.json(
    {
      perf: psiScore(categories, "performance"),
      a11y: psiScore(categories, "accessibility"),
      seo: psiScore(categories, "seo"),
      mobile: deriveMobile(audits),
      tracking: deriveTracking(audits),
    },
    { headers: JSON_HEADERS },
  );
}

async function handleReportRequest(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400, headers: JSON_HEADERS });
  }

  const { email, siteUrl, scores } = body;
  if (!email || !siteUrl || !scores) {
    return Response.json({ error: "Missing fields" }, { status: 400, headers: JSON_HEADERS });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400, headers: JSON_HEADERS });
  }

  const emailData = buildReportRequestEmail(email, siteUrl, scores);
  const message = new EmailMessage(emailData.from, emailData.to, emailData.raw);

  try {
    await env.CONTACT_EMAIL.send(message);
  } catch {
    return Response.json({ error: "Failed to send" }, { status: 500, headers: JSON_HEADERS });
  }

  return Response.json({ ok: true }, { headers: JSON_HEADERS });
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
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/audit") {
      return handleAudit(request, env);
    }

    if (request.method === "POST" && url.pathname === "/contact") {
      return handleContact(request, env);
    }

    if (request.method === "POST" && url.pathname === "/api/report-request") {
      return handleReportRequest(request, env);
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
