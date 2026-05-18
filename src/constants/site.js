/** Live site (Netlify). Override with VITE_SITE_URL if the domain changes. */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL && String(import.meta.env.VITE_SITE_URL).trim()) ||
  "https://bazzari.netlify.app";

export const SITE_ORIGIN = new URL(SITE_URL).origin;
