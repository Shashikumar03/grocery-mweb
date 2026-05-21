/**
 * Readable article blocks for policy pages and AdSense content quality.
 * @param {{ title?: string; children: import("react").ReactNode; className?: string }} props
 */
export function SiteProse({ title, children, className = "" }) {
  return (
    <article className={`site-prose${className ? ` ${className}` : ""}`}>
      {title ? <h2 className="site-prose__title">{title}</h2> : null}
      {children}
    </article>
  );
}
