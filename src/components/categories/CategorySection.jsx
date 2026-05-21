import { Link } from "react-router-dom";
import { getCategoryIntroText } from "../../utils/categoryIntro.js";
import { CategoryProductCard } from "./CategoryProductCard.jsx";

export function CategorySection({ category }) {
  const products = Array.isArray(category.productsDto) ? category.productsDto : [];
  const id = category.id;
  const name = String(category.name ?? "Category");
  const intro = getCategoryIntroText(category);

  return (
    <section className="catalog-section" aria-labelledby={`cat-${category.id}`}>
      <h2 className="catalog-section__title" id={`cat-${category.id}`}>
        {id != null ? (
          <Link to={`/categories/${id}`} className="catalog-section__title-link">
            {name}
          </Link>
        ) : (
          name
        )}
      </h2>
      {intro ? <p className="catalog-section__desc">{intro}</p> : null}
      {id != null ? (
        <p className="catalog-section__more">
          <Link to={`/categories/${id}`}>View full {name} page</Link>
        </p>
      ) : null}
      <div className="catalog-grid">
        {products.map((p) => (
          <CategoryProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
