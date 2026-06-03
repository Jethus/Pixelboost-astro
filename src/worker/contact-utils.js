const CONTACT_EMAIL = "hello@pixelboost.ca";
const FROM_EMAIL = "Pixelboost Website <hello@pixelboost.ca>";

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
