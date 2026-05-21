import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import { IPL_PROMO_ENABLED } from "../../constants/features.js";

const IPL_LOTTIE_URL =
  "https://assets3.lottiefiles.com/packages/lf20_ukaaovr.json";

function IplLottie() {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(IPL_LOTTIE_URL)
      .then((r) => {
        if (!r.ok) throw new Error("load failed");
        return r.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <span className="home-ipl-entry__emoji" aria-hidden>
        🏏
      </span>
    );
  }
  if (!data) {
    return <div className="home-ipl-entry__skel" aria-hidden />;
  }
  return <Lottie animationData={data} loop className="home-ipl-entry__lottie" aria-hidden />;
}

export function HomeIplEntry() {
  if (!IPL_PROMO_ENABLED) return null;

  return (
    <Link to="/ipl" className="home-ipl-entry">
      <div className="home-ipl-entry__visual">
        <IplLottie />
      </div>
      <div className="home-ipl-entry__body">
        <p className="home-ipl-entry__badge">IPL 2026</p>
        <h2 className="home-ipl-entry__title">Predict &amp; win cashback</h2>
        <p className="home-ipl-entry__desc">
          Pick match winners — correct predictions earn <strong>cashback</strong> on your orders.
        </p>
        <p className="home-ipl-entry__desc-hi" lang="hi">
          मैच का विजेता चुनें — सही अनुमान पर <strong>कैशबैक</strong> पाएं
        </p>
        <span className="home-ipl-entry__cta">Play now →</span>
      </div>
    </Link>
  );
}
