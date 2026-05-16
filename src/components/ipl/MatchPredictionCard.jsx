/**
 * @param {{
 *   match: { id: string; teamA: string; teamB: string; venue: string; startTime: string; status: string; winner: string | null; cashbackAmount: number };
 *   prediction: { team: string } | null;
 *   onPick: (team: string) => void;
 *   whenLabel: string;
 * }} props
 */
export function MatchPredictionCard({ match, prediction, onPick, whenLabel }) {
  const canPick = match.status === "open";
  const isCompleted = match.status === "completed";
  const won =
    isCompleted && prediction && match.winner && prediction.team === match.winner;

  return (
    <article className={`ipl-match ipl-match--${match.status}`}>
      <div className="ipl-match__meta">
        <span className="ipl-match__when">{whenLabel}</span>
        <span className="ipl-match__venue muted">{match.venue}</span>
      </div>
      <p className="ipl-match__teams">
        <span className="ipl-match__team">{match.teamA}</span>
        <span className="ipl-match__vs">vs</span>
        <span className="ipl-match__team">{match.teamB}</span>
      </p>
      <p className="ipl-match__reward muted">
        Correct pick: <strong>₹{match.cashbackAmount}</strong> cashback
      </p>

      {canPick ? (
        <div className="ipl-match__pick">
          <button
            type="button"
            className={`ipl-match__btn${prediction?.team === match.teamA ? " ipl-match__btn--picked" : ""}`}
            onClick={() => onPick(match.teamA)}
          >
            {match.teamA}
          </button>
          <button
            type="button"
            className={`ipl-match__btn${prediction?.team === match.teamB ? " ipl-match__btn--picked" : ""}`}
            onClick={() => onPick(match.teamB)}
          >
            {match.teamB}
          </button>
        </div>
      ) : null}

      {match.status === "locked" && prediction ? (
        <p className="ipl-match__status">
          Your pick: <strong>{prediction.team}</strong> — locked in
        </p>
      ) : null}

      {isCompleted ? (
        <p className={`ipl-match__result${won ? " ipl-match__result--won" : ""}`}>
          Winner: <strong>{match.winner}</strong>
          {prediction ? (
            <>
              {" "}
              · You picked <strong>{prediction.team}</strong>
              {won ? " — cashback credited!" : " — better luck next match"}
            </>
          ) : (
            " · You did not predict this match"
          )}
        </p>
      ) : null}
    </article>
  );
}
