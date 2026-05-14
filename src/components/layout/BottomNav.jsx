import { Link, useLocation } from "react-router-dom";
import { useCartCount } from "../../context/CartCountContext.jsx";

const navItems = [
  { to: "/", label: "Home", icon: "⌂" },
  { to: "/categories", label: "Shop", icon: "☰" },
  { to: "/search", label: "Search", icon: "⌕" },
  { to: "/cart", label: "Cart", icon: "⎕", badge: "cart" },
  { to: "/account", label: "You", icon: "○" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const { itemCount } = useCartCount();

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {navItems.map(({ to, label, icon, badge }) => {
        const active =
          to === "/"
            ? pathname === "/"
            : to === "/account"
              ? pathname.startsWith("/account") ||
                pathname.startsWith("/auth/") ||
                pathname === "/signup"
              : pathname.startsWith(to);
        const showBadge = badge === "cart" && itemCount > 0;
        const badgeText = itemCount > 99 ? "99+" : String(itemCount);
        return (
          <Link
            key={to}
            to={to}
            className={`bottom-nav__item${active ? " bottom-nav__item--active" : ""}`}
            aria-label={showBadge ? `${label}, ${itemCount} items in cart` : undefined}
          >
            <span className="bottom-nav__icon-wrap">
              <span className="bottom-nav__icon" aria-hidden>
                {icon}
              </span>
              {showBadge ? (
                <span className="bottom-nav__badge">{badgeText}</span>
              ) : null}
            </span>
            <span className="bottom-nav__label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
