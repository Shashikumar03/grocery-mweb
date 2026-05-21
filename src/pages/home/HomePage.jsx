import { Link } from "react-router-dom";
import { SiteProse } from "../../components/content/SiteProse.jsx";
import { Screen } from "../../components/common/Screen.jsx";
import { HomeIplEntry } from "../../components/home/HomeIplEntry.jsx";
import { HomeLottieBanners } from "../../components/home/HomeLottieBanners.jsx";
import { AdSenseBanner } from "../../components/ads/AdSenseBanner.jsx";
import { HomeThandaSection } from "../../components/home/HomeThandaSection.jsx";
import { SITE_NAME } from "../../constants/site.js";
import { readAuthSession } from "../../utils/authSession.js";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Evening";
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
  const headline = first ? `${greeting}, ${first}` : `${greeting} — welcome to ${SITE_NAME}`;

  return (
    <Screen
      title={null}
      metaDescription={`${SITE_NAME} — order groceries online in your area. Browse categories, search products, pay online or cash on delivery.`}
    >
      <header className="home-hero">
        <p className="home-hero__eyebrow">Your neighbourhood grocery store, online</p>
        <h1 className="home-hero__title">{headline}</h1>
        <p className="home-hero__lead">
          {SITE_NAME} brings daily essentials, fresh produce, pantry items, and chilled drinks to
          your doorstep. Browse our catalogue, compare prices clearly at checkout, and order in
          a few minutes from your phone.
        </p>
      </header>

      <SiteProse title={`About ${SITE_NAME}`}>
        <p>
          We built {SITE_NAME} for families who want a simple way to restock groceries without
          visiting multiple shops. Our online shop lists real products with current prices. You
          can search by name, browse by category, and build a cart at your own pace before you
          pay.
        </p>
        <p>
          Delivery is arranged to the address you save in your account. Many customers use online
          payment for a quick checkout; cash on delivery is also available when offered at
          payment time. After you place an order, you can track its status from your order
          history when you are signed in.
        </p>
      </SiteProse>

      <SiteProse title="How ordering works">
        <p>
          <strong>Step 1 — Browse or search.</strong> Open the shop page to see every category
          we carry, from vegetables and staples to beverages. Use search if you already know the
          product name.
        </p>
        <p>
          <strong>Step 2 — Add to cart.</strong> Tap a product to read its description and price,
          then add the quantity you need. Your cart keeps a running total so there are no
          surprises later.
        </p>
        <p>
          <strong>Step 3 — Checkout.</strong> Go to your cart, pick a delivery address, and choose
          online payment or cash on delivery. Confirm the order and we will prepare it for
          delivery to your home.
        </p>
      </SiteProse>

      <HomeLottieBanners />

      <HomeThandaSection />

      <section className="home-offers" aria-labelledby="home-offers-heading">
        <h2 id="home-offers-heading" className="site-prose__title">
          Current offers
        </h2>
        <ul className="home-offers__list">
          <li className="home-offers__card">
            <p className="home-offers__en">
              Get <strong>Thanda</strong> (chilled drinks) without any fridge charges on many items.
              Browse the beverages section below for cold drinks delivered ready to enjoy.
            </p>
            <p className="home-offers__hi" lang="hi">
              बिना किसी फ्रिज चार्ज के <strong>ठंडा</strong> पाएं — नीचे पेय अनुभाग देखें।
            </p>
          </li>
          <li className="home-offers__card home-offers__card--delivery">
            <p className="home-offers__en">
              Home delivery is available for orders placed through the app. Select your address at
              checkout and we will bring groceries to your door when your order is confirmed.
            </p>
            <p className="home-offers__hi" lang="hi">
              <strong>घर पर डिलीवरी</strong> उपलब्ध है — चेकआउट पर पता चुनें।
            </p>
          </li>
        </ul>
      </section>

      <section className="home-actions" aria-labelledby="home-shop-heading">
        <h2 id="home-shop-heading" className="site-prose__title">
          Start shopping
        </h2>
        <div className="home-actions">
          <Link to="/categories" className="home-action">
            <span className="home-action__icon" aria-hidden>
              🥬
            </span>
            <span className="home-action__body">
              <span className="home-action__label">Browse all categories</span>
              <span className="home-action__hint muted">
                Vegetables, staples, drinks, and more
              </span>
            </span>
          </Link>
          <Link to="/search" className="home-action">
            <span className="home-action__icon" aria-hidden>
              🔎
            </span>
            <span className="home-action__body">
              <span className="home-action__label">Search products</span>
              <span className="home-action__hint muted">Find items by name quickly</span>
            </span>
          </Link>
          <Link to="/cart" className="home-action">
            <span className="home-action__icon" aria-hidden>
              🛒
            </span>
            <span className="home-action__body">
              <span className="home-action__label">Your cart</span>
              <span className="home-action__hint muted">Review items before checkout</span>
            </span>
          </Link>
          <Link to="/orders" className="home-action">
            <span className="home-action__icon" aria-hidden>
              📦
            </span>
            <span className="home-action__body">
              <span className="home-action__label">Order history</span>
              <span className="home-action__hint muted">Track past purchases</span>
            </span>
          </Link>
        </div>
      </section>

      <SiteProse title="Why customers use Bazzari">
        <p>
          Shoppers tell us they value clear pricing on every line item, the ability to reorder
          favourite products quickly, and support for both digital payment and cash on delivery.
          We focus on everyday groceries people actually buy each week, not one-off promotions
          that are hard to understand.
        </p>
        <p>
          If you have questions about a product, delivery, or payment, see our{" "}
          <Link to="/faq">FAQ</Link>, <Link to="/delivery">delivery information</Link>, or{" "}
          <Link to="/contact">contact page</Link>. Read how we handle personal data in our{" "}
          <Link to="/privacy">privacy policy</Link> and general rules in our{" "}
          <Link to="/terms">terms of use</Link>.
        </p>
      </SiteProse>

      <AdSenseBanner className="adsense-banner--home" />

      <SiteProse title="Optional: match predictions">
        <p>
          From time to time we run separate sports prediction promotions for signed-in customers.
          These are optional and are not required to shop for groceries. The main {SITE_NAME}{" "}
          service is online grocery ordering and delivery described above.
        </p>
      </SiteProse>
      <HomeIplEntry />
    </Screen>
  );
}
