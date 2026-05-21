import { Link } from "react-router-dom";
import { SiteProse } from "../../components/content/SiteProse.jsx";
import { Screen } from "../../components/common/Screen.jsx";
import { SITE_NAME, SITE_URL } from "../../constants/site.js";

export function AboutPage() {
  const host = SITE_URL.replace(/^https?:\/\//, "");

  return (
    <Screen
      title={`About ${SITE_NAME}`}
      metaDescription={`Learn how ${SITE_NAME} works — online grocery ordering, delivery, payments, and customer support.`}
    >
      <SiteProse>
        <p>
          <strong>{SITE_NAME}</strong> is an online grocery service built for customers who want
          everyday shopping to be simple and transparent. We list real products with current
          prices, show whether each item is in stock, and deliver orders to the address you
          choose at checkout.
        </p>
        <p>
          Our shop is open on the web at{" "}
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
            {host}
          </a>
          . You do not need an account to browse categories or read product pages. Creating a free
          account lets you save delivery addresses, place orders faster, and see your order
          history in one place.
        </p>
      </SiteProse>

      <SiteProse title="What we sell">
        <p>
          The catalogue covers groceries people buy regularly: fresh and packaged foods, cooking
          ingredients, snacks, and beverages including chilled drinks in our dedicated beverages
          section. We add and update products as supply becomes available in your area.
        </p>
        <p>
          Each product page shows the name, price in Indian rupees, and availability. You can add
          items to a cart and change quantities before you pay. The cart total updates so you
          always know what you will pay before confirming an order.
        </p>
      </SiteProse>

      <SiteProse title="Delivery and payment">
        <p>
          At checkout you select where groceries should be delivered. We support secure online
          payment through our payment partner, and cash on delivery in areas where that option is
          enabled. After your order is placed, you can follow its progress from the orders section
          when you are logged in.
        </p>
        <p>
          If something goes wrong with payment or delivery, contact us using the details on our{" "}
          <Link to="/contact">contact page</Link>. We aim to respond as quickly as we can on
          business days.
        </p>
      </SiteProse>

      <SiteProse title="Privacy and terms">
        <p>
          We explain how we use personal information in our <Link to="/privacy">privacy policy</Link>.
          General rules for using the website are in our <Link to="/terms">terms of use</Link>.
          These documents are written in plain language so you can understand your rights and our
          responsibilities.
        </p>
      </SiteProse>

      <p className="privacy-back">
        <Link to="/categories">Shop now</Link>
        {" · "}
        <Link to="/">Home</Link>
      </p>
    </Screen>
  );
}
