/** @param {unknown} row */
export function getCartLineSortKey(row) {
  if (!row || typeof row !== "object") return Number.MAX_SAFE_INTEGER;
  const o = /** @type {Record<string, unknown>} */ (row);
  const id = o.cartItemId ?? o.productId;
  const n = Number(id);
  return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
}

/** @param {unknown[]} items */
export function sortCartItems(items) {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => getCartLineSortKey(a) - getCartLineSortKey(b));
}

/**
 * Returns a cart object with `cartItemsDto` sorted by cartItemId (then productId).
 * Also normalizes nested `cartDto` when present.
 * @param {unknown} cart
 */
export function normalizeCart(cart) {
  if (!cart || typeof cart !== "object" || Array.isArray(cart)) return cart;
  const o = /** @type {Record<string, unknown>} */ (cart);
  if (o.cartDto && typeof o.cartDto === "object" && !Array.isArray(o.cartDto)) {
    return { ...o, cartDto: normalizeCart(o.cartDto) };
  }
  if (!Array.isArray(o.cartItemsDto)) return cart;
  return { ...o, cartItemsDto: sortCartItems(o.cartItemsDto) };
}
