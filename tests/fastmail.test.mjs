import assert from "node:assert/strict";
import { test } from "node:test";
import { sendViaFastmail } from "../src/worker/fastmail.js";

const env = { JMAP_FASTMAIL_API: "secret-token-123" };

const FROM = "Pixelboost Website <hello@pixelboost.ca>";

const SESSION = {
  apiUrl: "https://api.fastmail.com/jmap/api/",
  accounts: { u123: {} },
  primaryAccounts: { "urn:ietf:params:jmap:mail": "u123" },
};

// Build a mock fetchImpl that walks a scripted list of responses, recording every call.
function makeFetch(responses) {
  const calls = [];
  async function fetchImpl(url, init) {
    let body;
    if (init && typeof init.body === "string") {
      try {
        body = JSON.parse(init.body);
      } catch {
        body = init.body;
      }
    }
    calls.push({ url, init, body });
    const next = responses.shift();
    if (!next) throw new Error(`unexpected fetch call to ${url}`);
    return next;
  }
  fetchImpl.calls = calls;
  return fetchImpl;
}

function jsonResponse(obj, { ok = true, status = 200 } = {}) {
  return { ok, status, json: async () => obj };
}

// methodResponses for the first POST: Identity/get + Mailbox/query
function firstPostOk(identityEmail = "hello@pixelboost.ca") {
  return jsonResponse({
    methodResponses: [
      ["Identity/get", { accountId: "u123", list: [{ id: "i1", email: identityEmail }] }, "0"],
      ["Mailbox/query", { accountId: "u123", ids: ["mbDrafts"] }, "1"],
    ],
    sessionState: "abc",
  });
}

// methodResponses for the second POST: Email/set + EmailSubmission/set
function secondPostOk() {
  return jsonResponse({
    methodResponses: [
      ["Email/set", { accountId: "u123", created: { draft: { id: "E1" } } }, "0"],
      ["EmailSubmission/set", { accountId: "u123", created: { sendIt: { id: "S1" } } }, "1"],
    ],
    sessionState: "abc",
  });
}

function findMethodCall(body, name) {
  return body.methodCalls.find((c) => c[0] === name);
}

test("happy path: session uses Bearer, Email/set carries correct shape, resolves", async () => {
  const message = {
    from: FROM,
    to: "owner@shop.ca",
    subject: "Your shop.ca report",
    text: "Here is your report.",
    replyTo: "lead@shop.ca",
  };

  const fetchImpl = makeFetch([
    jsonResponse(SESSION),
    firstPostOk(),
    secondPostOk(),
  ]);

  await sendViaFastmail(env, message, fetchImpl);

  // (a) session GET carries the Bearer token
  const sessionCall = fetchImpl.calls[0];
  assert.match(sessionCall.url, /jmap\/session$/);
  const sessionAuth = sessionCall.init.headers.Authorization || sessionCall.init.headers.authorization;
  assert.equal(sessionAuth, "Bearer secret-token-123");

  // First POST goes to apiUrl and carries Bearer + submission capability
  const firstPost = fetchImpl.calls[1];
  assert.equal(firstPost.url, SESSION.apiUrl);
  assert.equal(firstPost.init.method, "POST");
  assert.ok(firstPost.body.using.includes("urn:ietf:params:jmap:submission"));
  assert.ok(findMethodCall(firstPost.body, "Identity/get"));
  assert.ok(findMethodCall(firstPost.body, "Mailbox/query"));

  // (b) Email/set request body shape
  const secondPost = fetchImpl.calls[2];
  const emailSet = findMethodCall(secondPost.body, "Email/set");
  assert.ok(emailSet, "Email/set methodCall present");
  assert.equal(emailSet[1].accountId, "u123");
  const draft = emailSet[1].create.draft;
  assert.equal(draft.subject, "Your shop.ca report");
  assert.deepEqual(draft.to, [{ email: "owner@shop.ca" }]);
  // from parsed from "Name <addr>"
  assert.equal(draft.from[0].email, "hello@pixelboost.ca");
  assert.equal(draft.from[0].name, "Pixelboost Website");
  // textBody via bodyValues
  assert.ok(Array.isArray(draft.textBody));
  assert.equal(draft.textBody[0].type, "text/plain");
  const partId = draft.textBody[0].partId;
  assert.equal(draft.bodyValues[partId].value, "Here is your report.");
  // replyTo present
  assert.deepEqual(draft.replyTo, [{ email: "lead@shop.ca" }]);
  // mailbox set to resolved drafts id
  assert.equal(draft.mailboxIds.mbDrafts, true);

  // EmailSubmission references the created draft via creation-id back-reference + concrete identity
  const submission = findMethodCall(secondPost.body, "EmailSubmission/set");
  assert.ok(submission);
  assert.equal(submission[1].create.sendIt.emailId, "#draft");
  assert.equal(submission[1].create.sendIt.identityId, "i1");
  assert.deepEqual(submission[1].onSuccessDestroyEmail, ["#sendIt"]);
});

