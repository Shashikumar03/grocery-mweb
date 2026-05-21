import { Link } from "react-router-dom";
import { SiteProse } from "../../components/content/SiteProse.jsx";
import { Screen } from "../../components/common/Screen.jsx";

export function CheckoutPage() {
  return (
    <Screen title="Checkout">
      <SiteProse>
        <p>
          Checkout on Bazzari happens from your shopping cart. After you add products, open the
          cart page to review quantities and prices, select the address where groceries should be
          delivered, and pick either online payment or cash on delivery when that option is shown.
        </p>
        <p>
          Online payment uses a secure payment partner. You will complete payment on the payment
          screen before your order is confirmed. If you choose cash on delivery, you pay the
          delivery person in cash when the order arrives. You need a free account to save
          addresses and view order history.
        </p>
        <p>
          <Link to="/cart" className="account-actions__primary">
            Go to cart to checkout
          </Link>
        </p>
        <p className="muted">
          New here? <Link to="/categories">Browse products</Link> or read{" "}
          <Link to="/about">how Bazzari works</Link> on the home page.
        </p>
      </SiteProse>
    </Screen>
  );
}
