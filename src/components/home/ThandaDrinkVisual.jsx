import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { DrinkBottleIcon } from "./DrinkBottleIcon.jsx";

const CHILLED_LOTTIE =
  "https://assets2.lottiefiles.com/packages/lf20_4rqyuz2g.json";

export function ThandaDrinkVisual() {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(CHILLED_LOTTIE)
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

  return (
    <div className="home-thanda__visual" aria-hidden>
      {data && !failed ? (
        <Lottie animationData={data} loop className="home-thanda__lottie" />
      ) : (
        <div className="home-thanda__visual-fallback">
          <DrinkBottleIcon className="home-thanda__bottle" />
          <span className="home-thanda__emoji">🥤</span>
          <span className="home-thanda__emoji home-thanda__emoji--2">🧊</span>
        </div>
      )}
    </div>
  );
}
