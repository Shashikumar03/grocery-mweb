import { APP_NAME } from "../constants/config.js";
import { getRazorpayKeyId } from "../constants/razorpay.js";
import { loadRazorpayScript } from "./loadRazorpayScript.js";
import { isLocalDevHost } from "./isLocalDevHost.js";

/** Razorpay Orders API ids look like `order_9A33XWu170gUtm`. */
export function isValidRazorpayOrderId(orderId) {
  return /^order_[A-Za-z0-9]+$/.test(String(orderId ?? "").trim());
}

/**
 * @typedef {{
 *   razorpayOrderId: string;
 *   amountPaise: number;
 *   currency?: string;
 *   name?: string;
 *   description?: string;
 *   prefill?: { name?: string; email?: string; contact?: string };
 *   notes?: Record<string, string>;
 * }} RazorpayCheckoutInput
 */

/**
 * @typedef {{
 *   razorpay_payment_id: string;
 *   razorpay_order_id: string;
 *   razorpay_signature: string;
 * }} RazorpaySuccess
 */

/**
 * Opens Razorpay Checkout modal.
 * @param {RazorpayCheckoutInput} input
 * @returns {Promise<RazorpaySuccess>}
 */
export async function openRazorpayCheckout(input) {
  const key = getRazorpayKeyId();
  if (!key) {
    throw new Error(
      "Razorpay is not configured. Add VITE_RAZORPAY_KEY_ID to your environment."
    );
  }
  const orderId = String(input.razorpayOrderId ?? "").trim();
  if (!orderId) {
    throw new Error("Missing Razorpay order id from server.");
  }
  if (!isValidRazorpayOrderId(orderId)) {
    throw new Error(
      `Invalid Razorpay order id from server ("${orderId}"). Expected format order_xxxx.`
    );
  }
  if (key.startsWith("rzp_live_") && isLocalDevHost()) {
    throw new Error(
      "Live Razorpay keys do not work on localhost or LAN preview. Use rzp_test_... locally, or open your Netlify HTTPS site for live payments."
    );
  }

  await loadRazorpayScript();

  const Razorpay = window.Razorpay;
  if (!Razorpay) {
    throw new Error("Razorpay Checkout failed to initialize.");
  }

  return new Promise((resolve, reject) => {
    /** @type {Record<string, unknown>} */
    const options = {
      key,
      currency: input.currency ?? "INR",
      name: input.name ?? APP_NAME,
      description: input.description ?? "Grocery order",
      order_id: orderId,
      prefill: input.prefill ?? {},
      notes: input.notes ?? {},
      theme: { color: "#0d9488" },
    };
    // Amount must match the Razorpay order created on the server — do not override here.
    options.handler = (response) => {
      resolve({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });
    };
    options.modal = {
      ondismiss() {
        reject(new Error("Payment cancelled."));
      },
    };

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", (err) => {
      const e = err?.error;
      const parts = [
        e?.description,
        e?.reason,
        e?.code ? `(${e.code})` : null,
      ].filter(Boolean);
      const desc = parts.length > 0 ? parts.join(" ") : "Payment failed. Please try again.";
      reject(new Error(desc));
    });
    rzp.open();
  });
}
