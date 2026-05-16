/** Razorpay Checkout key (test or live). Set in `.env`: VITE_RAZORPAY_KEY_ID=rzp_test_... */
export function getRazorpayKeyId() {
  const fromEnv = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (fromEnv != null && String(fromEnv).trim()) {
    return String(fromEnv).trim();
  }
  return "";
}
