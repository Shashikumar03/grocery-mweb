/** Google AdSense publisher ID (also in index.html). */
export const ADSENSE_CLIENT = "ca-pub-7279918855351223";

/**
 * Display ad slot from AdSense → Ads → By ad unit.
 * Set in .env: VITE_ADSENSE_SLOT=1234567890
 */
export function getAdSlot() {
  const slot = import.meta.env.VITE_ADSENSE_SLOT;
  return slot != null ? String(slot).trim() : "";
}

export function isAdsenseBannerEnabled() {
  if (import.meta.env.VITE_ADSENSE_ENABLED === "false") return false;
  return Boolean(ADSENSE_CLIENT && getAdSlot());
}
