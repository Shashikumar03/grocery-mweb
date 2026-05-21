import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SiteProse } from "../../components/content/SiteProse.jsx";
import { AdSenseBanner } from "../../components/ads/AdSenseBanner.jsx";
import { SITE_NAME } from "../../constants/site.js";
import { getCategoryIntroText } from "../../utils/categoryIntro.js";
import { CategoryProductCard } from "../../components/categories/CategoryProductCard.jsx";
import { Screen } from "../../components/common/Screen.jsx";
import { ShopPageShimmer } from "../../components/common/Shimmer.jsx";
import {
  fetchCategoryById,
  getProductsFromCategory,
} from "../../services/catalog/index.js";
import { getReadableFetchError } from "../../utils/fetchError.js";

export function CategoryDetailPage() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!categoryId) {
      setCategory(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchCategoryById(categoryId)
      .then((data) => {
        if (!cancelled) setCategory(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setCategory(null);
          setError(getReadableFetchError(err));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  const products = getProductsFromCategory(category);
  const title =
    category?.name != null ? String(category.name) : `Category ${categoryId ?? ""}`;

  return (
    <Screen
      title={title}
      metaDescription={`Shop ${title} online on ${SITE_NAME}. ${products.length} products with prices and home delivery.`}
    >
      <p className="pdp-back">
        <Link to="/categories">← All categories</Link>
      </p>

      {loading ? <ShopPageShimmer /> : null}
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error && category ? (
        <>
          <SiteProse className="site-prose--tight">
            <p>{getCategoryIntroText(category)}</p>
          </SiteProse>

          {products.length === 0 ? (
            <p className="muted">No products in this category right now.</p>
          ) : (
            <div className="catalog-grid">
              {products.map((p) => (
                <CategoryProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <AdSenseBanner className="adsense-banner--shop" />
        </>
      ) : null}
    </Screen>
  );
}
