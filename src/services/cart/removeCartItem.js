import { apiUrl, parseJsonResponseText, throwIfApiFailure } from "../api/client.js";
import { getAuthToken } from "../../utils/authSession.js";
import { normalizeCart } from "../../utils/cartItems.js";

/**
 * PUT /api/v1/carts/remove/{userId}/{productId}
 * @param {number | string} userId
 * @param {number | string} productId
 */
export async function removeCartItem(userId, productId) {
  const token = getAuthToken();
  const headers = { Accept: "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(
    apiUrl(
      `/api/v1/carts/remove/${encodeURIComponent(String(userId))}/${encodeURIComponent(String(productId))}`
    ),
    { method: "PUT", headers }
  );

  const raw = await res.text();
  const parsed = parseJsonResponseText(raw);
  throwIfApiFailure(res, parsed);
  return normalizeCart(parsed);
}
