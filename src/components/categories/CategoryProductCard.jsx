import { useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/format.js";
import { getProductImageUrlForDisplay } from "../../utils/productImage.js";

export function CategoryProductCard({ product }) {
  const [imgFailed, setImgFailed] = useState(false);
  const price = formatCurrency(product.price, "INR");
  const available = Boolean(product.available);
  const imageSrc = getProductImageUrlForDisplay(product);
  const showImg = Boolean(imageSrc) && !imgFailed;

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__link">
        <div className="product-card__media">
          {showImg ? (
            <img
              src={imageSrc}
              alt={product.name}
              className="product-card__img"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div
              className="product-card__img product-card__img--placeholder"
              aria-hidden
              title={imgFailed ? "Image could not be loaded" : undefined}
            />
          )}
        </div>
        <div className="product-card__body">
          <h3 className="product-card__name">{product.name}</h3>
          {product.description ? (
            <p className="product-card__desc">{product.description}</p>
          ) : null}
          <div className="product-card__row">
            <span className="product-card__price">{price}</span>
            {product.unit ? (
              <span className="product-card__unit">/ {product.unit}</span>
            ) : null}
            <span
              className={`product-card__badge${available ? " product-card__badge--ok" : ""}`}
            >
              {available ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
