import { Link } from "react-router-dom";
import { SiteProse } from "../../components/content/SiteProse.jsx";
import { Screen } from "../../components/common/Screen.jsx";
import { FAQ_ITEMS } from "../../content/faqItems.js";
import { SITE_NAME } from "../../constants/site.js";

export function FaqPage() {
  return (
    <Screen
      title="Frequently asked questions"
      metaDescription={`Answers about ordering groceries, payments, delivery, and accounts on ${SITE_NAME}.`}
    >
      <SiteProse>
        <p>
          This page answers common questions about shopping on {SITE_NAME}. If you do not find
          what you need, visit our <Link to="/contact">contact page</Link> or read the{" "}
          <Link to="/delivery">delivery information</Link> page.
        </p>
      </SiteProse>

      <div className="faq-list">
        {FAQ_ITEMS.map((item) => (
          <article key={item.q} className="faq-item">
            <h2 className="faq-item__q">{item.q}</h2>
            <p className="faq-item__a">{item.a}</p>
          </article>
        ))}
      </div>

      <p className="privacy-back">
        <Link to="/categories">Shop groceries</Link>
        {" · "}
        <Link to="/">Home</Link>
      </p>
    </Screen>
  );
}
