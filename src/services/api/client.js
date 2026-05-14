import { DEFAULT_API_BASE_URL } from "../../constants/config.js";

function stripTrailingSlash(url) {
  return url.replace(/\/+$/, "");
}

/**
 * Backend origin for API calls.
 * - Set `VITE_API_BASE_URL` to a full URL to call the API directly (server must send CORS headers).
 * - Set `VITE_API_BASE_URL` to empty in `.env.production` / `.env` so requests stay same-origin; Vite
 *   `server` / `preview` proxy forwards `/api` and `/auth` to the backend (see `vite.config.js`).
 */
export function getApiBase() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (fromEnv !== undefined && fromEnv !== null) {
    const trimmed = String(fromEnv).trim();
    return trimmed ? stripTrailingSlash(trimmed) : "";
  }
  return stripTrailingSlash(DEFAULT_API_BASE_URL);
}

/** Build an absolute API URL from a path like `/health` or `health`. */
export function apiUrl(path = "") {
  const base = getApiBase();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function parseJsonResponseText(raw) {
  if (raw == null || !String(raw).trim()) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

/** Keys we do not treat as per-field validation messages. */
const FLAT_ERROR_RESERVED = new Set([
  "message",
  "success",
  "error",
  "errors",
  "detail",
  "timestamp",
  "status",
  "path",
  "traceId",
  "fieldErrors",
  "validationErrors",
  "data",
  "title",
  "type",
  "instance",
  "code",
]);

/**
 * Bodies like `{ "mobile": "Mobile number must be exactly 10 digits" }` (field name → message string).
 * @param {unknown} parsed
 * @returns {string}
 */
function formatFlatFieldErrorMap(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return "";
  const o = /** @type {Record<string, unknown>} */ (parsed);
  const entries = Object.entries(o).filter(([k]) => !FLAT_ERROR_RESERVED.has(k));
  if (entries.length === 0) return "";

  const allStringLike = entries.every(([, v]) => {
    if (typeof v === "string") return true;
    if (Array.isArray(v)) return v.length > 0 && v.every((x) => typeof x === "string");
    return false;
  });
  if (!allStringLike) return "";

  return entries
    .map(([k, v]) => {
      const text = Array.isArray(v) ? v.join(", ") : String(v);
      return `${k}: ${text}`;
    })
    .join("; ");
}

function formatSpringFieldErrors(parsed) {
  if (!parsed || typeof parsed !== "object") return "";
  const o = /** @type {Record<string, unknown>} */ (parsed);
  const e = o.errors ?? o.fieldErrors ?? o.validationErrors;
  if (Array.isArray(e)) {
    return e
      .map((err) => {
        if (!err || typeof err !== "object") return "";
        const row = /** @type {Record<string, unknown>} */ (err);
        const f = row.field ?? row.property ?? row.objectName ?? "";
        const m = row.defaultMessage ?? row.message ?? "";
        if (typeof m === "string" && m) {
          return typeof f === "string" && f ? `${f}: ${m}` : m;
        }
        return "";
      })
      .filter(Boolean)
      .join("; ");
  }
  if (e && typeof e === "object" && !Array.isArray(e)) {
    return Object.entries(/** @type {Record<string, unknown>} */ (e))
      .map(([k, v]) => {
        if (Array.isArray(v)) return `${k}: ${v.map(String).join(", ")}`;
        return `${k}: ${String(v)}`;
      })
      .join("; ");
  }
  return "";
}

function formatApiErrorMessage(parsed, status) {
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    const o = /** @type {Record<string, unknown>} */ (parsed);
    if (o.message != null && String(o.message).trim()) return String(o.message).trim();
    if (typeof o.detail === "string" && o.detail.trim()) return o.detail.trim();
    if (o.error != null && String(o.error).trim()) return String(o.error).trim();
  }

  const springMsg = formatSpringFieldErrors(parsed);
  if (springMsg) return springMsg;

  const flatMsg = formatFlatFieldErrorMap(parsed);
  if (flatMsg) return flatMsg;

  if (typeof parsed === "string" && parsed) return parsed;
  return `Request failed (${status})`;
}

/** @param {unknown} parsed */
function isApiFailureEnvelope(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return false;
  const s = /** @type {Record<string, unknown>} */ (parsed).success;
  return s === false || s === "false";
}

/**
 * Throws if HTTP failed or JSON body reports `success: false` (common for your API).
 * @param {Response} res
 * @param {unknown} parsed
 */
export function throwIfApiFailure(res, parsed) {
  if (!res.ok) {
    throw new Error(formatApiErrorMessage(parsed, res.status));
  }
  if (isApiFailureEnvelope(parsed)) {
    throw new Error(formatApiErrorMessage(parsed, res.status));
  }
}
