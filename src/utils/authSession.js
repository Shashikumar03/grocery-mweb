import { readJson, storageKey } from "./storage.js";

export function readAuthSession() {
  return readJson("auth_token", null);
}

/** @returns {number | null} */
export function getLoggedInUserId() {
  const id = readAuthSession()?.user?.id;
  if (id == null || id === "") return null;
  const n = Number(id);
  return Number.isFinite(n) ? n : null;
}

export function getAuthToken() {
  const t = readAuthSession()?.token;
  return typeof t === "string" && t ? t : null;
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(storageKey("auth_token"));
  } catch {
    /* ignore */
  }
}
