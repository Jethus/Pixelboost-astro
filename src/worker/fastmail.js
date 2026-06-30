// Fastmail JMAP send helper.
//
// Cloudflare Workers cannot open raw SMTP sockets, so we send email over the
// Fastmail JMAP API via plain fetch. The flow is two round-trips:
//
//   1. GET /jmap/session             -> apiUrl + accountId
//   2. POST Identity/get + Mailbox/query (role:drafts)
//                                     -> identityId + drafts mailbox id
//   3. POST Email/set + EmailSubmission/set
//                                     -> creates a draft, sends it, then
//                                        destroys the draft on success
//
// `message` is the structured builder output: { from, to, subject, text, replyTo? }.
// `from` may be a bare address or a "Name <addr>" form.

const SESSION_URL = "https://api.fastmail.com/jmap/session";

const CAPABILITIES = [
  "urn:ietf:params:jmap:core",
  "urn:ietf:params:jmap:mail",
  "urn:ietf:params:jmap:submission",
];

const MAIL_CAPABILITY = "urn:ietf:params:jmap:mail";

// Parse "Name <addr@host>" -> { name, email }, or a bare "addr@host" -> { email }.
function parseAddress(value) {
  const match = /^\s*(.*?)\s*<\s*([^>]+)\s*>\s*$/.exec(value);
  if (match) {
    const name = match[1].trim();
    const email = match[2].trim();
    return name ? { name, email } : { email };
  }
  return { email: String(value).trim() };
}

async function jmapPost(fetchImpl, apiUrl, token, methodCalls) {
  const res = await fetchImpl(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ using: CAPABILITIES, methodCalls }),
  });

  if (!res.ok) {
    throw new Error(`Fastmail JMAP POST failed: HTTP ${res.status}`);
  }

  const data = await res.json();
  const responses = data?.methodResponses ?? [];

  // Any ["error", {...}] response is a hard failure.
  for (const entry of responses) {
    if (entry[0] === "error") {
      throw new Error(`Fastmail JMAP method error: ${JSON.stringify(entry[1])}`);
    }
  }

  return responses;
}

function findResponse(responses, name) {
  const entry = responses.find((r) => r[0] === name);
  return entry ? entry[1] : undefined;
}

export async function sendViaFastmail(env, message, fetchImpl = fetch) {
  const token = env.JMAP_FASTMAIL_API;
  const { from, to, subject, text, replyTo } = message;

  // 1. Session discovery.
  const sessionRes = await fetchImpl(SESSION_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!sessionRes.ok) {
    throw new Error(`Fastmail JMAP session request failed: HTTP ${sessionRes.status}`);
  }
  const session = await sessionRes.json();
  const apiUrl = session.apiUrl;
  const accountId = session.primaryAccounts?.[MAIL_CAPABILITY];
  if (!apiUrl || !accountId) {
    throw new Error("Fastmail JMAP session missing apiUrl or mail account");
  }

  const fromAddress = parseAddress(from);

  // 2. Resolve the sending identity and the Drafts mailbox in one round-trip.
  const firstResponses = await jmapPost(fetchImpl, apiUrl, token, [
    ["Identity/get", { accountId, ids: null }, "0"],
    ["Mailbox/query", { accountId, filter: { role: "drafts" } }, "1"],
  ]);

  const identities = findResponse(firstResponses, "Identity/get")?.list ?? [];
  if (identities.length === 0) {
    throw new Error("Fastmail JMAP returned no sending identities");
  }
  const identity =
    identities.find((id) => id.email?.toLowerCase() === fromAddress.email.toLowerCase()) ??
    identities[0];
  const identityId = identity.id;

  const draftMailboxIds = findResponse(firstResponses, "Mailbox/query")?.ids ?? [];
  const draftMailboxId = draftMailboxIds[0];
  if (!draftMailboxId) {
    throw new Error("Fastmail JMAP could not resolve a Drafts mailbox");
  }

  // 3. Create the draft and submit it.
  const draft = {
    from: [fromAddress],
    to: [{ email: to }],
    subject,
    bodyValues: { body: { value: text, charset: "utf-8" } },
    textBody: [{ partId: "body", type: "text/plain" }],
    keywords: { $draft: true },
    mailboxIds: { [draftMailboxId]: true },
  };
  if (replyTo) {
    draft.replyTo = [{ email: replyTo }];
  }

  const secondResponses = await jmapPost(fetchImpl, apiUrl, token, [
    ["Email/set", { accountId, create: { draft } }, "0"],
    [
      "EmailSubmission/set",
      {
        accountId,
        onSuccessDestroyEmail: ["#sendIt"],
        create: { sendIt: { emailId: "#draft", identityId } },
      },
      "1",
    ],
  ]);

  const emailSet = findResponse(secondResponses, "Email/set");
  if (!emailSet?.created?.draft) {
    const detail = emailSet?.notCreated?.draft ?? emailSet ?? "unknown";
    throw new Error(`Fastmail Email/set did not create the draft: ${JSON.stringify(detail)}`);
  }

  const submissionSet = findResponse(secondResponses, "EmailSubmission/set");
  if (!submissionSet?.created?.sendIt) {
    const detail = submissionSet?.notCreated?.sendIt ?? submissionSet ?? "unknown";
    throw new Error(`Fastmail EmailSubmission/set did not send the email: ${JSON.stringify(detail)}`);
  }
}
