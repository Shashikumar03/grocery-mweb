import { Link } from "react-router-dom";
import { SiteProse } from "../../components/content/SiteProse.jsx";
import { Screen } from "../../components/common/Screen.jsx";
import { SITE_NAME } from "../../constants/site.js";

export function DeliveryPage() {
  return (
    <Screen
      title="Delivery information"
      metaDescription={`How ${SITE_NAME} delivers grocery orders: addresses, timing, payment on delivery, and what to expect when your order arrives.`}
    >
      <SiteProse title="How delivery works">
        <p>
          When you confirm an order on {SITE_NAME}, we prepare your items for delivery to the
          address you select at checkout. Please double-check your house number, landmark, city,
          and pin code before you pay. Accurate addresses help our team reach you without delays.
        </p>
        <p>
          A contact phone number on the order is used if the delivery person needs directions.
          Keep your phone available around the expected delivery window.
        </p>
      </SiteProse>

      <SiteProse title="Delivery timing">
        <p>
          Delivery times depend on order volume, weather, and distance. We do not guarantee a
          fixed minute-by-minute arrival, but we aim to deliver as soon as your order is packed
          and routed. You can see order and delivery status updates in your account after you
          sign in.
        </p>
        <p>
          If you are ordering for a specific meal time, we recommend placing the order earlier
          in the day rather than waiting until the last minute.
        </p>
      </SiteProse>

      <SiteProse title="Cash on delivery">
        <p>
          Where cash on delivery is offered, please keep the exact or approximate order total
          ready in cash. The amount is shown in your cart before you confirm. If you chose
          online payment instead, the delivery person will not collect cash for that order.
        </p>
      </SiteProse>

      <SiteProse title="Service area">
        <p>
          We expand delivery coverage over time. Enter your full address during checkout to see
          whether we can accept the order. If you are outside our current area, the website may
          not allow checkout — contact us with your location details and we will advise you.
        </p>
      </SiteProse>

      <SiteProse title="Missing or incorrect items">
        <p>
          If something is missing or incorrect, contact us promptly with your order number and
          a short description of the issue. We take product quality seriously and will work with
          you to resolve genuine problems according to our store policies.
        </p>
      </SiteProse>

      <p className="privacy-back">
        <Link to="/faq">FAQ</Link>
        {" · "}
        <Link to="/contact">Contact</Link>
        {" · "}
        <Link to="/">Home</Link>
      </p>
    </Screen>
  );
}
