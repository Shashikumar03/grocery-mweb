import { Link } from "react-router-dom";
import { useAdConsent } from "../../context/AdConsentContext.jsx";

export function CookieConsent() {
  const { decided, grant, deny } = useAdConsent();

  if (decided) return null;

  return (
    <div
      className="cookie-consent"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-live="polite"
    >
      <p id="cookie-consent-title" className="cookie-consent__text">
        We use cookies for shopping and, with your consent, Google AdSense ads. See our{" "}
        <Link to="/privacy" className="cart-inline-link">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="cookie-consent__actions">
        <button type="button" className="cookie-consent__accept" onClick={grant}>
          Accept
        </button>
        <button type="button" className="cookie-consent__decline" onClick={deny}>
          Decline ads
        </button>
      </div>
    </div>
  );
}
