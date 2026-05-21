import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SiteProse } from "../../components/content/SiteProse.jsx";
import { Screen } from "../../components/common/Screen.jsx";
import { SITE_NAME } from "../../constants/site.js";
import { AuthPromptModal } from "../../components/auth/AuthPromptModal.jsx";
import { MatchPredictionCard } from "../../components/ipl/MatchPredictionCard.jsx";
import { IPL_MATCHES } from "../../data/iplMatches.js";
import {
  calculateIplCashback,
  formatMatchWhen,
  readIplPredictions,
  saveIplPrediction,
} from "../../utils/iplPredictions.js";
import { getAuthToken, getLoggedInUserId } from "../../utils/authSession.js";

export function IplPredictPage() {
  const userId = getLoggedInUserId();
  const token = getAuthToken();
  const loggedIn = userId != null && Boolean(token);

  const [predictions, setPredictions] = useState(() =>
    userId != null ? readIplPredictions(userId) : {}
  );
  const [authOpen, setAuthOpen] = useState(false);
  const [toast, setToast] = useState("");

  const { total: cashbackWon, correct } = useMemo(
    () => calculateIplCashback(IPL_MATCHES, predictions),
    [predictions]
  );

  const openMatches = IPL_MATCHES.filter((m) => m.status === "open");
  const pastMatches = IPL_MATCHES.filter((m) => m.status !== "open");

  const handlePick = useCallback(
    (matchId, team) => {
      if (userId == null || !token) {
        setAuthOpen(true);
        return;
      }
      saveIplPrediction(userId, matchId, team);
      setPredictions(readIplPredictions(userId));
      setToast(`Prediction saved: ${team}`);
      window.setTimeout(() => setToast(""), 2500);
    },
    [userId, token]
  );

  return (
    <Screen
      title="IPL Predictions"
      metaDescription="Optional IPL match prediction promotion on Bazzari. Grocery shopping is the main service on our home and shop pages."
      noindex
    >
      <p className="ipl-back">
        <Link to="/">← Back to home</Link>
      </p>

      <SiteProse>
        <p>
          This page is an optional promotion separate from everyday grocery shopping on{" "}
          {SITE_NAME}. Our primary service is ordering food and household products for home
          delivery from the <Link to="/categories">shop</Link> page. Match predictions are for
          entertainment only and may offer cashback to eligible signed-in customers according to
          promotion rules.
        </p>
      </SiteProse>

      <header className="ipl-hero">
        <p className="ipl-hero__badge">IPL 2026 · Cashback league</p>
        <h1 className="ipl-hero__title">Predict the winner</h1>
        <p className="ipl-hero__lead">
          Choose who wins each match before it starts. Get it right and earn{" "}
          <strong>cashback</strong> credited to your grocery account.
        </p>
        <p className="ipl-hero__lead-hi" lang="hi">
          मैच शुरू होने से पहले विजेता चुनें — सही अनुमान पर <strong>कैशबैक</strong> मिलेगा
        </p>
      </header>

      {loggedIn ? (
        <div className="ipl-wallet">
          <p className="ipl-wallet__row">
            <span>Cashback earned</span>
            <strong>₹{cashbackWon}</strong>
          </p>
          <p className="ipl-wallet__row muted">
            <span>Correct predictions</span>
            <span>{correct}</span>
          </p>
        </div>
      ) : (
        <p className="ipl-signin muted">
          <Link to="/auth/login" state={{ from: "/ipl" }} className="cart-inline-link">
            Log in
          </Link>{" "}
          to save your predictions and claim cashback.
        </p>
      )}

      {toast ? (
        <p className="form-success" role="status">
          {toast}
        </p>
      ) : null}

      <section className="ipl-section" aria-labelledby="ipl-open-heading">
        <h2 id="ipl-open-heading" className="ipl-section__title">
          Upcoming matches
        </h2>
        {openMatches.length === 0 ? (
          <p className="muted">No open matches right now. Check back soon.</p>
        ) : (
          <ul className="ipl-match-list">
            {openMatches.map((m) => (
              <li key={m.id}>
                <MatchPredictionCard
                  match={m}
                  prediction={predictions[m.id] ?? null}
                  whenLabel={formatMatchWhen(m.startTime)}
                  onPick={(team) => handlePick(m.id, team)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {pastMatches.length > 0 ? (
        <section className="ipl-section" aria-labelledby="ipl-past-heading">
          <h2 id="ipl-past-heading" className="ipl-section__title">
            Results
          </h2>
          <ul className="ipl-match-list">
            {pastMatches.map((m) => (
              <li key={m.id}>
                <MatchPredictionCard
                  match={m}
                  prediction={predictions[m.id] ?? null}
                  whenLabel={formatMatchWhen(m.startTime)}
                  onPick={() => {}}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="ipl-rules muted">
        One pick per match. Cashback applies when your pick matches the official result. Amounts
        shown per match; credited after results are confirmed.
      </p>

      <AuthPromptModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        returnTo="/ipl"
        title="Sign in to predict"
        description="Log in to save your IPL picks and earn cashback on correct predictions."
      />
    </Screen>
  );
}
