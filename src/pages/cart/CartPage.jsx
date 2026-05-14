import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";
import { CartPageShimmer } from "../../components/common/Shimmer.jsx";
import { CartLineItem } from "../../components/cart/CartLineItem.jsx";
import { OrderTrackingOverlay } from "../../components/cart/OrderTrackingOverlay.jsx";
import { fetchDeliveryAddresses, getDeliveryAddressId } from "../../services/address/index.js";
import { fetchCart } from "../../services/cart/index.js";
import { placeOrder } from "../../services/order/index.js";
import { useCartCount } from "../../context/CartCountContext.jsx";
import { formatCurrency } from "../../utils/format.js";
import { getReadableFetchError } from "../../utils/fetchError.js";
import { getAuthToken, getLoggedInUserId } from "../../utils/authSession.js";

/** `paymentMode` query for POST /api/place-order/{userId}/{addressId}?paymentMode=… */
const PAYMENT_OPTIONS = [
  {
    id: "cod",
    paymentMode: "CASH_ON_DELIVERY",
    label: "Cash on delivery",
    hint: "Pay when you receive",
  },
  { id: "upi", paymentMode: "UPI", label: "UPI", hint: "Google Pay, PhonePe, Paytm…" },
  {
    id: "card",
    paymentMode: "CARD",
    label: "Debit / credit card",
    hint: "Visa, Mastercard, RuPay",
  },
  {
    id: "netbanking",
    paymentMode: "NET_BANKING",
    label: "Net banking",
    hint: "Your bank’s secure page",
  },
];

function formatAddressOneLine(row) {
  const parts = [row.address, row.city, row.state, row.pin]
    .filter(Boolean)
    .map((x) => String(x).trim())
    .filter(Boolean);
  return parts.join(", ") || "Address";
}

const DELIVERY_ETA_MINUTES = 20;

