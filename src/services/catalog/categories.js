import { apiUrl, parseJsonResponseText, throwIfApiFailure } from "../api/client.js";

/**
 * GET /api/category/all — categories each with `productsDto` items.
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function fetchAllCategories() {
  const res = await fetch(apiUrl("/api/category/all"));
  const raw = await res.text();
  const parsed = parseJsonResponseText(raw);
  throwIfApiFailure(res, parsed);
  if (!Array.isArray(parsed)) {
    throw new Error("Unexpected response from categories API");
  }
  return parsed;
}
