import { loadRazorpayScript } from "./loadRazorpayScript.js";
import { openRazorpayCheckout } from "./razorpayCheckout.js";

/** @param {Parameters<typeof openRazorpayCheckout>[0]} input */
export async function openCheckoutWithRetry(input) {
  try {
    return await openRazorpayCheckout(input);
  } catch (firstErr) {
    const msg = firstErr instanceof Error ? firstErr.message : "";
    const retryable =
      /failed to load razorpay|failed to initialize|could not be opened|not configured/i.test(
        msg
      );
    if (!retryable) throw firstErr;
    await loadRazorpayScript();
    return openRazorpayCheckout(input);
  }
}
