import { Link } from "react-router-dom";

export function MobileHeader() {
  return (
    <header className="mobile-header">
      <Link to="/" className="mobile-header__brand">
        Grocery
      </Link>
      <Link to="/orders" className="mobile-header__link">
        Orders
      </Link>
    </header>
  );
}
