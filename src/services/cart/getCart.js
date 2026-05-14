import { apiUrl, parseJsonResponseText, throwIfApiFailure } from "../api/client.js";
import { getAuthToken } from "../../utils/authSession.js";

/**
 * GET /api/v1/carts/{userId}
 * @param {number | string} userId
 */
export async function fetchCart(userId) {
  const token = getAuthToken();
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(
    apiUrl(`/api/v1/carts/${encodeURIComponent(String(userId))}`),
    { headers }
  );

  const raw = await res.text();
  const parsed = parseJsonResponseText(raw);
  throwIfApiFailure(res, parsed);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Unexpected response from cart API");
  }
  return parsed;
}
