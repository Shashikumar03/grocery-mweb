import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import { DrinkBottleIcon } from "./DrinkBottleIcon.jsx";

const CHILLED_DRINKS_LOTTIES = [
  "https://assets10.lottiefiles.com/packages/lf20_yomuuzqw.json",
  "https://assets2.lottiefiles.com/packages/lf20_4rqyuz2g.json",
];

const DELIVERY_LOTTIE =
  "https://assets9.lottiefiles.com/packages/lf20_ysrn2iwp.json";

/**
 * @param {{ urls: string[]; className?: string }} props
 */
function LottieFromUrls({ urls, className = "home-banner__lottie" }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    (async () => {
      for (const url of urls) {
        try {
          const r = await fetch(url);
          if (!r.ok) continue;
          const json = await r.json();
          if (!cancelled) {
            setData(json);
            return;
          }
        } catch {
          /* try next */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [urls]);

  if (!data) return null;
  return <Lottie animationData={data} loop className={className} aria-hidden />;
}

function LottieSlide({ url }) {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setFailed(false);
    fetch(url)
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
  }, [url]);

  if (failed) {
    return (
      <div className="home-banner__fallback home-banner__fallback--delivery" aria-hidden>
        <span className="home-banner__delivery-emoji">🛵</span>
      </div>
    );
  }
  if (!data) {
    return <div className="home-banner__skel" aria-hidden />;
  }
  return (
    <Lottie animationData={data} loop className="home-banner__lottie" aria-hidden />
  );
}

function ChilledDrinksBannerArt() {
  return (
    <div className="home-banner__drinks-art" aria-hidden>
      <DrinkBottleIcon className="home-banner__drinks-bottle" />
      <span className="home-banner__drinks-emoji home-banner__drinks-emoji--1">🥤</span>
      <span className="home-banner__drinks-emoji home-banner__drinks-emoji--2">🧃</span>
      <span className="home-banner__drinks-emoji home-banner__drinks-emoji--3">🧊</span>
    </div>
  );
}

function ChilledDrinksBanner() {
  return (
    <Link to="/#thanda" className="home-banner home-banner--drinks">
      <ChilledDrinksBannerArt />
      <LottieFromUrls
        urls={CHILLED_DRINKS_LOTTIES}
        className="home-banner__lottie home-banner__lottie--overlay"
      />
      <div className="home-banner__text">
        <span className="home-banner__label">Chilled drinks</span>
        <span className="home-banner__sublabel" lang="hi">
          ठंडा — बिना फ्रिज चार्ज
        </span>
      </div>
    </Link>
  );
}

export function HomeLottieBanners() {
  return (
    <section className="home-banners" aria-label="Promotions">
      <div className="home-banners__track">
        <ChilledDrinksBanner />
        <article className="home-banner home-banner--delivery">
          <LottieSlide url={DELIVERY_LOTTIE} />
          <span className="home-banner__label">Fast delivery</span>
        </article>
      </div>
    </section>
  );
}
