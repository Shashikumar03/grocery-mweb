import { useCallback, useEffect, useState } from "react";
import { AuthPromptModal } from "../auth/AuthPromptModal.jsx";
import { BeverageProductCard } from "./BeverageProductCard.jsx";
import { ThandaDrinkVisual } from "./ThandaDrinkVisual.jsx";
import {
  fetchCategoryById,
  getProductsFromCategory,
} from "../../services/catalog/index.js";
import { addProductToCart } from "../../services/cart/index.js";
import { useCartCount } from "../../context/CartCountContext.jsx";
import { getReadableFetchError } from "../../utils/fetchError.js";
import { getAuthToken, getLoggedInUserId } from "../../utils/authSession.js";

export const BEVERAGES_CATEGORY_ID = 5;

export function HomeThandaSection() {
  const { itemCount, refreshCartCount } = useCartCount();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);
  const [toastError, setToastError] = useState("");
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchCategoryById(BEVERAGES_CATEGORY_ID)
      .then((data) => {
        if (!cancelled) setCategory(data);
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

  const products = getProductsFromCategory(category);

  const handleAddToCart = useCallback(
    async (product) => {
      const productId = product.id ?? product.productId;
      if (productId == null) return;
      if (!product.available) return;

      const userId = getLoggedInUserId();
      const token = getAuthToken();
      if (userId == null || !token) {
        setAuthOpen(true);
        return;
      }

      setToastError("");
      setLastAddedId(null);
      setAddingId(productId);
      try {
        await addProductToCart(userId, {
          productId: Number(productId),
          quantity: 1,
        });
        await refreshCartCount();
        setLastAddedId(productId);
      } catch (err) {
        setToastError(getReadableFetchError(err));
      } finally {
        setAddingId(null);
      }
    },
    [refreshCartCount]
  );

  const sectionTitle =
    category?.name != null ? String(category.name) : "Beverages";

  return (
    <section id="thanda" className="home-thanda" aria-labelledby="home-thanda-heading">
      <div className="home-thanda__promo">
        <ThandaDrinkVisual />
        <h2 id="home-thanda-heading" className="home-thanda__title">
          Thanda
          <span className="home-thanda__hindi" lang="hi">
            ठंडा
          </span>
        </h2>
        <p className="home-thanda__tagline">
          Get <strong>Thanda</strong> without any fridge charges
        </p>
        <p className="home-thanda__tagline-hi" lang="hi">
          बिना किसी फ्रिज चार्ज के <strong>ठंडा</strong> पाएं
        </p>
        <p className="home-thanda__tagline home-thanda__tagline--delivery">
          Get <strong>delivery at your home</strong> without any extra charges
        </p>
        <p className="home-thanda__tagline-hi" lang="hi">
          <strong>घर पर डिलीवरी</strong> पाएं, बिना किसी अतिरिक्त शुल्क के
        </p>
      </div>

      <h3 className="home-thanda__aisle">{sectionTitle}</h3>

      {loading ? <p className="muted">Loading drinks…</p> : null}
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      {toastError ? (
        <p className="form-error" role="alert">
          {toastError}
        </p>
      ) : null}

      {!loading && !error && products.length === 0 ? (
        <p className="muted">No beverages available right now.</p>
      ) : null}

      {!loading && !error && products.length > 0 ? (
        <div className="home-thanda__grid">
          {products.map((p) => {
            const pid = p.id ?? p.productId;
            return (
              <BeverageProductCard
                key={pid}
                product={p}
                onAddToCart={handleAddToCart}
                adding={addingId === pid}
                justAdded={lastAddedId === pid}
                cartItemCount={itemCount}
                onDismissCartCta={() => setLastAddedId(null)}
              />
            );
          })}
        </div>
      ) : null}

      <AuthPromptModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        returnTo="/"
        title="Sign in to add to cart"
        description="Log in to add chilled drinks to your cart."
      />
    </section>
  );
}
