/** @param {unknown} parsed */
export function unwrapOrderRoot(parsed) {
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

/** @param {unknown} v */
export function formatOrderTimeLabel(v) {
  if (v == null) return "";
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

/** @param {unknown} parsed */
export function pickFromOrderResponse(parsed) {
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

/** @param {unknown} parsed */
export function pickRazorpayFromOrderResponse(parsed) {
  const root = unwrapOrderRoot(parsed);
  if (!root || typeof root !== "object" || Array.isArray(root)) {
    return { razorpayOrderId: "", amountInr: null };
  }
  const o = /** @type {Record<string, unknown>} */ (root);
  const pay =
    o.paymentDto && typeof o.paymentDto === "object" && !Array.isArray(o.paymentDto)
      ? /** @type {Record<string, unknown>} */ (o.paymentDto)
      : o.payment && typeof o.payment === "object" && !Array.isArray(o.payment)
        ? /** @type {Record<string, unknown>} */ (o.payment)
        : null;

  const razorpayOrderId = String(
    pay?.rozerpayId ??
      pay?.razorpayId ??
      pay?.razorpayOrderId ??
      pay?.razorpay_order_id ??
      pay?.orderId ??
      ""
  ).trim();

  const amt =
    pay?.paymentAmount ??
    pay?.amount ??
    pay?.amountInPaise ??
    o.cartTotalPrice;
  let amountInr = amt != null ? Number(amt) : null;
  // Backend may send paise in amountInPaise / large paymentAmount
  if (
    pay?.amountInPaise != null &&
    Number.isFinite(Number(pay.amountInPaise))
  ) {
    amountInr = Number(pay.amountInPaise) / 100;
  } else if (
    amountInr != null &&
    amountInr >= 1000 &&
    o.cartTotalPrice != null &&
    Number(o.cartTotalPrice) > 0 &&
    Math.abs(amountInr - Number(o.cartTotalPrice)) > 0.01 &&
    Math.abs(amountInr / 100 - Number(o.cartTotalPrice)) < 0.01
  ) {
    amountInr = amountInr / 100;
  }

  return {
    razorpayOrderId,
    amountInr: amountInr != null && Number.isFinite(amountInr) ? amountInr : null,
  };
}

export function isCashOnDeliveryMode(paymentMode) {
  return String(paymentMode ?? "").toUpperCase() === "CASH_ON_DELIVERY";
}

export function isOnlinePaymentMode(paymentMode) {
  const m = String(paymentMode ?? "").toUpperCase();
  return m === "ONLINE";
}

/** @param {number | null | undefined} amountInr */
export function inrToPaise(amountInr) {
  if (amountInr == null || !Number.isFinite(amountInr)) return 0;
  return Math.round(amountInr * 100);
}

/** @param {unknown} parsed */
export function cartItemsFromPlaceOrderResponse(parsed) {
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

/** @param {unknown} parsed */
export function cartTotalFromPlaceOrderResponse(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const c = /** @type {Record<string, unknown>} */ (parsed).cartDto;
  if (c && typeof c === "object" && !Array.isArray(c) && c.cartTotalPrice != null) {
    const n = Number(c.cartTotalPrice);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** @param {Record<string, unknown>} row */
export function formatAddressOneLine(row) {
  const parts = [row.address, row.city, row.state, row.pin]
    .filter(Boolean)
    .map((x) => String(x).trim())
    .filter(Boolean);
  return parts.join(", ") || "Address";
}

/** @param {unknown} parsed */
export function formatAddressFromOrderResponse(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return "";
  return formatAddressOneLine(/** @type {Record<string, unknown>} */ (parsed));
}
