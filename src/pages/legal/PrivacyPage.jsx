import { Link } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";
import { ADSENSE_CLIENT } from "../../constants/adsense.js";
import { SITE_URL } from "../../constants/site.js";

export function PrivacyPage() {
  return (
    <Screen title="Privacy Policy">
      <p className="muted privacy-updated">Last updated: May 2026</p>

      <section className="privacy-section">
        <h2 className="privacy-section__title">Who we are</h2>
        <p>
          This grocery portal at{" "}
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
            {SITE_URL.replace(/^https?:\/\//, "")}
          </a>{" "}
          lets you browse products, manage a cart, place orders, and pay online. If you have
          questions about this policy, contact us through the support channel listed on your
          account or store listing.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-section__title">Information we collect</h2>
        <ul className="privacy-list">
          <li>Account details you provide (name, email, phone) when you sign up or log in.</li>
          <li>Delivery addresses you save for orders.</li>
          <li>Order and payment records needed to fulfil purchases.</li>
          <li>Technical data such as device type and browser for security and performance.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-section__title">How we use information</h2>
        <p>
          We use your data to run the service: authenticate you, show your cart and orders,
          process payments through our payment provider, and deliver groceries to your address.
          We do not sell your personal information.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-section__title">Cookies</h2>
        <p>
          We use essential cookies and local storage to keep you signed in and remember your cart.
          With your consent, we also allow advertising cookies described below.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-section__title">Google AdSense</h2>
        <p>
          This site uses Google AdSense to show ads. Publisher ID:{" "}
          <strong>{ADSENSE_CLIENT}</strong>.
        </p>
        <p>
          Google and its partners may use cookies to serve ads based on your visits to this and
          other sites. You can learn how Google uses data at{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google&apos;s partner sites policy
          </a>{" "}
          and opt out of personalized advertising at{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>
          .
        </p>
        <p>
          Third-party vendors, including Google, use cookies to serve ads. Users may opt out of
          personalized advertising by visiting{" "}
          <a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer">
            aboutads.info
          </a>
          .
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="privacy-section__title">Your choices</h2>
        <p>
          You can decline advertising cookies in the banner when you first visit. You can log out
          or contact us to update or delete account information where applicable law allows.
        </p>
      </section>

      <p className="privacy-back">
        <Link to="/">← Back to home</Link>
      </p>
    </Screen>
  );
}
