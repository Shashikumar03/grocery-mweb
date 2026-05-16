import { apiUrl, parseJsonResponseText, throwIfApiFailure } from "../api/client.js";
import { getAuthToken } from "../../utils/authSession.js";

/**
 * Confirm Razorpay payment with backend (adjust path if your API differs).
 * @param {{
 *   razorpay_order_id: string;
 *   razorpay_payment_id: string;
 *   razorpay_signature: string;
 *   orderId?: string | number;
 * }} payload
 */
export async function verifyRazorpayPayment(payload) {
  const token = getAuthToken();
  /** @type {Record<string, string>} */
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const body = {
    razorpayOrderId: payload.razorpay_order_id,
    razorpayPaymentId: payload.razorpay_payment_id,
    razorpaySignature: payload.razorpay_signature,
    orderId: payload.orderId,
    razorpay_order_id: payload.razorpay_order_id,
    razorpay_payment_id: payload.razorpay_payment_id,
    razorpay_signature: payload.razorpay_signature,
  };

  const paths = [
    "/api/payment/verify",
    "/api/payment/verify-payment",
    "/api/razorpay/verify",
  ];

  let lastError = null;
  for (const path of paths) {
    try {
      const res = await fetch(apiUrl(path), {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const raw = await res.text();
      const parsed = raw ? parseJsonResponseText(raw) : null;
      if (res.status === 404 || res.status === 401) continue;
      throwIfApiFailure(res, parsed, { clearSessionOn401: false });
      return parsed;
    } catch (err) {
      lastError = err;
      if (err instanceof Error && err.message.includes("(404)")) continue;
      throw err;
    }
  }

  if (lastError) throw lastError;
  return null;
}
