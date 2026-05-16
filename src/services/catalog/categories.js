import { apiUrl, parseJsonResponseText, throwIfApiFailure } from "../api/client.js";

/**
 * @param {unknown} parsed
 * @returns {Array<Record<string, unknown>>}
 */
export function normalizeCategoriesList(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === "object") {
    const o = /** @type {Record<string, unknown>} */ (parsed);
    if (Array.isArray(o.data)) return o.data;
    if (Array.isArray(o.categories)) return o.categories;
    if (Array.isArray(o.content)) return o.content;
    if (Array.isArray(o.categoryDtos)) return o.categoryDtos;
    if (Array.isArray(o.categoryList)) return o.categoryList;
    if (Array.isArray(o.results)) return o.results;
    const inner = o.payload ?? o.body;
    if (inner && typeof inner === "object" && !Array.isArray(inner)) {
      const i = /** @type {Record<string, unknown>} */ (inner);
      if (Array.isArray(i.data)) return i.data;
      if (Array.isArray(i.categories)) return i.categories;
    }
  }
  return [];
}

/** @param {Record<string, unknown>} row */
function normalizeCategoryRow(row) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return row;
  const id = row.id ?? row.categoryId;
  if (id != null && row.id == null) {
    return { ...row, id };
  }
  return row;
}

/**
 * GET /api/category/all — categories each with `productsDto` items.
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function fetchAllCategories() {
  const res = await fetch(apiUrl("/api/category/all"));
  const raw = await res.text();
  const parsed = parseJsonResponseText(raw);
  throwIfApiFailure(res, parsed);
  const list = normalizeCategoriesList(parsed);
  return list
    .filter((row) => row && typeof row === "object" && !Array.isArray(row))
    .map((row) => normalizeCategoryRow(/** @type {Record<string, unknown>} */ (row)));
}

/**
 * @param {unknown} parsed
 * @returns {Record<string, unknown> | null}
 */
export function normalizeCategoryDetail(parsed) {
  if (!parsed || typeof parsed !== "object") return null;
  if (Array.isArray(parsed)) {
    const first = parsed[0];
    return first && typeof first === "object" && !Array.isArray(first)
      ? normalizeCategoryRow(/** @type {Record<string, unknown>} */ (first))
      : null;
  }
  const o = /** @type {Record<string, unknown>} */ (parsed);
  const inner = o.data ?? o.category ?? o.body;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    return normalizeCategoryRow(/** @type {Record<string, unknown>} */ (inner));
  }
  return normalizeCategoryRow(o);
}

/** @param {Record<string, unknown> | null} category */
export function getProductsFromCategory(category) {
  if (!category) return [];
  const raw =
    category.productsDto ?? category.products ?? category.productDtos ?? [];
  return Array.isArray(raw)
    ? raw.filter((p) => p && typeof p === "object" && !Array.isArray(p))
    : [];
}

/**
 * GET /api/category/{categoryId} — e.g. beverages at id 5.
 * @param {number | string} categoryId
 * @returns {Promise<Record<string, unknown> | null>}
 */
export async function fetchCategoryById(categoryId) {
  const res = await fetch(
    apiUrl(`/api/category/${encodeURIComponent(String(categoryId))}`)
  );
  const raw = await res.text();
  const parsed = parseJsonResponseText(raw);
  throwIfApiFailure(res, parsed);
  return normalizeCategoryDetail(parsed);
}
