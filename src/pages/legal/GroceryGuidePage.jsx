import { Link } from "react-router-dom";
import { SiteProse } from "../../components/content/SiteProse.jsx";
import { Screen } from "../../components/common/Screen.jsx";
import { CONTACT_EMAIL, SITE_NAME } from "../../constants/site.js";

export function GroceryGuidePage() {
  return (
    <Screen
      title="Grocery shopping guide"
      metaDescription={`Practical guide to ordering groceries online with ${SITE_NAME} — planning meals, reading prices, delivery tips, and payment options.`}
    >
      <SiteProse>
        <p>
          This guide explains how to shop smarter on <strong>{SITE_NAME}</strong>, our online
          grocery service. Whether you are ordering for the first time or building a weekly
          routine, these tips help you choose products, understand prices, and get reliable
          delivery to your home.
        </p>
      </SiteProse>

      <SiteProse title="Plan before you add to cart">
        <p>
          Start with what you will cook this week. List staples first — rice, flour, cooking oil,
          salt, and spices — then add fresh items such as vegetables and dairy. On {SITE_NAME},
          open the <Link to="/categories">shop page</Link> to browse by category or use{" "}
          <Link to="/search">search</Link> if you already know a product name. Building a cart in
          one session reduces repeated delivery fees and saves time.
        </p>
        <p>
          Check each product page for the unit (kilogram, litre, pack size) so you compare like
          with like. The price on the product row is what we use at checkout for that listing.
        </p>
      </SiteProse>

      <SiteProse title="Fresh produce and chilled items">
        <p>
          Fresh produce availability can change day to day. If an item shows as unavailable,
          try a similar product in the same category or check again later. For chilled beverages
          and dairy, add them toward the end of your shop so your mental list stays organised;
          our team packs cold items with care for transport.
        </p>
        <p>
          When your order arrives, refrigerate dairy and drinks promptly. If anything looks
          damaged, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with your order number within
          a short time so we can help.
        </p>
      </SiteProse>

      <SiteProse title="Payments: online and cash on delivery">
        <p>
          At checkout you can pay online through our secure payment partner (card, UPI, or net
          banking, depending on what is shown) or select cash on delivery when that option appears
          for your order. Online payment confirms your order immediately. For cash on delivery,
          keep the approximate total ready; the amount is visible in your cart before you confirm.
        </p>
        <p>
          Signed-in customers can view past orders and payment status from the orders section.
          For questions about a charge, contact us with the order number from that screen.
        </p>
      </SiteProse>

      <SiteProse title="Delivery addresses and timing">
        <p>
          Save a complete address in your account: house or flat number, street, landmark, city,
          and pin code. Delivery partners use the phone number on the order if they need
          directions. Read our <Link to="/delivery">delivery information</Link> page for more on
          service areas and what to expect when the order arrives.
        </p>
      </SiteProse>

      <SiteProse title="Accounts, privacy, and help">
        <p>
          You can browse without an account, but signing up lets you store addresses and track
          orders. Our <Link to="/privacy">privacy policy</Link> describes how we use your data.
          For quick answers, see the <Link to="/faq">FAQ</Link> or the{" "}
          <Link to="/contact">help and support</Link> page.
        </p>
      </SiteProse>

      <p className="privacy-back">
        <Link to="/categories">Start shopping</Link>
        {" · "}
        <Link to="/">Home</Link>
      </p>
    </Screen>
  );
}
