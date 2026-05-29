import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";
import { ShopPageShimmer } from "../../components/common/Shimmer.jsx";
import { SiteProse } from "../../components/content/SiteProse.jsx";
import { AdSenseBanner } from "../../components/ads/AdSenseBanner.jsx";
import { CategorySection } from "../../components/categories/CategorySection.jsx";
import { SITE_NAME } from "../../constants/site.js";
import { fetchAllCategories } from "../../services/catalog/index.js";
import { getReadableFetchError } from "../../utils/fetchError.js";

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchAllCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch((err) => {
        if (!cancelled) setError(getReadableFetchError(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Screen
      title="Shop groceries online"
      metaDescription={`Browse all grocery categories on ${SITE_NAME}. Fresh food, staples, beverages, and daily essentials with delivery.`}
    >
      <SiteProse>
        <p>
          Welcome to the {SITE_NAME} shop. Below you will find every category we currently list
          online, with individual products, prices, and availability. Tap any item to open its
          product page with a full description, then add what you need to your cart. When you are
          finished shopping, open your cart to choose a delivery address and payment method.
        </p>
        <p>
          Our catalogue includes fresh and packaged groceries, household staples, and a dedicated
          section for chilled beverages. Prices are shown in Indian rupees. If you cannot find
          an item, use the search page to look it up by name. For planning tips, read our{" "}
          <Link to="/guide">grocery shopping guide</Link>.
        </p>
      </SiteProse>

      {loading && !error ? <ShopPageShimmer /> : null}
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      {!loading && !error && categories.length === 0 ? (
        <p className="muted">No categories yet.</p>
      ) : null}
      <AdSenseBanner className="adsense-banner--shop" />
      <div className="catalog-stack">
        {categories.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))}
      </div>
    </Screen>
  );
}
