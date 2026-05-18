import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";
import { CartPageShimmer } from "../../components/common/Shimmer.jsx";
import { AlertModal } from "../../components/common/AlertModal.jsx";
import { CartLineItem } from "../../components/cart/CartLineItem.jsx";
import { OrderTrackingOverlay } from "../../components/cart/OrderTrackingOverlay.jsx";
import { fetchDeliveryAddresses, getDeliveryAddressId } from "../../services/address/index.js";
import {
  fetchCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../../services/cart/index.js";
import { placeOrder } from "../../services/order/index.js";
import { useCartCount } from "../../context/CartCountContext.jsx";
import { formatCurrency } from "../../utils/format.js";
import { getReadableFetchError } from "../../utils/fetchError.js";
import { updatePayment, verifyRazorpayPayment } from "../../services/payment/index.js";
import { getRazorpayKeyId } from "../../constants/razorpay.js";
import {
  getAuthToken,
  getLoggedInUserId,
  readAuthSession,
} from "../../utils/authSession.js";
import { openCheckoutWithRetry } from "../../utils/openCheckoutWithRetry.js";
import { loadRazorpayScript } from "../../utils/loadRazorpayScript.js";
import {
  PAYMENT_MODE_CASH_ON_DELIVERY,
  PAYMENT_MODE_ONLINE,
} from "../../constants/paymentModes.js";
import {
  cartItemsFromPlaceOrderResponse,
  cartTotalFromPlaceOrderResponse,
  formatAddressFromOrderResponse,
  formatAddressOneLine,
  inrToPaise,
  isCashOnDeliveryMode,
  pickFromOrderResponse,
  pickRazorpayFromOrderResponse,
} from "../../utils/placeOrderResponse.js";
import { normalizeCart, sortCartItems } from "../../utils/cartItems.js";

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
  const [paymentMode, setPaymentMode] = useState(PAYMENT_MODE_ONLINE);

  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [trackingDetails, setTrackingDetails] = useState(null);
  const [qtyUpdatingId, setQtyUpdatingId] = useState(null);
  const [removingProductId, setRemovingProductId] = useState(null);
  const [qtyError, setQtyError] = useState("");

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

  useEffect(() => {
    if (userId != null && getRazorpayKeyId()) {
      loadRazorpayScript().catch(() => {
        /* optional preload */
      });
    }
  }, [userId]);

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
    const cartLines = Array.isArray(cart?.cartItemsDto) ? cart.cartItemsDto : [];
    if (cartLines.length === 0) {
      setOrderError("Your cart is empty. Add products, then tap Pay now.");
      return;
    }
    const addressRow = addresses.find((r) => getDeliveryAddressId(r) === selectedAddressId);
    const addressLine = addressRow ? formatAddressOneLine(addressRow) : "";
    const isCod = isCashOnDeliveryMode(paymentMode);
    const paymentLabel = isCod ? "Cash on delivery" : "Pay online";
    const itemsCopy = cartLines.map((row) => ({ ...row }));
    const total =
      cart?.cartTotalPrice != null ? Number(cart.cartTotalPrice) : null;

    const extras = { addressLine, paymentLabel, itemsCopy, total };

    setOrderSubmitting(true);
    try {
      const parsed = await placeOrder(userId, selectedAddressId, paymentMode);
      const fromApi = pickFromOrderResponse(parsed);

      if (isCod) {
        setTrackingDetails(buildTrackingFromOrder(parsed, extras));
        try {
          const data = await fetchCart(userId, { clearSessionOn401: false });
          setCart(data);
          syncCartFromResponse(data);
        } catch {
          /* best-effort refresh */
        }
        return;
      }

      const { razorpayOrderId, amountInr } = pickRazorpayFromOrderResponse(parsed);
      const amountPaise = inrToPaise(
        amountInr ?? (total != null && Number.isFinite(total) ? total : 0)
      );

      if (!getRazorpayKeyId()) {
        throw new Error(
          "Online payment is not configured. Add VITE_RAZORPAY_KEY_ID to your environment."
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

      await loadRazorpayScript();

      const razorpayResult = await openCheckoutWithRetry({
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

      setTrackingDetails(buildTrackingFromOrder(parsed, extras));

      try {
        await updatePayment(
          razorpayResult.razorpay_order_id,
          "COMPLETED",
          razorpayResult.razorpay_payment_id
        );
      } catch {
        try {
          await verifyRazorpayPayment({
            ...razorpayResult,
            orderId: fromApi.orderId ?? undefined,
          });
        } catch {
          /* Razorpay paid; webhook at /api/webhook may still update backend */
        }
      }

      try {
        const data = await fetchCart(userId, { clearSessionOn401: false });
        setCart(data);
        syncCartFromResponse(data);
      } catch {
        /* best-effort refresh */
      }
    } catch (err) {
      const msg = getReadableFetchError(err);
      setOrderError(
        msg.includes("cancelled")
          ? msg
          : `${msg} If your cart looks empty, add items again and tap Pay now.`
      );
      try {
        await loadCart();
        void refreshCartCount();
      } catch {
        /* ignore */
      }
    } finally {
      setOrderSubmitting(false);
    }
  }, [
    userId,
    token,
    selectedAddressId,
    paymentMode,
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

  const applyCartResponse = useCallback(
    (data) => {
      const normalized = normalizeCart(data);
      if (normalized && typeof normalized === "object" && !Array.isArray(normalized)) {
        const o = /** @type {Record<string, unknown>} */ (normalized);
        if (Array.isArray(o.cartItemsDto)) {
          setCart(normalized);
          syncCartFromResponse(normalized);
          return;
        }
        if (o.cartDto && typeof o.cartDto === "object" && !Array.isArray(o.cartDto)) {
          const cartDto = normalizeCart(o.cartDto);
          setCart(cartDto);
          syncCartFromResponse(cartDto);
        }
      }
    },
    [syncCartFromResponse]
  );

  const handleCartItemQuantity = useCallback(
    async (cartItemId, action) => {
      if (userId == null || cartItemId == null) return;
      setQtyError("");
      setQtyUpdatingId(cartItemId);
      try {
        const parsed = await updateCartItemQuantity(cartItemId, action);
        applyCartResponse(parsed);
        try {
          const data = await fetchCart(userId, { clearSessionOn401: false });
          setCart(data);
          syncCartFromResponse(data);
        } catch {
          /* keep optimistic response if refresh fails */
        }
      } catch (err) {
        setQtyError(getReadableFetchError(err));
        try {
          await loadCart();
        } catch {
          /* ignore */
        }
      } finally {
        setQtyUpdatingId(null);
      }
    },
    [userId, applyCartResponse, syncCartFromResponse, loadCart]
  );

  const handleRemoveCartItem = useCallback(
    async (productId) => {
      if (userId == null || productId == null) return;
      setQtyError("");
      setRemovingProductId(productId);
      try {
        const parsed = await removeCartItem(userId, productId);
        applyCartResponse(parsed);
        try {
          const data = await fetchCart(userId, { clearSessionOn401: false });
          setCart(data);
          syncCartFromResponse(data);
        } catch {
          /* keep optimistic response if refresh fails */
        }
      } catch (err) {
        setQtyError(getReadableFetchError(err));
        try {
          await loadCart();
        } catch {
          /* ignore */
        }
      } finally {
        setRemovingProductId(null);
      }
    },
    [userId, applyCartResponse, syncCartFromResponse, loadCart]
  );

  const items = sortCartItems(
    Array.isArray(cart?.cartItemsDto) ? cart.cartItemsDto : []
  );
  const total =
    cart?.cartTotalPrice != null ? Number(cart.cartTotalPrice) : null;
  const discount =
    cart?.discountAmount != null ? Number(cart.discountAmount) : 0;
  const status = cart?.status != null ? String(cart.status) : "";
  const isCodSelected = isCashOnDeliveryMode(paymentMode);
  const placeOrderCta = orderSubmitting
    ? "Processing…"
    : isCodSelected
      ? "Place order"
      : "Pay";

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
            <>
              {qtyError ? (
                <p className="form-error" role="alert">
                  {qtyError}
                </p>
              ) : null}
              <div className="cart-lines">
                {items.map((it) => {
                  const lineId = it.cartItemId ?? it.productId;
                  const productId = it.productId;
                  const lineBusy =
                    qtyUpdatingId === lineId ||
                    (productId != null && removingProductId === productId);
                  return (
                    <CartLineItem
                      key={lineId}
                      item={it}
                      lineBusy={lineBusy}
                      onQuantityChange={(action) => {
                        if (it.cartItemId == null) return;
                        void handleCartItemQuantity(it.cartItemId, action);
                      }}
                      onRemove={() => {
                        if (productId == null) return;
                        void handleRemoveCartItem(productId);
                      }}
                    />
                  );
                })}
              </div>
            </>
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
              <p className="muted cart-pay__intro">Choose how you want to pay.</p>
              <ul className="cart-pay__list" role="radiogroup" aria-label="Payment method">
                <li>
                  <label
                    className={`cart-pay__option${paymentMode === PAYMENT_MODE_ONLINE ? " cart-pay__option--selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="cart-payment-mode"
                      value={PAYMENT_MODE_ONLINE}
                      checked={paymentMode === PAYMENT_MODE_ONLINE}
                      disabled={orderSubmitting}
                      onChange={() => setPaymentMode(PAYMENT_MODE_ONLINE)}
                    />
                    <span className="cart-pay__option-body">
                      <span className="cart-pay__option-label">Pay online</span>
                      <span className="cart-pay__option-hint muted">
                        UPI, debit/credit card, or net banking
                      </span>
                    </span>
                  </label>
                </li>
                <li>
                  <label
                    className={`cart-pay__option${paymentMode === PAYMENT_MODE_CASH_ON_DELIVERY ? " cart-pay__option--selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="cart-payment-mode"
                      value={PAYMENT_MODE_CASH_ON_DELIVERY}
                      checked={paymentMode === PAYMENT_MODE_CASH_ON_DELIVERY}
                      disabled={orderSubmitting}
                      onChange={() => setPaymentMode(PAYMENT_MODE_CASH_ON_DELIVERY)}
                    />
                    <span className="cart-pay__option-body">
                      <span className="cart-pay__option-label">Cash on delivery</span>
                      <span className="cart-pay__option-hint muted">
                        Pay with cash when your order arrives
                      </span>
                    </span>
                  </label>
                </li>
              </ul>
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
                {placeOrderCta}
              </button>
              <p className="muted cart-pay__note">
                {isCodSelected
                  ? "You will pay in cash when the order is delivered."
                  : "Payment is collected online before your order is confirmed."}
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

      <AlertModal
        open={Boolean(orderError)}
        onClose={() => setOrderError("")}
        title="Payment could not be completed"
        message={orderError}
        confirmLabel="OK"
        variant="error"
        autoCloseMs={1000}
      />
    </Screen>
  );
}
