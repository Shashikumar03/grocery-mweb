import { usePageMeta } from "../../hooks/usePageMeta.js";

/**
 * @param {{
 *   title?: string | null;
 *   metaDescription?: string;
 *   noindex?: boolean;
 *   children: import("react").ReactNode;
 * }} props
 */
export function Screen({ title, metaDescription, noindex = false, children }) {
  usePageMeta({
    title: title ?? null,
    description: metaDescription,
    noindex,
  });

  return (
    <section className="screen">
      {title ? <h1 className="screen__title">{title}</h1> : null}
      {children}
    </section>
  );
}
