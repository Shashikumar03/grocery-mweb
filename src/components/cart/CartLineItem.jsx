import { useState } from "react";
import { formatCurrency } from "../../utils/format.js";
import { getProductImageUrlForDisplay } from "../../utils/productImage.js";

/**
 * @param {{
 *   item: Record<string, unknown>;
 *   onQuantityChange?: (action: "add" | "dec") => void;
 *   quantityUpdating?: boolean;
 * }} props
 */
export function CartLineItem({ item, onQuantityChange, quantityUpdating = false }) {
  const [imgFailed, setImgFailed] = useState(false);
  const qty = Number(item.quantity) || 0;
  const unit = Number(item.price) || 0;
  const lineTotal = unit * qty;
  const rawUrl =
    typeof item.imageUrl === "string"
      ? item.imageUrl
      : typeof item.imageURL === "string"
        ? item.imageURL
        : "";
  const imageSrc = getProductImageUrlForDisplay({
    imageUrl: rawUrl,
  });
  const showImg = Boolean(imageSrc) && !imgFailed;
  const name = String(item.productName ?? "Item");
  const canChangeQty = typeof onQuantityChange === "function";

  return (
    <article className="cart-line">
      <div className="cart-line__media">
        {showImg ? (
          <img
            src={imageSrc}
            alt={name}
            className="cart-line__img"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="cart-line__img cart-line__img--ph" aria-hidden />
        )}
      </div>
      <div className="cart-line__body">
        <h3 className="cart-line__name">{name}</h3>
        <p className="cart-line__meta muted">{formatCurrency(unit, "INR")} each</p>
        {canChangeQty ? (
          <div className="cart-line__qty" aria-label={`Quantity for ${name}`}>
            <button
              type="button"
              className="cart-line__qty-btn"
              aria-label="Decrease quantity"
              disabled={quantityUpdating || qty <= 0}
              onClick={() => onQuantityChange("dec")}
            >
              −
            </button>
            <span className="cart-line__qty-value" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              className="cart-line__qty-btn"
              aria-label="Increase quantity"
              disabled={quantityUpdating}
              onClick={() => onQuantityChange("add")}
            >
              +
            </button>
          </div>
        ) : (
          <p className="cart-line__meta muted">Qty: {qty}</p>
        )}
      </div>
      <p className="cart-line__total">{formatCurrency(lineTotal, "INR")}</p>
    </article>
  );
}
