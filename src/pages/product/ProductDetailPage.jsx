import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";
import { AuthPromptModal } from "../../components/auth/AuthPromptModal.jsx";
import { fetchProductById } from "../../services/catalog/index.js";
import { SiteProse } from "../../components/content/SiteProse.jsx";
import { AdSenseBanner } from "../../components/ads/AdSenseBanner.jsx";
import { SITE_NAME } from "../../constants/site.js";
import { getProductIntroText } from "../../utils/productIntro.js";
import { AddedToCartCta } from "../../components/cart/AddedToCartCta.jsx";
import { addProductToCart } from "../../services/cart/index.js";
import { useCartCount } from "../../context/CartCountContext.jsx";
import { formatCurrency } from "../../utils/format.js";
import { getReadableFetchError } from "../../utils/fetchError.js";
import { getProductImageUrlForDisplay } from "../../utils/productImage.js";
import { getAuthToken, getLoggedInUserId } from "../../utils/authSession.js";

export function ProductDetailPage() {
  const { productId } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imgFailed, setImgFailed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartSubmitting, setCartSubmitting] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { itemCount, refreshCartCount } = useCartCount();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setProduct(null);
    setImgFailed(false);
    setQuantity(1);
    setCartMessage("");
    setCartError("");
    setAuthModalOpen(false);

    fetchProductById(productId)
      .then((data) => {
        if (!cancelled) setProduct(data);
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
  }, [productId]);

  const imageSrc = product ? getProductImageUrlForDisplay(product) : "";
  const showImg = Boolean(imageSrc) && !imgFailed;
  const available = product ? Boolean(product.available) : false;
  const inv = product?.inventoryDto;

  async function handleAddToCart() {
    if (!product || !available) return;
    setCartError("");
    setCartMessage("");

    const userId = getLoggedInUserId();
    const token = getAuthToken();
    if (userId == null || !token) {
      setAuthModalOpen(true);
      return;
    }

    setCartSubmitting(true);
    try {
      await addProductToCart(userId, {
        productId: Number(product.id),
        quantity,
      });
      await refreshCartCount();
      setCartMessage("Added to cart.");
    } catch (err) {
      setCartError(getReadableFetchError(err));
    } finally {
      setCartSubmitting(false);
    }
  }

  return (
    <Screen
      title={product?.name ?? "Product"}
      metaDescription={
        product?.name
          ? `Buy ${product.name} online on ${SITE_NAME}. View price, stock, and order for home delivery.`
          : `Product details on ${SITE_NAME} — online grocery delivery.`
      }
    >
      <p className="pdp-back">
        <Link to="/categories">← Back to shop</Link>
      </p>

      {loading ? <p className="muted">Loading…</p> : null}
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error && product ? (
        <>
          <div className="pdp-hero">
            {showImg ? (
              <img
                src={imageSrc}
                alt={String(product.name ?? "Product")}
                className="pdp-hero__img"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div
                className="pdp-hero__img pdp-hero__img--placeholder"
                aria-hidden
              />
            )}
          </div>

          <AdSenseBanner className="adsense-banner--pdp" />

          <p className="pdp-price-row">
            <span className="pdp-price">
              {formatCurrency(Number(product.price) || 0, "INR")}
            </span>
            {product.unit ? (
              <span className="product-card__unit">/ {product.unit}</span>
            ) : null}
            <span
              className={`product-card__badge${available ? " product-card__badge--ok" : ""}`}
            >
              {available ? "Available" : "Unavailable"}
            </span>
          </p>

          <SiteProse className="site-prose--tight">
            {product.description ? (
              <p>{String(product.description)}</p>
            ) : null}
            <p>{getProductIntroText(product)}</p>
          </SiteProse>

          {inv && typeof inv === "object" ? (
            <dl className="pdp-inventory">
              <div>
                <dt>Stock</dt>
                <dd>{String(inv.stockQuantity ?? "—")}</dd>
              </div>
              <div>
                <dt>Reserved</dt>
                <dd>{String(inv.reservedStock ?? "—")}</dd>
              </div>
            </dl>
          ) : null}

          {available ? (
            <div className="pdp-qty">
              <span className="pdp-qty__label">Quantity</span>
              <div className="pdp-qty__controls">
                <button
                  type="button"
                  className="pdp-qty__btn"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1 || cartSubmitting}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="pdp-qty__value">{quantity}</span>
                <button
                  type="button"
                  className="pdp-qty__btn"
                  aria-label="Increase quantity"
                  disabled={cartSubmitting}
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>
          ) : null}

          {cartError ? (
            <p className="form-error" role="alert">
              {cartError}
            </p>
          ) : null}
          <button
            type="button"
            className="form-submit pdp-cart-btn"
            disabled={!available || cartSubmitting}
            onClick={handleAddToCart}
          >
            {cartSubmitting ? "Adding…" : available ? "Add to cart" : "Out of stock"}
          </button>

        </>
      ) : null}

      <AddedToCartCta
        open={Boolean(cartMessage)}
        onClose={() => setCartMessage("")}
        itemCount={itemCount}
      />

      <AuthPromptModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        returnTo={location.pathname + location.search}
        title="Sign in to add to cart"
        description="Log in or create an account to save items in your cart."
      />
    </Screen>
  );
}
