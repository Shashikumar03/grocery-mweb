import { useState } from "react";
import { formatCurrency } from "../../utils/format.js";
import { getProductImageUrlForDisplay } from "../../utils/productImage.js";

/**
 * @param {{
 *   item: Record<string, unknown>;
 *   onQuantityChange?: (action: "add" | "dec") => void;
 *   onRemove?: () => void;
 *   lineBusy?: boolean;
 * }} props
 */
export function CartLineItem({
  item,
  onQuantityChange,
  onRemove,
  lineBusy = false,
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const qty = Number(item.quantity) || 0;
  const linePrice = Number(item.price) || 0;
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
  const canRemove = typeof onRemove === "function";

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
        {canChangeQty ? null : (
          <p className="cart-line__meta muted">Qty: {qty}</p>
        )}
        {canChangeQty || canRemove ? (
          <div className="cart-line__actions">
            {canChangeQty ? (
              <div className="cart-line__qty" aria-label={`Quantity for ${name}`}>
                <button
                  type="button"
                  className="cart-line__qty-btn"
                  aria-label="Decrease quantity"
                  disabled={lineBusy || qty <= 0}
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
                  disabled={lineBusy}
                  onClick={() => onQuantityChange("add")}
                >
                  +
                </button>
              </div>
            ) : null}
            {canRemove ? (
              <button
                type="button"
                className="cart-line__remove"
                aria-label={`Remove ${name} from cart`}
                disabled={lineBusy}
                onClick={onRemove}
              >
                Remove
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      <p className="cart-line__total">{formatCurrency(linePrice, "INR")}</p>
    </article>
  );
}
