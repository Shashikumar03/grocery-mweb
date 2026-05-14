const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export function getApiBase() {
  return API_BASE;
}
