/** Live site (Netlify). Override with VITE_SITE_URL if the domain changes. */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL && String(import.meta.env.VITE_SITE_URL).trim()) ||
  "https://bazzari.netlify.app";

export const SITE_ORIGIN = new URL(SITE_URL).origin;

export const SITE_NAME =
  (import.meta.env.VITE_SITE_NAME && String(import.meta.env.VITE_SITE_NAME).trim()) ||
  "Bazzari";

/** Help & support email — override with VITE_CONTACT_EMAIL in Netlify if needed. */
export const CONTACT_EMAIL =
  (import.meta.env.VITE_CONTACT_EMAIL && String(import.meta.env.VITE_CONTACT_EMAIL).trim()) ||
  "shashikumarkushwaha1@gmail.com";

export const CONTACT_PHONE =
  (import.meta.env.VITE_CONTACT_PHONE && String(import.meta.env.VITE_CONTACT_PHONE).trim()) ||
  "";
