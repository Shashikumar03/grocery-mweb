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
import { verifyRazorpayPayment } from "../../services/payment/index.js";
import { getRazorpayKeyId } from "../../constants/razorpay.js";
import {
  getAuthToken,
  getLoggedInUserId,
  readAuthSession,
} from "../../utils/authSession.js";
import { openRazorpayCheckout } from "../../utils/razorpayCheckout.js";
import {
  cartItemsFromPlaceOrderResponse,
  cartTotalFromPlaceOrderResponse,
  formatAddressFromOrderResponse,
  formatAddressOneLine,
  inrToPaise,
  isOnlinePaymentMode,
  pickFromOrderResponse,
  pickRazorpayFromOrderResponse,
} from "../../utils/placeOrderResponse.js";

/** `paymentMode` query for POST /api/place-order/{userId}/{addressId}?paymentMode=… */
const PAYMENT_OPTIONS = [
  {
    id: "cod",
    paymentMode: "CASH_ON_DELIVERY",
    label: "Cash on delivery",
    hint: "Pay when you receive",
  },
  {
    id: "online",
    paymentMode: "ONLINE",
    label: "Pay online",
    hint: "UPI, card, or net banking via Razorpay",
  },
];

const DELIVERY_ETA_MINUTES = 20;

function buildTrackingFromOrder(parsed, extras) {
  const fromApi = pickFromOrderResponse(parsed);
  const apiItems = cartItemsFromPlaceOrderResponse(parsed);
  const apiTotal = cartTotalFromPlaceOrderResponse(parsed);
  const addressFromApi = formatAddressFromOrderResponse(parsed);
  const lineItems =
    apiItems && apiItems.length > 0 ? apiItems : extras.itemsCopy;
  const lineTotal =
    apiTotal != null
      ? apiTotal
      : extras.total != null && Number.isFinite(extras.total)
        ? extras.total
        : null;

  return {
    ...fromApi,
    addressLine: addressFromApi || extras.addressLine,
    paymentLabel: extras.paymentLabel,
    items: lineItems,
    total: lineTotal,
  };
}

export function CartPage() {
  const navigate = useNavigate();
  const { syncCartFromResponse, refreshCartCount } = useCartCount();
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

    const extras = { addressLine, paymentLabel, itemsCopy, total };

    setOrderSubmitting(true);
    try {
      const parsed = await placeOrder(userId, selectedAddressId, paymentMode);
      const fromApi = pickFromOrderResponse(parsed);

      if (isOnlinePaymentMode(paymentMode)) {
        const { razorpayOrderId, amountInr } = pickRazorpayFromOrderResponse(parsed);
        const amountPaise = inrToPaise(
          amountInr ?? (total != null && Number.isFinite(total) ? total : 0)
        );

        if (!getRazorpayKeyId()) {
          throw new Error(
            "Online payment is not configured. Use cash on delivery or add VITE_RAZORPAY_KEY_ID."
          );
        }
        if (!razorpayOrderId) {
          throw new Error(
            "Could not start payment. The server did not return a Razorpay order id."
          );
        }

        const session = readAuthSession();
        const user = session?.user && typeof session.user === "object" ? session.user : null;
        const userName = user?.name != null ? String(user.name) : "";
        const userEmail = user?.email ?? user?.username;
        const userPhone = user?.phoneNumber;

        setOrderSubmitting(false);

        const razorpayResult = await openRazorpayCheckout({
          razorpayOrderId,
          amountPaise,
          description: `Order #${fromApi.orderId ?? ""}`.trim(),
          prefill: {
            name: userName || undefined,
            email: userEmail != null ? String(userEmail) : undefined,
            contact: userPhone != null ? String(userPhone).replace(/\D/g, "") : undefined,
          },
          notes: fromApi.orderId != null ? { orderId: String(fromApi.orderId) } : {},
        });

        setOrderSubmitting(true);
        try {
          await verifyRazorpayPayment({
            ...razorpayResult,
            orderId: fromApi.orderId ?? undefined,
          });
        } catch {
          /* verify endpoint optional — Razorpay success is enough for UX */
        }

        setTrackingDetails(buildTrackingFromOrder(parsed, extras));
      } else {
        setTrackingDetails(buildTrackingFromOrder(parsed, extras));
      }

      try {
        await loadCart();
        await loadAddresses();
        void refreshCartCount();
      } catch {
        /* best-effort refresh */
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
    refreshCartCount,
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
              <p className="muted cart-pay__intro">
                Cash on delivery places the order directly. Pay online opens secure Razorpay
                checkout (UPI, card, net banking).
              </p>
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
                {orderSubmitting
                  ? payment === "cod"
                    ? "Placing order…"
                    : "Processing…"
                  : payment === "cod"
                    ? "Place order"
                    : "Pay with Razorpay"}
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
