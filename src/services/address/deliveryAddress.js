import { apiUrl, parseJsonResponseText, throwIfApiFailure } from "../api/client.js";
import { getAuthToken } from "../../utils/authSession.js";

function jsonAuthHeaders() {
  const token = getAuthToken();
  /** @type {Record<string, string>} */
  const h = {
    "Content-Type": "application/json; charset=UTF-8",
    Accept: "application/json",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

function bearerOnlyHeaders() {
  const token = getAuthToken();
  /** @type {Record<string, string>} */
  const h = { Accept: "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

/**
 * @param {unknown} parsed
 * @returns {Array<Record<string, unknown>>}
 */
export function normalizeAddressList(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === "object") {
    const o = /** @type {Record<string, unknown>} */ (parsed);
    if (Array.isArray(o.data)) return o.data;
    if (Array.isArray(o.addresses)) return o.addresses;
    if (Array.isArray(o.content)) return o.content;
    if (Array.isArray(o.deliveryAddressDtos)) return o.deliveryAddressDtos;
  }
  return [];
}

/** @param {Record<string, unknown>} row */
export function getDeliveryAddressId(row) {
  const id = row.id ?? row.addressId ?? row.deliveryAddressId;
  if (id == null) return null;
  const n = Number(id);
  return Number.isFinite(n) ? n : null;
}

/**
 * Body keys match backend: address, landmark, mobile, city, state, pin (all strings).
 * @param {Record<string, unknown>} input
 */
export function normalizeDeliveryAddressBody(input) {
  const address = String(input.address ?? "").trim();
  const landmark = String(input.landmark ?? "").trim();
  const mobile = String(input.mobile ?? "").replace(/\D/g, "");
  const city = String(input.city ?? "").trim();
  const state = String(input.state ?? "").trim();
  const pin = String(input.pin ?? "").replace(/\D/g, "");
  return { address, landmark, mobile, city, state, pin };
}

export async function fetchDeliveryAddresses(userId) {
  const res = await fetch(
    apiUrl(
      `/api/delivery-address/getAll/${encodeURIComponent(String(userId))}`
    ),
    { headers: bearerOnlyHeaders() }
  );
  const raw = await res.text();
  const parsed = parseJsonResponseText(raw);
  throwIfApiFailure(res, parsed);
  return normalizeAddressList(parsed);
}

/**
 * POST /api/delivery-address/{userId}
 * @param {number | string} userId
 * @param {{ address: string; landmark?: string; mobile: string; city: string; state: string; pin: string }} body
 */
export async function createDeliveryAddress(userId, body) {
  const payload = normalizeDeliveryAddressBody(body);
  const res = await fetch(
    apiUrl(`/api/delivery-address/${encodeURIComponent(String(userId))}`),
    {
      method: "POST",
      headers: jsonAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );
  const raw = await res.text();
  const parsed = parseJsonResponseText(raw);
  throwIfApiFailure(res, parsed);
  return parsed;
}

/**
 * PUT /api/delivery-address/update/{addressId}
 * @param {number | string} addressId
 * @param {{ address: string; landmark?: string; mobile: string; city: string; state: string; pin: string }} body
 */
export async function updateDeliveryAddress(addressId, body) {
  const payload = normalizeDeliveryAddressBody(body);
  const res = await fetch(
    apiUrl(
      `/api/delivery-address/update/${encodeURIComponent(String(addressId))}`
    ),
    {
      method: "PUT",
      headers: jsonAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );
  const raw = await res.text();
  const parsed = parseJsonResponseText(raw);
  throwIfApiFailure(res, parsed);
  return parsed;
}

/**
 * DELETE /api/delivery-address/delete/{addressId} — avoids clashing with POST …/{userId}.
 * If your backend uses another path, update this URL.
 * @param {number | string} addressId
 */
export async function deleteDeliveryAddress(addressId) {
  const res = await fetch(
    apiUrl(
      `/api/delivery-address/delete/${encodeURIComponent(String(addressId))}`
    ),
    {
      method: "DELETE",
      headers: bearerOnlyHeaders(),
    }
  );
  const raw = await res.text();
  const parsed = raw ? parseJsonResponseText(raw) : null;
  throwIfApiFailure(res, parsed);
  return parsed;
}
