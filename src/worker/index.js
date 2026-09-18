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

// Same-origin is all we ever need: the audit island fetches /api/audit from
// pixelboost.ca itself. Locking this (instead of "*") stops other sites' browser
// JS from invoking the endpoint, which spends PSI quota and sends a lead email.
const ALLOWED_ORIGIN = "https://pixelboost.ca";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
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
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://data.pixelboost.dev https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com https://*.challenges.cloudflare.com https://data.pixelboost.dev https://cloudflareinsights.com",
  "frame-src https://challenges.cloudflare.com https://*.challenges.cloudflare.com",
].join("; ");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Retired URLs (with or without a trailing slash) → where they live now.
export const LEGACY_REDIRECTS = {
  "/case-studies": "/#work",
  "/services": "/",
};

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

  // Turnstile gate: every scan spends PSI quota and fires a lead email, so a
  // valid token is required. The island fetches an invisible token before POSTing.
  const verified = await validateTurnstileToken({
    token: body.turnstileToken,
    secret: env.TURNSTILE_SECRET,
    remoteIp: request.headers.get("CF-Connecting-IP"),
  });
  if (!verified) {
    return Response.json({ error: "Verification failed" }, { status: 403, headers: JSON_HEADERS });
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
    console.error("contact: validation failed:", result.error);
    return Response.redirect(getContactRedirect(request.url, "error"), 303);
  }

  try {
    await sendViaFastmail(env, buildContactEmail(result.value));
  } catch (e) {
    console.error("contact: fastmail send failed", e);
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

    // Canonical host: strip www so Google never sees duplicate content on
    // www.pixelboost.ca (wrangler.toml routes both hosts to this Worker).
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }

    // Pages that no longer exist but still surface in Search Console at
    // page-one positions. Send that equity somewhere real instead of a 404.
    const legacy = LEGACY_REDIRECTS[url.pathname.replace(/\/+$/, "") || "/"];
    if (legacy) {
      return Response.redirect(new URL(legacy, url).toString(), 301);
    }

    if (request.method === "POST" && url.pathname === "/api/audit") {
      return handleAudit(request, env, ctx);
    }

    if (request.method === "POST" && url.pathname === "/contact") {
      return handleContact(request, env, ctx);
    }

    const response = await env.ASSETS.fetch(request);

    // Cloudflare Assets (html_handling = "drop-trailing-slash") answers /about/
    // with a 307 to /about. 307 is temporary — Google keeps indexing both URLs.
    // Reissue as 308 (permanent) so the slash form is consolidated away.
    if (response.status === 307) {
      const location = response.headers.get("Location");
      if (location) {
        return Response.redirect(new URL(location, url).toString(), 308);
      }
    }

    const contentType = response.headers.get("Content-Type") || "";

    // Inject the Turnstile sitekey (a Worker secret, so absent from the static
    // build) into any placeholder element. The contact form and the audit island
    // both carry a [data-turnstile-sitekey] element; the rewriter is a no-op on
    // pages without one, so it's safe to run for all HTML.
    if (request.method === "GET" && contentType.includes("text/html")) {
      return new HTMLRewriter()
        .on("[data-turnstile-sitekey]", {
          element(element) {
            element.setAttribute("data-sitekey", env.TURNSTILE_SITE_KEY || "");
          },
        })
        .transform(withSecurityHeaders(response));
    }

    return response;
  },
};

// Baseline security headers applied to every HTML response. Kept separate from
// the CSP string above (which is large and HTML-specific).
const SECURITY_HEADERS = {
  // 2 years, subdomains, preload-eligible. The site is HTTPS-only behind CF.
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // No powerful features are used; deny the common ones outright.
  "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=()",
};

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set("Content-Security-Policy", CSP_HEADER);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
