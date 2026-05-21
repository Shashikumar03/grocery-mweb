import { Link } from "react-router-dom";
import { SiteProse } from "../../components/content/SiteProse.jsx";
import { Screen } from "../../components/common/Screen.jsx";
import { CONTACT_EMAIL, CONTACT_PHONE, SITE_NAME } from "../../constants/site.js";

export function ContactPage() {
  return (
    <Screen
      title="Contact us"
      metaDescription={`Contact ${SITE_NAME} for order help, delivery questions, or account support.`}
    >
      <SiteProse>
        <p>
          We welcome questions from customers and partners of <strong>{SITE_NAME}</strong>. Whether
          you need help with an order, a payment, a delivery, or your account, use the contact
          details below. Please include your order number if your message is about a specific
          purchase so we can find it quickly.
        </p>
      </SiteProse>

      <SiteProse title="How to reach us">
        {CONTACT_EMAIL ? (
          <p>
            Email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We read messages on business
            days and try to reply within one working day.
          </p>
        ) : (
          <p>
            Email support will appear here once configured. If you operate this shop, add your
            business email as <code>VITE_CONTACT_EMAIL</code> in your hosting settings so
            customers can reach you directly.
          </p>
        )}
        {CONTACT_PHONE ? (
          <p>
            You can also call us at{" "}
            <a href={`tel:${CONTACT_PHONE.replace(/\D/g, "")}`}>{CONTACT_PHONE}</a> during
            reasonable daytime hours.
          </p>
        ) : null}
        <p>
          Before contacting us about a product, you may find answers faster on the shop page or by
          using search. Order status and payment details are available in your account after you
          sign in.
        </p>
      </SiteProse>

      <SiteProse title="Policies">
        <p>
          Learn how we handle personal data in our <Link to="/privacy">privacy policy</Link>. Rules
          for using the website are described in our <Link to="/terms">terms of use</Link>. For a
          general overview of the service, visit the <Link to="/about">about page</Link>.
        </p>
      </SiteProse>

      <p className="privacy-back">
        <Link to="/">← Back to home</Link>
      </p>
    </Screen>
  );
}
