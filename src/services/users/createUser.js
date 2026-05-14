import { apiUrl, parseJsonResponseText, throwIfApiFailure } from "../api/client.js";

export const USER_ROLES = Object.freeze({
  CUSTOMER: "CUSTOMER",
});

/**
 * @typedef {Object} CreateUserPayload
 * @property {string} name
 * @property {string} password
 * @property {string} email
 * @property {string} role
 * @property {string} phoneNumber
 * @property {string} [address]
 */

/**
 * POST /api/users/
 * @param {CreateUserPayload} payload
 * @returns {Promise<unknown>}
 */
export async function createUser(payload) {
  const res = await fetch(apiUrl("/api/users/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const raw = await res.text();
  const parsed = parseJsonResponseText(raw);
  throwIfApiFailure(res, parsed);
  return parsed;
}
