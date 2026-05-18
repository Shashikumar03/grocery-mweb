import { useEffect, useState } from "react";
import { Screen } from "../../components/common/Screen.jsx";
import { ShopPageShimmer } from "../../components/common/Shimmer.jsx";
import { AdSenseBanner } from "../../components/ads/AdSenseBanner.jsx";
import { CategorySection } from "../../components/categories/CategorySection.jsx";
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
    <Screen title="Shop">
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