test("replyTo omitted: Email/set create has no replyTo key", async () => {
  const message = {
    from: FROM,
    to: "owner@shop.ca",
    subject: "No reply-to here",
    text: "Body text",
  };

  const fetchImpl = makeFetch([jsonResponse(SESSION), firstPostOk(), secondPostOk()]);
  await sendViaFastmail(env, message, fetchImpl);

  const secondPost = fetchImpl.calls[2];
  const draft = findMethodCall(secondPost.body, "Email/set")[1].create.draft;
  assert.ok(!("replyTo" in draft) || draft.replyTo === undefined);
});

test("identity falls back to first when none matches from", async () => {
  const message = { from: FROM, to: "owner@shop.ca", subject: "S", text: "B" };
  const fetchImpl = makeFetch([
    jsonResponse(SESSION),
    firstPostOk("different@elsewhere.com"),
    secondPostOk(),
  ]);
  await sendViaFastmail(env, message, fetchImpl);
  const submission = findMethodCall(fetchImpl.calls[2].body, "EmailSubmission/set");
  assert.equal(submission[1].create.sendIt.identityId, "i1");
});

test("throws on non-2xx session response", async () => {
  const message = { from: FROM, to: "o@x.ca", subject: "S", text: "B" };
  const fetchImpl = makeFetch([jsonResponse({}, { ok: false, status: 401 })]);
  await assert.rejects(() => sendViaFastmail(env, message, fetchImpl), /401|session/i);
});

test("throws when a JMAP method response is an error", async () => {
  const message = { from: FROM, to: "o@x.ca", subject: "S", text: "B" };
  const errorPost = jsonResponse({
    methodResponses: [["error", { type: "serverFail" }, "0"]],
    sessionState: "abc",
  });
  const fetchImpl = makeFetch([jsonResponse(SESSION), errorPost]);
  await assert.rejects(() => sendViaFastmail(env, message, fetchImpl), /serverFail|error/i);
});

test("throws when Email/set returns notCreated", async () => {
  const message = { from: FROM, to: "o@x.ca", subject: "S", text: "B" };
  const secondPostNotCreated = jsonResponse({
    methodResponses: [
      ["Email/set", { accountId: "u123", notCreated: { draft: { type: "invalidProperties" } } }, "0"],
      ["EmailSubmission/set", { accountId: "u123", created: {} }, "1"],
    ],
    sessionState: "abc",
  });
  const fetchImpl = makeFetch([jsonResponse(SESSION), firstPostOk(), secondPostNotCreated]);
  await assert.rejects(() => sendViaFastmail(env, message, fetchImpl), /notCreated|invalidProperties/i);
});

test("throws when session lacks the mail capability account", async () => {
  const message = { from: FROM, to: "o@x.ca", subject: "S", text: "B" };
  const badSession = jsonResponse({
    apiUrl: "https://api.fastmail.com/jmap/api/",
    primaryAccounts: {}, // no urn:ietf:params:jmap:mail
  });
  const fetchImpl = makeFetch([badSession]);
  await assert.rejects(() => sendViaFastmail(env, message, fetchImpl), /missing apiUrl or mail account/i);
});

test("throws when POST#1 returns no identities", async () => {
  const message = { from: FROM, to: "o@x.ca", subject: "S", text: "B" };
  const noIdentities = jsonResponse({
    methodResponses: [
      ["Identity/get", { accountId: "u123", list: [] }, "0"],
      ["Mailbox/query", { accountId: "u123", ids: ["mbDrafts"] }, "1"],
    ],
    sessionState: "abc",
  });
  const fetchImpl = makeFetch([jsonResponse(SESSION), noIdentities]);
  await assert.rejects(() => sendViaFastmail(env, message, fetchImpl), /no sending identities/i);
});

test("throws when POST#1 resolves no Drafts mailbox", async () => {
  const message = { from: FROM, to: "o@x.ca", subject: "S", text: "B" };
  const noDrafts = jsonResponse({
    methodResponses: [
      ["Identity/get", { accountId: "u123", list: [{ id: "i1", email: "hello@pixelboost.ca" }] }, "0"],
      ["Mailbox/query", { accountId: "u123", ids: [] }, "1"],
    ],
    sessionState: "abc",
  });
  const fetchImpl = makeFetch([jsonResponse(SESSION), noDrafts]);
  await assert.rejects(() => sendViaFastmail(env, message, fetchImpl), /could not resolve a Drafts mailbox/i);
});

test("throws when EmailSubmission/set returns notCreated", async () => {
  const message = { from: FROM, to: "o@x.ca", subject: "S", text: "B" };
  const secondPost = jsonResponse({
    methodResponses: [
      ["Email/set", { accountId: "u123", created: { draft: { id: "E1" } } }, "0"],
      ["EmailSubmission/set", { accountId: "u123", notCreated: { sendIt: { type: "forbiddenFrom" } } }, "1"],
    ],
    sessionState: "abc",
  });
  const fetchImpl = makeFetch([jsonResponse(SESSION), firstPostOk(), secondPost]);
  await assert.rejects(() => sendViaFastmail(env, message, fetchImpl), /notCreated|forbiddenFrom/i);
});
