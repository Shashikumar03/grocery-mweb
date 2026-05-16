import { apiUrl, parseJsonResponseText, throwIfApiFailure } from "../api/client.js";
import { getAuthToken } from "../../utils/authSession.js";

function postAuthHeaders() {
  const token = getAuthToken();
  /** @type {Record<string, string>} */
  const h = { Accept: "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

/**
 * POST /api/place-order/{userId}/{addressId}?paymentMode=...
 * @param {number | string} userId
 * @param {number | string} addressId
 * @param {string} paymentMode `ONLINE`
 */
export async function placeOrder(userId, addressId, paymentMode) {
  const mode = String(paymentMode ?? "").trim();
  const params = new URLSearchParams({ paymentMode: mode });
  const path = `/api/place-order/${encodeURIComponent(String(userId))}/${encodeURIComponent(String(addressId))}?${params.toString()}`;
  const res = await fetch(apiUrl(path), {
    method: "POST",
    headers: postAuthHeaders(),
  });
  const raw = await res.text();
  const parsed = raw ? parseJsonResponseText(raw) : null;
  throwIfApiFailure(res, parsed);
  return parsed;
}
