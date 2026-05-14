import { apiUrl, parseJsonResponseText, throwIfApiFailure } from "../api/client.js";

/**
 * GET /api/product/{id}
 * @param {string | number} id
 * @returns {Promise<Record<string, unknown>>}
 */
export async function fetchProductById(id) {
  const res = await fetch(apiUrl(`/api/product/${encodeURIComponent(String(id))}`));
  const raw = await res.text();
  const parsed = parseJsonResponseText(raw);
  throwIfApiFailure(res, parsed);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Unexpected response from product API");
  }
  return parsed;
}
