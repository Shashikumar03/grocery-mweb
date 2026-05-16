import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";
import { fetchOrderHistory } from "../../services/order/index.js";
import { formatCurrency } from "../../utils/format.js";
import { getReadableFetchError } from "../../utils/fetchError.js";
import { getLoggedInUserId } from "../../utils/authSession.js";

/** @param {Record<string, unknown>} o */
function getOrderId(o) {
  const id = o.id ?? o.orderId;
  const n = Number(id);
  return Number.isFinite(n) ? n : null;
}

/** @param {Record<string, unknown>} o */
function getOrderStatus(o) {
  const s = o.orderStatus ?? o.status;
  return s != null ? String(s) : "—";
}

/** @param {Record<string, unknown>} o */
function getPaymentDto(o) {
  const p = o.paymentDto ?? o.payment;
  if (p && typeof p === "object" && !Array.isArray(p)) {
    return /** @type {Record<string, unknown>} */ (p);
  }
  return null;
}

/** @param {Record<string, unknown>} o */
function getPaymentMode(o) {
  const payment = getPaymentDto(o);
  const m = o.paymentMode ?? payment?.paymentMode;
  return m != null ? String(m) : "—";
}

/** @param {Record<string, unknown>} o */
function getPaymentStatus(o) {
  const payment = getPaymentDto(o);
  const s = o.paymentStatus ?? payment?.paymentStatus;
  return s != null ? String(s).trim() : "";
}

/** @param {Record<string, unknown>} o */
function getPaymentAmount(o) {
  const payment = getPaymentDto(o);
  if (payment) {
    const amt = payment.paymentAmount ?? payment.amount;
    if (amt != null) {
      const n = Number(amt);
      if (Number.isFinite(n)) return n;
    }
  }
  const direct = o.totalAmount ?? o.orderTotal ?? o.amount;
  if (direct != null) {
    const n = Number(direct);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

/** @param {unknown} v */
function formatOrderTime(v) {
  if (v == null) return "";
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** @param {Record<string, unknown>} o */
function formatAddressSnippet(o) {
  const parts = [o.address, o.city, o.state, o.pin]
    .filter((x) => x != null && String(x).trim())
    .map((x) => String(x).trim());
  return parts.length ? parts.join(", ") : "";
}

export function OrdersPage() {
  const userId = getLoggedInUserId();
  const [orders, setOrders] = useState(/** @type {Array<Record<string, unknown>>} */ ([]));
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (userId == null) {
      setOrders([]);
      setLoading(false);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const list = await fetchOrderHistory(userId);
      setOrders(list);
    } catch (err) {
      setOrders([]);
      setError(getReadableFetchError(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Screen title="Orders">
      {userId == null ? (
        <>
          <p className="muted">Log in to see your order history.</p>
          <p className="account-actions">
            <Link to="/auth/login" state={{ from: "/orders" }} className="account-actions__primary">
              Log in
            </Link>
          </p>
        </>
      ) : null}

      {userId != null && loading ? (
        <p className="muted" aria-live="polite">
          Loading orders…
        </p>
      ) : null}

      {userId != null && error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      {userId != null && !loading && !error ? (
        <>
          {orders.length === 0 ? (
            <p className="muted">You have no orders yet.</p>
          ) : (
            <ul className="order-history">
              {orders.map((o, idx) => {
                const orderId = getOrderId(o);
                const id = orderId ?? idx;
                const key = orderId != null ? `order-${orderId}` : `order-idx-${idx}`;
                const amount = getPaymentAmount(o);
                const addr = formatAddressSnippet(o);
                const paymentStatus = getPaymentStatus(o);
                return (
                  <li key={key} className="order-history__card">
                    <div className="order-history__head">
                      <span className="order-history__id">Order #{id}</span>
                      <span className="order-history__status">{getOrderStatus(o)}</span>
                    </div>
                    <dl className="order-history__dl">
                      <div className="order-history__row">
                        <dt>Placed</dt>
                        <dd>{formatOrderTime(o.orderTime ?? o.createdAt ?? o.orderDate) || "—"}</dd>
                      </div>
                      <div className="order-history__row">
                        <dt>Payment</dt>
                        <dd>{getPaymentMode(o)}</dd>
                      </div>
                      <div className="order-history__row">
                        <dt>Payment status</dt>
                        <dd>{paymentStatus || "—"}</dd>
                      </div>
                      {amount != null ? (
                        <div className="order-history__row">
                          <dt>Total</dt>
                          <dd>{formatCurrency(amount, "INR")}</dd>
                        </div>
                      ) : null}
                      {addr ? (
                        <div className="order-history__row">
                          <dt>Address</dt>
                          <dd>{addr}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="order-history__refresh muted">
            <button type="button" className="cart-refresh__btn" onClick={() => void load()}>
              Refresh
            </button>
          </p>
        </>
      ) : null}
    </Screen>
  );
}
