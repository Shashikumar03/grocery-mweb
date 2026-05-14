import { apiUrl, parseJsonResponseText, throwIfApiFailure } from "../api/client.js";
import { getAuthToken } from "../../utils/authSession.js";

/**
 * @param {unknown} parsed
 * @returns {Array<Record<string, unknown>>}
 */
export function normalizeOrderHistoryList(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === "object") {
    const o = /** @type {Record<string, unknown>} */ (parsed);
    if (Array.isArray(o.data)) return o.data;
    if (Array.isArray(o.orders)) return o.orders;
    if (Array.isArray(o.content)) return o.content;
    if (Array.isArray(o.orderHistory)) return o.orderHistory;
    if (Array.isArray(o.orderDtos)) return o.orderDtos;
  }
  return [];
}

/**
 * GET /api/place-order/history/{userId}
 * @param {number | string} userId
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function fetchOrderHistory(userId) {
  const token = getAuthToken();
  /** @type {Record<string, string>} */
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(
    apiUrl(
      `/api/place-order/history/${encodeURIComponent(String(userId))}`
    ),
    { headers }
  );
  const raw = await res.text();
  const parsed = parseJsonResponseText(raw);
  throwIfApiFailure(res, parsed);
  return normalizeOrderHistoryList(parsed);
}
