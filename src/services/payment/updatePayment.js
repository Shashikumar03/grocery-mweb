import { apiUrl, parseJsonResponseText, throwIfApiFailure } from "../api/client.js";
import { getAuthToken } from "../../utils/authSession.js";

/**
 * Mark payment on backend after Razorpay success (same as React Native `updatePayment`).
 * @param {string} rozerpayId Razorpay order id (`order_...`)
 * @param {string} paymentStatus e.g. `COMPLETED`, `FAILED`
 * @param {string} paymentId Razorpay payment id (`pay_...`)
 */
export async function updatePayment(rozerpayId, paymentStatus, paymentId) {
  const token = getAuthToken();
  /** @type {Record<string, string>} */
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const body = {
    rozerpayId,
    paymentStatus,
    paymentId,
    razorpayPaymentId: paymentId,
    razorpayOrderId: rozerpayId,
  };

  const query = new URLSearchParams({
    rozerpayId,
    paymentStatus,
    paymentId,
  }).toString();

  const attempts = [
    { method: "PUT", path: `/api/payment/update?${query}` },
    { method: "POST", path: "/api/payment/update", body },
    { method: "PATCH", path: "/api/payment/update", body },
  ];

  let lastError = null;
  for (const { method, path, body: reqBody } of attempts) {
    try {
      const res = await fetch(apiUrl(path), {
        method,
        headers,
        body: reqBody ? JSON.stringify(reqBody) : undefined,
      });
      const raw = await res.text();
      const parsed = raw ? parseJsonResponseText(raw) : null;
      if (res.status === 404) continue;
      throwIfApiFailure(res, parsed, { clearSessionOn401: false });
      return parsed;
    } catch (err) {
      lastError = err;
      if (err instanceof Error && err.message.includes("(404)")) continue;
      throw err;
    }
  }

  if (lastError) throw lastError;
  throw new Error("Payment update API not found.");
}
