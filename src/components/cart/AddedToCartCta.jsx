import { Link } from "react-router-dom";

/**
 * @param {{
 *   compact?: boolean;
 *   itemCount?: number;
 *   onDismiss?: () => void;
 *   className?: string;
 * }} props
 */
export function AddedToCartCta({
  compact = false,
  itemCount = 0,
  onDismiss,
  className = "",
}) {
  const cartLabel =
    itemCount > 0 ? `View cart (${itemCount})` : "View cart";

  return (
    <div
      className={`added-to-cart-cta${compact ? " added-to-cart-cta--compact" : ""}${className ? ` ${className}` : ""}`}
      role="status"
    >
      <p className="added-to-cart-cta__message">
        <span className="added-to-cart-cta__check" aria-hidden>
          ✓
        </span>
        Added to cart
      </p>
      <div className="added-to-cart-cta__actions">
        <Link to="/cart" className="added-to-cart-cta__btn">
          {cartLabel}
        </Link>
        {onDismiss ? (
          <button
            type="button"
            className="added-to-cart-cta__dismiss"
            onClick={onDismiss}
          >
            Continue shopping
          </button>
        ) : null}
      </div>
    </div>
  );
}
