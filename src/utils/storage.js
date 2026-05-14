const PREFIX = "grocery_mweb_";

export function storageKey(key) {
  return `${PREFIX}${key}`;
}

export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(storageKey(key));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  localStorage.setItem(storageKey(key), JSON.stringify(value));
}
