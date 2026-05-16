import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

export const ADDED_TO_CART_AUTO_CLOSE_MS = 2000;

/**
 * @param {{
 *   open: boolean;
 *   onClose: () => void;
 *   itemCount?: number;
 *   autoCloseMs?: number;
 * }} props
 */
export function AddedToCartCta({
  open,
  onClose,
  itemCount = 0,
  autoCloseMs = ADDED_TO_CART_AUTO_CLOSE_MS,
}) {
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);

    const timer = window.setTimeout(onClose, autoCloseMs);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [open, onClose, autoCloseMs]);

  if (!open) return null;

  const cartLabel =
    itemCount > 0 ? `View cart (${itemCount})` : "View cart";
  const closeSeconds = Math.max(1, Math.round(autoCloseMs / 1000));

  return createPortal(
    <div
      className="modal-root added-to-cart-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="added-to-cart-title"
    >
      <button
        type="button"
        className="modal-backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className="modal-card added-to-cart-modal__card"
        style={{ "--added-to-cart-ms": `${autoCloseMs}ms` }}
      >
        <div className="added-to-cart-modal__progress" aria-hidden>
          <span className="added-to-cart-modal__progress-bar" />
        </div>
        <p className="added-to-cart-modal__icon" aria-hidden>
          ✓
        </p>
        <h2 id="added-to-cart-title" className="modal-card__title">
          Added to cart
        </h2>
        <p className="modal-card__desc muted">
          Closes automatically in {closeSeconds} seconds.
        </p>
        <div className="modal-card__actions">
          <Link
            to="/cart"
            className="modal-card__primary"
            onClick={onClose}
          >
            {cartLabel}
          </Link>
          <button
            type="button"
            className="modal-card__dismiss"
            onClick={onClose}
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