/** @param {unknown} v */
function formatOrderTimeLabel(v) {
  if (v == null) return "";
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

/**
 * Prefer a wrapped DTO only when it clearly looks like the order (has id / orderId).
 * Avoids treating empty `order: {}` or unrelated objects as the root and losing fields.
 * @param {unknown} parsed
 */
function unwrapOrderRoot(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return parsed;
  const r = /** @type {Record<string, unknown>} */ (parsed);
  const candidates = [r.data, r.order, r.body];
  for (const inner of candidates) {
    if (
      inner &&
      typeof inner === "object" &&
      !Array.isArray(inner) &&
      (inner.orderId != null || inner.id != null)
    ) {
      return inner;
    }
  }
  return parsed;
}

/** @param {unknown} parsed */
function pickFromOrderResponse(parsed) {
  const root = unwrapOrderRoot(parsed);
  if (!root || typeof root !== "object" || Array.isArray(root)) {
    return {
      orderId: null,
      orderStatus: "",
      paymentMode: "",
      orderTimeLabel: "",
    };
  }
  const o = /** @type {Record<string, unknown>} */ (root);
  const idVal = o.orderId ?? o.id ?? o.order_id;
  let orderId = null;
  if (idVal != null && idVal !== "") {
    const n = Number(idVal);
    orderId = Number.isFinite(n) ? n : String(idVal);
  }
  const statusRaw = o.orderStatus ?? o.status;
  const orderStatus = statusRaw != null ? String(statusRaw) : "";
  const pay = o.payment ?? o.paymentDto;
  const nestedMode =
    pay && typeof pay === "object" && !Array.isArray(pay)
      ? /** @type {Record<string, unknown>} */ (pay).paymentMode
      : null;
  const modeRaw = o.paymentMode ?? nestedMode;
  const paymentMode = modeRaw != null ? String(modeRaw) : "";
  const timeRaw = o.orderTime ?? o.createdAt ?? o.orderDate;
  return {
    orderId,
    orderStatus,
    paymentMode,
    orderTimeLabel: formatOrderTimeLabel(timeRaw),
  };
}

/** Line items from place-order JSON (`cartDto.cartItemsDto`). */
function cartItemsFromPlaceOrderResponse(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const c = /** @type {Record<string, unknown>} */ (parsed).cartDto;
  if (c && typeof c === "object" && !Array.isArray(c) && Array.isArray(c.cartItemsDto)) {
    return c.cartItemsDto.map((row) =>
      row && typeof row === "object" && !Array.isArray(row)
        ? { .../** @type {Record<string, unknown>} */ (row) }
        : {}
    );
  }
  return null;
}

/** Total from place-order `cartDto.cartTotalPrice`. */
function cartTotalFromPlaceOrderResponse(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const c = /** @type {Record<string, unknown>} */ (parsed).cartDto;
  if (c && typeof c === "object" && !Array.isArray(c) && c.cartTotalPrice != null) {
    const n = Number(c.cartTotalPrice);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Flat address fields on the order DTO. */
function formatAddressFromOrderResponse(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return "";
  return formatAddressOneLine(/** @type {Record<string, unknown>} */ (parsed));
}

export function CartPage() {
  const navigate = useNavigate();
  const { syncCartFromResponse } = useCartCount();
  const userId = getLoggedInUserId();
  const token = getAuthToken();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState("");

  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressesError, setAddressesError] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [payment, setPayment] = useState("cod");

  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [trackingDetails, setTrackingDetails] = useState(null);

  const loadCart = useCallback(async () => {
    if (userId == null) {
      setCart(null);
      setLoading(false);
      setError("");
      syncCartFromResponse(null);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchCart(userId);
      setCart(data);
      syncCartFromResponse(data);
    } catch (err) {
      setCart(null);
      syncCartFromResponse(null);
      setError(getReadableFetchError(err));
    } finally {
      setLoading(false);
    }
  }, [userId, syncCartFromResponse]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const loadAddresses = useCallback(async () => {
    if (userId == null) {
      setAddresses([]);
      setAddressesError("");
      setSelectedAddressId(null);
      return;
    }
    setAddressesLoading(true);
    setAddressesError("");
    try {
      const list = await fetchDeliveryAddresses(userId);
      setAddresses(list);
      setSelectedAddressId((prev) => {
        const ids = list
          .map((row) => getDeliveryAddressId(row))
          .filter((id) => id != null);
        if (prev != null && ids.includes(prev)) return prev;
        return ids[0] ?? null;
      });
    } catch (err) {
      setAddresses([]);
      setSelectedAddressId(null);
      setAddressesError(getReadableFetchError(err));
    } finally {
      setAddressesLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handlePlaceOrder = useCallback(async () => {
    setOrderError("");
    if (userId == null) return;
    if (!token) {
      setOrderError("Sign in again to place an order.");
      return;
    }
    if (selectedAddressId == null) {
      setOrderError("Choose a delivery address.");
      return;
    }
    const opt = PAYMENT_OPTIONS.find((o) => o.id === payment);
    const paymentMode = opt?.paymentMode ?? "CASH_ON_DELIVERY";
    const addressRow = addresses.find((r) => getDeliveryAddressId(r) === selectedAddressId);
    const addressLine = addressRow ? formatAddressOneLine(addressRow) : "";
    const paymentLabel = opt?.label ?? "";
    const itemsCopy = Array.isArray(cart?.cartItemsDto)
      ? cart.cartItemsDto.map((row) => ({ ...row }))
      : [];
    const total =
      cart?.cartTotalPrice != null ? Number(cart.cartTotalPrice) : null;

    setOrderSubmitting(true);
    try {
      const parsed = await placeOrder(userId, selectedAddressId, paymentMode);
      const fromApi = pickFromOrderResponse(parsed);
      const apiItems = cartItemsFromPlaceOrderResponse(parsed);
      const apiTotal = cartTotalFromPlaceOrderResponse(parsed);
      const addressFromApi = formatAddressFromOrderResponse(parsed);
      const lineItems =
        apiItems && apiItems.length > 0 ? apiItems : itemsCopy;
      const lineTotal =
        apiTotal != null
          ? apiTotal
          : total != null && Number.isFinite(total)
            ? total
            : null;

      setTrackingDetails({
        ...fromApi,
        addressLine: addressFromApi || addressLine,
        paymentLabel,
        items: lineItems,
        total: lineTotal,
      });

      try {
        await loadCart();
        await loadAddresses();
      } catch {
        /* cart/address refresh is best-effort; tracking overlay already shown */
      }
    } catch (err) {
      setOrderError(getReadableFetchError(err));
    } finally {
      setOrderSubmitting(false);
    }
  }, [
    userId,
    token,
    selectedAddressId,
    payment,
    cart,
    addresses,
    loadCart,
    loadAddresses,
  ]);

  const handleCloseTracking = useCallback(() => {
    setTrackingDetails(null);
    navigate("/", { replace: true });
  }, [navigate]);

  const items = Array.isArray(cart?.cartItemsDto) ? cart.cartItemsDto : [];
  const total =
    cart?.cartTotalPrice != null ? Number(cart.cartTotalPrice) : null;
  const discount =
    cart?.discountAmount != null ? Number(cart.discountAmount) : 0;
  const status = cart?.status != null ? String(cart.status) : "";

  return (
    <Screen title="Cart">
      {trackingDetails ? (
        <OrderTrackingOverlay
          orderId={trackingDetails.orderId}
          orderStatus={trackingDetails.orderStatus}
          paymentMode={trackingDetails.paymentMode}
          orderTimeLabel={trackingDetails.orderTimeLabel}
          addressLine={trackingDetails.addressLine}
          paymentLabel={trackingDetails.paymentLabel}
          items={trackingDetails.items}
          total={trackingDetails.total}
          deliveryMinutes={DELIVERY_ETA_MINUTES}
          onClose={handleCloseTracking}
        />
      ) : null}
      {userId == null ? (
        <>
          <p className="muted">Log in to view your cart and pay.</p>
          <p className="account-actions">
            <Link to="/auth/login" state={{ from: "/cart" }} className="account-actions__primary">
              Log in
            </Link>
          </p>
        </>
      ) : null}

      {userId != null && loading ? (
        <>
          <p className="sr-only" aria-live="polite">
            Loading your cart…
          </p>
          <CartPageShimmer />
        </>
      ) : null}
      {userId != null && error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      {userId != null && !loading && !error && cart ? (
        <>
          {status ? (
            <p className="cart-status muted">
              Status: <strong>{status}</strong>
            </p>
          ) : null}

          {items.length === 0 ? (
            <p className="muted">Your cart is empty.</p>
          ) : (
            <div className="cart-lines">{items.map((it) => (
              <CartLineItem key={it.cartItemId ?? it.productId} item={it} />
            ))}</div>
          )}

          {items.length > 0 ? (
            <div className="cart-summary">
              {discount > 0 ? (
                <p className="cart-summary__row">
                  <span>Discount</span>
                  <span>−{formatCurrency(discount, "INR")}</span>
                </p>
              ) : null}
              <p className="cart-summary__row cart-summary__row--total">
                <span>Total</span>
                <span>
                  {total != null && Number.isFinite(total)
                    ? formatCurrency(total, "INR")
                    : "—"}
                </span>
              </p>
            </div>
          ) : null}

          {items.length > 0 ? (
            <section className="cart-pay" aria-labelledby="addr-heading">
              <h2 id="addr-heading" className="cart-pay__title">
                Deliver to
              </h2>
              <p className="muted cart-pay__intro">
                Select the address for this order.
              </p>
              {addressesLoading ? (
                <p className="muted">Loading addresses…</p>
              ) : null}
              {addressesError ? (
                <p className="form-error" role="alert">
                  {addressesError}
                </p>
              ) : null}
              {!addressesLoading && !addressesError && addresses.length === 0 ? (
                <p className="muted">
                  No saved addresses.{" "}
                  <Link to="/account/addresses" className="cart-inline-link">
                    Add an address
                  </Link>
                </p>
              ) : null}
              {!addressesLoading && addresses.length > 0 ? (
                <div className="cart-address-select-wrap">
                  <select
                    id="cart-delivery-address"
                    className="cart-address-select"
                    aria-labelledby="addr-heading"
                    value={selectedAddressId != null ? String(selectedAddressId) : ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      const n = Number(v);
                      setSelectedAddressId(v === "" || !Number.isFinite(n) ? null : n);
                    }}
                  >
                    {addresses
                      .map((row) => ({ row, id: getDeliveryAddressId(row) }))
                      .filter((x) => x.id != null)
                      .map(({ row, id }) => (
                        <option key={id} value={String(id)}>
                          {formatAddressOneLine(row)}
                        </option>
                      ))}
                  </select>
                </div>
              ) : null}
              {!addressesLoading && addresses.length > 0 ? (
                <p className="muted cart-pay__note">
                  <Link to="/account/addresses" className="cart-inline-link">
                    Manage addresses
                  </Link>
                </p>
              ) : null}
            </section>
          ) : null}

          {items.length > 0 ? (
            <section className="cart-pay" aria-labelledby="pay-heading">
              <h2 id="pay-heading" className="cart-pay__title">
                Payment
              </h2>
              <p className="muted cart-pay__intro">Choose how you would like to pay.</p>
              <ul className="cart-pay__list" role="radiogroup" aria-label="Payment method">
                {PAYMENT_OPTIONS.map((opt) => (
                  <li key={opt.id}>
                    <label
                      className={`cart-pay__option${payment === opt.id ? " cart-pay__option--selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={opt.id}
                        checked={payment === opt.id}
                        onChange={() => setPayment(opt.id)}
                      />
                      <span className="cart-pay__option-body">
                        <span className="cart-pay__option-label">{opt.label}</span>
                        <span className="cart-pay__option-hint muted">{opt.hint}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              {orderError ? (
                <p className="form-error" role="alert">
                  {orderError}
                </p>
              ) : null}
              <button
                type="button"
                className="form-submit cart-pay__cta"
                disabled={
                  orderSubmitting ||
                  addressesLoading ||
                  selectedAddressId == null ||
                  addresses.length === 0
                }
                onClick={() => void handlePlaceOrder()}
              >
                {orderSubmitting ? "Placing order…" : "Place order"}
              </button>
              <p className="muted cart-pay__note">
                Paying with{" "}
                <strong>{PAYMENT_OPTIONS.find((o) => o.id === payment)?.label}</strong> to the
                selected address.
              </p>
            </section>
          ) : null}

          <p className="cart-refresh muted">
            <button
              type="button"
              className="cart-refresh__btn"
              onClick={() => {
                void loadCart();
                void loadAddresses();
              }}
            >
              Refresh cart
            </button>
          </p>
        </>
      ) : null}
    </Screen>
  );
}
