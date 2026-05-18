import { Link } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";
import { HomeIplEntry } from "../../components/home/HomeIplEntry.jsx";
import { HomeLottieBanners } from "../../components/home/HomeLottieBanners.jsx";
import { AdSenseBanner } from "../../components/ads/AdSenseBanner.jsx";
import { HomeThandaSection } from "../../components/home/HomeThandaSection.jsx";
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

      <HomeLottieBanners />

      <AdSenseBanner className="adsense-banner--home" />

      <HomeIplEntry />

      <section className="home-offers" aria-labelledby="home-offers-heading">
        <h2 id="home-offers-heading" className="sr-only">
          Our offers
        </h2>
        <ul className="home-offers__list">
          <li className="home-offers__card">
            <p className="home-offers__en">
              Get <strong>Thanda</strong> without any fridge charges
            </p>
            <p className="home-offers__hi" lang="hi">
              बिना किसी फ्रिज चार्ज के <strong>ठंडा</strong> पाएं
            </p>
          </li>
          <li className="home-offers__card home-offers__card--delivery">
            <p className="home-offers__en">
              Get <strong>delivery at your home</strong> without any extra charges
            </p>
            <p className="home-offers__hi" lang="hi">
              <strong>घर पर डिलीवरी</strong> पाएं, बिना किसी अतिरिक्त शुल्क के
            </p>
          </li>
        </ul>
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

      <HomeThandaSection />

      <p className="home-foot muted">
        Add drinks from above, then checkout from{" "}
        <Link to="/cart" className="cart-inline-link">
          your cart
        </Link>
        .
      </p>
    </Screen>
  );
}
