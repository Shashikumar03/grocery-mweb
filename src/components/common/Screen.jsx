export function Screen({ title, children }) {
  return (
    <section className="screen">
      {title ? <h1 className="screen__title">{title}</h1> : null}
      {children}
    </section>
  );
}
