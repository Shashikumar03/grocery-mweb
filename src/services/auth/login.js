import { apiUrl, parseJsonResponseText, throwIfApiFailure } from "../api/client.js";

/**
 * POST /auth/login
 * `email` may be an email address or a phone number (backend contract).
 * @param {{ email: string }} payload
 * @returns {Promise<unknown>}
 */
export async function postAuthLogin(payload) {
  const email = payload.email.trim();
  const res = await fetch(apiUrl("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const raw = await res.text();
  const parsed = parseJsonResponseText(raw);
  throwIfApiFailure(res, parsed);
  return parsed;
}
