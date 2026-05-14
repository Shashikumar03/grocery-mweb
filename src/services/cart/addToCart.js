import { apiUrl, parseJsonResponseText, throwIfApiFailure } from "../api/client.js";
import { getAuthToken } from "../../utils/authSession.js";

/**
 * POST /api/v1/carts/{userId}/add
 * @param {number | string} userId
 * @param {{ productId: number, quantity: number }} body
 */
export async function addProductToCart(userId, { productId, quantity }) {
  const token = getAuthToken();
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(
    apiUrl(`/api/v1/carts/${encodeURIComponent(String(userId))}/add`),
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        productId: Number(productId),
        quantity: Number(quantity),
      }),
    }
  );

  const raw = await res.text();
  const parsed = parseJsonResponseText(raw);
  throwIfApiFailure(res, parsed);
  return parsed;
}
