import { useState } from "react";
import { DrinkBottleIcon } from "./DrinkBottleIcon.jsx";
import { getProductImageUrlForDisplay } from "../../utils/productImage.js";
import {
  getBeverageLogoLetter,
  getBeverageVisualHint,
} from "../../utils/beverageVisual.js";

/**
 * @param {{ product: Record<string, unknown> }} props
 */
export function BeverageProductMedia({ product }) {
  const [imgFailed, setImgFailed] = useState(false);
  const name = String(product.name ?? product.productName ?? "Drink");
  const imageSrc = getProductImageUrlForDisplay(product);
  const showPhoto = Boolean(imageSrc) && !imgFailed;
  const hint = getBeverageVisualHint(name);
  const logoLetter = getBeverageLogoLetter(name);

  if (showPhoto) {
    return (
      <div className="beverage-card__media">
        <img
          src={imageSrc}
          alt={name}
          className="beverage-card__img"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`beverage-card__media beverage-card__visual beverage-card__visual--${hint.tone}`}
      aria-hidden
    >
      <DrinkBottleIcon className="beverage-card__bottle" />
      <span className="beverage-card__emoji">{hint.emoji}</span>
      <span className="beverage-card__logo">{logoLetter}</span>
      <span className="beverage-card__type">{hint.label}</span>
    </div>
  );
}
