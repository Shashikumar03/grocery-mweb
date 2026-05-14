/**
 * Raw image URL from API payload.
 * @param {Record<string, unknown>} product
 * @returns {string}
 */
export function getProductImageSrc(product) {
  const u = product.imageUrl ?? product.imageURL ?? product.image_url;
  return typeof u === "string" && u.trim() ? u.trim() : "";
}

/** True when the app uses same-origin `/api` proxy (Vite dev/preview). */
function useSameOriginImageProxy() {
  const v = import.meta.env.VITE_API_BASE_URL;
  return v !== undefined && String(v).trim() === "";
}

/**
 * Firebase / GCS download URLs are meant for the browser; server-side fetch in
 * `/__proxy-image` often gets 403. Load these directly even in dev/preview.
 * @param {string} trimmedHttpsUrl
 */
function bypassImageProxyInDev(trimmedHttpsUrl) {
  let host;
  try {
    host = new URL(trimmedHttpsUrl).hostname;
  } catch {
    return false;
  }
  return (
    host === "firebasestorage.googleapis.com" ||
    host === "storage.googleapis.com"
  );
}

/**
 * URL for `<img src>` — in dev/preview with empty `VITE_API_BASE_URL`, remote HTTPS images
 * use `/__proxy-image` (same-origin) where helpful. Firebase Storage URLs are not proxied
 * so token-based downloads work in the browser.
 * @param {string} rawUrl
 * @returns {string}
 */
export function resolveProductImageUrlForDisplay(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  const u = rawUrl.trim();
  if (!u.startsWith("https://")) return u;
  if (bypassImageProxyInDev(u)) return u;
  if (useSameOriginImageProxy()) {
    return `/__proxy-image?url=${encodeURIComponent(u)}`;
  }
  return u;
}

/**
 * @param {Record<string, unknown>} product
 * @returns {string}
 */
export function getProductImageUrlForDisplay(product) {
  return resolveProductImageUrlForDisplay(getProductImageSrc(product));
}