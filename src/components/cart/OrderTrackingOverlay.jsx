import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CartLineItem } from "./CartLineItem.jsx";
import { formatCurrency } from "../../utils/format.js";

/** @param {Record<string, unknown>} item */
function lineItemForCartRow(item) {
  const p =
    item.product && typeof item.product === "object" && !Array.isArray(item.product)
      ? /** @type {Record<string, unknown>} */ (item.product)
      : null;
  return {
    ...item,
    productName: item.productName ?? p?.name,
    price: item.price ?? p?.price,
    imageUrl: item.imageUrl ?? p?.imageUrl ?? p?.imageURL,
  };
}

/**
 * @param {{
 *   orderId: string | number | null;
 *   orderStatus: string;
 *   paymentMode: string;
 *   orderTimeLabel: string;
 *   addressLine: string;
 *   paymentLabel: string;
 *   items: Array<Record<string, unknown>>;
 *   total: number | null;
 *   deliveryMinutes: number;
 *   onClose: () => void;
 * }} props
 */
export function OrderTrackingOverlay({
  orderId,
  orderStatus,
  paymentMode,
  orderTimeLabel,
  addressLine,
  paymentLabel,
  items,
  total,
  deliveryMinutes,
  onClose,
}) {
  const safeItems = Array.isArray(items) ? items : [];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const content = (
    <div
      className="order-tracking-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-tracking-title"
    >
      <div className="order-tracking-overlay__panel">
        <div className="order-tracking-overlay__head">
          <h2 id="order-tracking-title" className="order-tracking-overlay__title">
            Order confirmed
          </h2>
          <button
            type="button"
            className="order-tracking-overlay__close"
            onClick={onClose}
            aria-label="Close and go home"
          >
            Close
          </button>
        </div>

        <p className="order-tracking-overlay__eta">
          Estimated delivery in <strong>{deliveryMinutes} minutes</strong>
        </p>

        <div className="order-tracking-overlay__summary">
          <dl className="order-tracking-overlay__dl">
            {orderId != null ? (
              <div className="order-tracking-overlay__row">
                <dt>Order</dt>
                <dd>#{orderId}</dd>
              </div>
            ) : null}
            {orderStatus ? (
              <div className="order-tracking-overlay__row">
                <dt>Status</dt>
                <dd>{orderStatus}</dd>
              </div>
            ) : null}
            {orderTimeLabel ? (
              <div className="order-tracking-overlay__row">
                <dt>Placed</dt>
                <dd>{orderTimeLabel}</dd>
              </div>
            ) : null}
            <div className="order-tracking-overlay__row">
              <dt>Payment</dt>
              <dd>
                {paymentLabel ? (
                  <>
                    {paymentLabel}
                    {paymentMode && paymentMode !== paymentLabel ? (
                      <span className="muted order-tracking-overlay__sub">
                        {" "}
                        · {paymentMode}
                      </span>
                    ) : null}
                  </>
                ) : (
                  paymentMode || "—"
                )}
              </dd>
            </div>
            {addressLine ? (
              <div className="order-tracking-overlay__row">
                <dt>Deliver to</dt>
                <dd>{addressLine}</dd>
              </div>
            ) : null}
            {total != null && Number.isFinite(total) ? (
              <div className="order-tracking-overlay__row order-tracking-overlay__row--total">
                <dt>Total</dt>
                <dd>{formatCurrency(total, "INR")}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        {safeItems.length > 0 ? (
          <div className="order-tracking-overlay__items">
            <h3 className="order-tracking-overlay__items-title">Items</h3>
            <div className="order-tracking-overlay__lines">
              {safeItems.map((it, i) => (
                <CartLineItem
                  key={it.cartItemId ?? it.productId ?? i}
                  item={lineItemForCartRow(it)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
