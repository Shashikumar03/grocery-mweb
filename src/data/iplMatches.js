/**
 * Demo IPL schedule — replace with API when backend is ready.
 * @typedef {'open' | 'locked' | 'completed'} MatchStatus
 * @typedef {{
 *   id: string;
 *   teamA: string;
 *   teamB: string;
 *   venue: string;
 *   startTime: string;
 *   status: MatchStatus;
 *   winner: string | null;
 *   cashbackAmount: number;
 * }} IplMatch
 */

/** @type {IplMatch[]} */
export const IPL_MATCHES = [
  {
    id: "ipl-1",
    teamA: "CSK",
    teamB: "MI",
    venue: "Chennai",
    startTime: "2026-05-18T19:30:00",
    status: "open",
    winner: null,
    cashbackAmount: 50,
  },
  {
    id: "ipl-2",
    teamA: "RCB",
    teamB: "KKR",
    venue: "Bengaluru",
    startTime: "2026-05-19T19:30:00",
    status: "open",
    winner: null,
    cashbackAmount: 50,
  },
  {
    id: "ipl-3",
    teamA: "GT",
    teamB: "SRH",
    venue: "Ahmedabad",
    startTime: "2026-05-20T19:30:00",
    status: "open",
    winner: null,
    cashbackAmount: 75,
  },
  {
    id: "ipl-4",
    teamA: "RR",
    teamB: "PBKS",
    venue: "Jaipur",
    startTime: "2026-05-14T19:30:00",
    status: "completed",
    winner: "RR",
    cashbackAmount: 50,
  },
];
