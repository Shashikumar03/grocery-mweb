import { CategoryProductCard } from "./CategoryProductCard.jsx";

export function CategorySection({ category }) {
  const products = Array.isArray(category.productsDto) ? category.productsDto : [];

  return (
    <section className="catalog-section" aria-labelledby={`cat-${category.id}`}>
      <h2 className="catalog-section__title" id={`cat-${category.id}`}>
        {category.name}
      </h2>
      {category.description && category.description !== "Auto-created" ? (
        <p className="catalog-section__desc muted">{category.description}</p>
      ) : null}
      <div className="catalog-grid">
        {products.map((p) => (
          <CategoryProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
