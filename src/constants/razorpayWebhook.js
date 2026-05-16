import { DEFAULT_API_BASE_URL } from "./config.js";

/** Backend path Razorpay POSTs to (configure in Razorpay Dashboard → Webhooks). */
export const RAZORPAY_WEBHOOK_PATH = "/api/webhook";

/** Use this URL in Razorpay Dashboard (direct to Railway — recommended for signature verification). */
export const RAZORPAY_WEBHOOK_URL = `${DEFAULT_API_BASE_URL}${RAZORPAY_WEBHOOK_PATH}`;
