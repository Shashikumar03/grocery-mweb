import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", icon: "⌂" },
  { to: "/categories", label: "Shop", icon: "☰" },
  { to: "/search", label: "Search", icon: "⌕" },
  { to: "/cart", label: "Cart", icon: "⎕" },
  { to: "/account", label: "You", icon: "○" },
];

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {navItems.map(({ to, label, icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            className={`bottom-nav__item${active ? " bottom-nav__item--active" : ""}`}
          >
            <span className="bottom-nav__icon" aria-hidden>
              {icon}
            </span>
            <span className="bottom-nav__label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
