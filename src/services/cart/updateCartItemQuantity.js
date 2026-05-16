import { apiUrl, parseJsonResponseText, throwIfApiFailure } from "../api/client.js";
import { getAuthToken } from "../../utils/authSession.js";
import { normalizeCart } from "../../utils/cartItems.js";

/** @typedef {"add" | "dec"} CartItemQuantityAction */

/**
 * PUT /api/cartItem/{cartItemId}/{itemQuantity}
 * @param {number | string} cartItemId
 * @param {CartItemQuantityAction} itemQuantity `add` to increase, `dec` to decrease
 */
export async function updateCartItemQuantity(cartItemId, itemQuantity) {
  const token = getAuthToken();
  const headers = { Accept: "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const action = itemQuantity === "dec" ? "dec" : "add";
  const res = await fetch(
    apiUrl(
      `/api/cartItem/${encodeURIComponent(String(cartItemId))}/${encodeURIComponent(action)}`
    ),
    { method: "PUT", headers }
  );

  const raw = await res.text();
  const parsed = parseJsonResponseText(raw);
  throwIfApiFailure(res, parsed);
  return normalizeCart(parsed);
}
