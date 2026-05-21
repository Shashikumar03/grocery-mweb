/** Live site (Netlify). Override with VITE_SITE_URL if the domain changes. */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL && String(import.meta.env.VITE_SITE_URL).trim()) ||
  "https://bazzari.netlify.app";

export const SITE_ORIGIN = new URL(SITE_URL).origin;

export const SITE_NAME =
  (import.meta.env.VITE_SITE_NAME && String(import.meta.env.VITE_SITE_NAME).trim()) ||
  "Bazzari";

/** Shown on Contact page — set VITE_CONTACT_EMAIL in Netlify for AdSense review. */
export const CONTACT_EMAIL =
  (import.meta.env.VITE_CONTACT_EMAIL && String(import.meta.env.VITE_CONTACT_EMAIL).trim()) ||
  "";

export const CONTACT_PHONE =
  (import.meta.env.VITE_CONTACT_PHONE && String(import.meta.env.VITE_CONTACT_PHONE).trim()) ||
  "";
