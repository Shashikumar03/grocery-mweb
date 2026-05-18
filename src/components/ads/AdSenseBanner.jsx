import { useEffect, useRef } from "react";
import {
  ADSENSE_CLIENT,
  getAdSlot,
  isAdsenseBannerEnabled,
} from "../../constants/adsense.js";
import { useAdConsent } from "../../context/AdConsentContext.jsx";

/**
 * Responsive display ad unit. Requires VITE_ADSENSE_SLOT in .env.
 * @param {{ className?: string; label?: string }} props
 */
export function AdSenseBanner({
  className = "",
  label = "Advertisement",
}) {
  const { consented } = useAdConsent();
  const insRef = useRef(null);
  const pushedRef = useRef(false);
  const slot = getAdSlot();
  const enabled = isAdsenseBannerEnabled();

  useEffect(() => {
    if (!enabled || !consented || !insRef.current || pushedRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      /* Ad blockers or script not ready */
    }
  }, [enabled, consented, slot]);

  if (!enabled || !consented || !slot) return null;

  return (
    <aside
      className={`adsense-banner${className ? ` ${className}` : ""}`}
      aria-label={label}
    >
      <p className="adsense-banner__label muted">{label}</p>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", minHeight: 90 }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
