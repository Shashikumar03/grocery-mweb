import { apiUrl, parseJsonResponseText, throwIfApiFailure } from "../api/client.js";

/**
 * GET /api/product/search?name={query}
 * @param {string} name
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function searchProducts(name) {
  const q = String(name ?? "").trim();
  if (!q) return [];

  const params = new URLSearchParams({ name: q });
  const res = await fetch(apiUrl(`/api/product/search?${params.toString()}`));
  const raw = await res.text();
  const parsed = parseJsonResponseText(raw);
  throwIfApiFailure(res, parsed);
  if (!Array.isArray(parsed)) {
    throw new Error("Unexpected response from product search");
  }
  return parsed;
}
