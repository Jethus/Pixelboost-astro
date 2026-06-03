import { EmailMessage } from "cloudflare:email";

import {
  buildContactEmail,
  getContactRedirect,
  validateTurnstileToken,
  validateContactSubmission,
} from "./contact-utils.js";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const TRACKING_DOMAINS = [
  "google-analytics.com",
  "googletagmanager.com",
  "hotjar.com",
  "plausible.io",
  "usefathom.com",
  "heap.io",
  "mixpanel.com",
  "segment.io",
  "segment.com",
];

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

function deriveTracking(audits) {
  const items = audits["third-party-summary"]?.details?.items ?? [];
  const found = items.some((item) => {
    const entity = (item.entity ?? "").toLowerCase();
    return TRACKING_DOMAINS.some((domain) => entity.includes(domain));
  });
  return found ? 100 : 0;
}

function psiScore(categories, key) {
  return Math.round((categories[key]?.score ?? 0) * 100);
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

  const psiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=mobile&key=${env.PSI_API_KEY}`;

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

    const response = await env.ASSETS.fetch(request);

    if (
      request.method === "GET" &&
      (url.pathname === "/contact" || url.pathname === "/contact/") &&
      response.headers.get("Content-Type")?.includes("text/html")
    ) {
      return new HTMLRewriter()
        .on("[data-turnstile-sitekey]", {
          element(element) {
            element.setAttribute("data-sitekey", env.TURNSTILE_SITE_KEY || "");
          },
        })
        .transform(response);
    }

    return response;
  },
};
