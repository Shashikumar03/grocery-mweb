import { Link } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";
import { readAuthSession } from "../../utils/authSession.js";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/** @param {unknown} user */
function pickFirstName(user) {
  if (!user || typeof user !== "object") return "";
  const o = /** @type {Record<string, unknown>} */ (user);
  const n = o.name ?? o.username;
  if (n == null || !String(n).trim()) return "";
  return String(n).trim().split(/\s+/)[0] || "";
}

export function HomePage() {
  const session = readAuthSession();
  const user = session?.user && typeof session.user === "object" ? session.user : null;
  const first = pickFirstName(user);
  const greeting = getGreeting();
  const headline = first ? `${greeting}, ${first}` : greeting;

  return (
    <Screen title={null}>
      <header className="home-hero">
        <p className="home-hero__eyebrow">Your neighbourhood store, online</p>
        <h1 className="home-hero__title">{headline}</h1>
        <p className="home-hero__lead">
          Stock up on produce, pantry staples, and daily essentials—picked for quality and delivered
          with care.
        </p>
      </header>

      <section className="home-promo" aria-labelledby="home-promo-heading">
        <h2 id="home-promo-heading" className="home-promo__title">
          Today at a glance
        </h2>
        <p className="home-promo__text">
          Browse categories for seasonal picks, or jump straight to search when you know exactly what
          you need.
        </p>
      </section>

      <section className="home-actions" aria-label="Quick shortcuts">
        <Link to="/categories" className="home-action">
          <span className="home-action__icon" aria-hidden>
            🥬
          </span>
          <span className="home-action__body">
            <span className="home-action__label">Browse aisles</span>
            <span className="home-action__hint muted">Fresh produce and more</span>
          </span>
        </Link>
        <Link to="/search" className="home-action">
          <span className="home-action__icon" aria-hidden>
            🔎
          </span>
          <span className="home-action__body">
            <span className="home-action__label">Search</span>
            <span className="home-action__hint muted">Find any product fast</span>
          </span>
        </Link>
        <Link to="/cart" className="home-action">
          <span className="home-action__icon" aria-hidden>
            🛒
          </span>
          <span className="home-action__body">
            <span className="home-action__label">Cart</span>
            <span className="home-action__hint muted">Review and checkout</span>
          </span>
        </Link>
        <Link to="/orders" className="home-action">
          <span className="home-action__icon" aria-hidden>
            📦
          </span>
          <span className="home-action__body">
            <span className="home-action__label">Orders</span>
            <span className="home-action__hint muted">Track past purchases</span>
          </span>
        </Link>
      </section>

      <section className="home-trust" aria-labelledby="home-trust-heading">
        <h2 id="home-trust-heading" className="sr-only">
          Why shop with us
        </h2>
        <ul className="home-trust__list">
          <li className="home-trust__pill">Quality-checked items</li>
          <li className="home-trust__pill">Clear prices at checkout</li>
          <li className="home-trust__pill">Saved addresses for speed</li>
        </ul>
      </section>

      <p className="home-foot muted">
        Tip: add favourites to your cart from{" "}
        <Link to="/categories" className="cart-inline-link">
          categories
        </Link>{" "}
        — then choose payment and delivery on the cart page.
      </p>
    </Screen>
  );
}
