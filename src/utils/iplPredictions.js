import { readJson, writeJson } from "./storage.js";

/** @param {number | string} userId */
function storageKey(userId) {
  return `ipl_predictions_${userId}`;
}

/** @param {number | string} userId */
export function readIplPredictions(userId) {
  const raw = readJson(storageKey(userId), {});
  return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
}

/**
 * @param {number | string} userId
 * @param {string} matchId
 * @param {string} team
 */
export function saveIplPrediction(userId, matchId, team) {
  const all = readIplPredictions(userId);
  all[matchId] = { team, submittedAt: new Date().toISOString() };
  writeJson(storageKey(userId), all);
}

/**
 * @param {Array<{ id: string; status: string; winner: string | null; cashbackAmount: number }>} matches
 * @param {Record<string, { team: string }>} predictions
 */
export function calculateIplCashback(matches, predictions) {
  let total = 0;
  let correct = 0;
  for (const m of matches) {
    if (m.status !== "completed" || !m.winner) continue;
    const p = predictions[m.id];
    if (p?.team === m.winner) {
      total += Number(m.cashbackAmount) || 0;
      correct += 1;
    }
  }
  return { total, correct };
}

/** @param {string} iso */
export function formatMatchWhen(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
