import { Link } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";
import { SITE_NAME, SITE_URL } from "../../constants/site.js";

export function TermsPage() {
  return (
    <Screen
      title="Terms of use"
      metaDescription={`Terms of use for shopping on ${SITE_NAME} — orders, payments, delivery, and account rules.`}
    >
      <p className="muted privacy-updated">Last updated: May 2026</p>

      <section className="privacy-section">
        <p>
          By using <strong>{SITE_NAME}</strong> at{" "}
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
            {SITE_URL.replace(/^https?:\/\//, "")}
          </a>
          , you agree to these terms. If you do not agree, please do not use the service.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-section__title">Orders and pricing</h2>
        <p>
          Product availability and prices are shown at checkout. We may cancel or adjust an order
          if an item is unavailable or if there was a pricing error.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-section__title">Payments</h2>
        <p>
          Online payments are processed by our payment partners. Cash on delivery, where offered,
          must be paid when the order is delivered.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-section__title">Accounts</h2>
        <p>
          You are responsible for keeping your login details secure and for activity on your
          account.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-section__title">Advertising</h2>
        <p>
          This site may show ads from Google AdSense. See our{" "}
          <Link to="/privacy">Privacy Policy</Link> for how data is used for advertising.
        </p>
      </section>

      <p className="privacy-back">
        <Link to="/">← Back to home</Link>
      </p>
    </Screen>
  );
}
