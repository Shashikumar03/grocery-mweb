import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/format.js";
import { BeverageProductMedia } from "./BeverageProductMedia.jsx";

/**
 * @param {{
 *   product: Record<string, unknown>;
 *   onAddToCart: (product: Record<string, unknown>) => void;
 *   adding: boolean;
 * }} props
 */
export function BeverageProductCard({ product, onAddToCart, adding }) {
  const price = formatCurrency(Number(product.price) || 0, "INR");
  const available = Boolean(product.available);
  const id = product.id ?? product.productId;
  const name = String(product.name ?? product.productName ?? "Item");

  return (
    <article className="beverage-card">
      <Link to={`/product/${id}`} className="beverage-card__link">
        <BeverageProductMedia product={product} />
        <h3 className="beverage-card__name">{name}</h3>
        <p className="beverage-card__price">{price}</p>
      </Link>
      <button
        type="button"
        className="beverage-card__add"
        disabled={!available || adding}
        onClick={() => onAddToCart(product)}
      >
        {adding ? "Adding…" : available ? "Add to cart" : "Unavailable"}
      </button>
    </article>
  );
}
