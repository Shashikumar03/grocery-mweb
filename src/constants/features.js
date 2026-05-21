/**
 * IPL match-prediction promo (cashback). Off by default for AdSense review.
 * Set VITE_ENABLE_IPL_PROMO=true in Netlify after AdSense is approved to restore.
 */
export const IPL_PROMO_ENABLED =
  String(import.meta.env.VITE_ENABLE_IPL_PROMO ?? "").trim().toLowerCase() === "true";
