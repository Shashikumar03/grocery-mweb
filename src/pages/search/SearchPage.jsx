import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";
import { SearchResultsShimmer } from "../../components/common/Shimmer.jsx";
import { CategoryProductCard } from "../../components/categories/CategoryProductCard.jsx";
import { searchProducts } from "../../services/catalog/index.js";
import { getReadableFetchError } from "../../utils/fetchError.js";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = (searchParams.get("q") ?? "").trim();

  const [draft, setDraft] = useState(urlQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setDraft(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    if (!urlQuery) {
      setResults([]);
      setError("");
      setLoading(false);
      setSearched(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");
    setSearched(true);

    searchProducts(urlQuery)
      .then((rows) => {
        if (!cancelled) setResults(rows);
      })
      .catch((err) => {
        if (!cancelled) {
          setResults([]);
          setError(getReadableFetchError(err));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [urlQuery]);

  function handleSubmit(e) {
    e.preventDefault();
    const q = draft.trim();
    if (q) {
      setSearchParams({ q });
    } else {
      setSearchParams({});
    }
  }

  return (
    <Screen title="Search">
      <div className="search-page">
        <form className="search-form" onSubmit={handleSubmit}>
          <label className="search-form__label" htmlFor="search-q">
            Search products
          </label>
          <div className="search-form__shell" role="search">
            <span className="search-form__icon" aria-hidden>
              ⌕
            </span>
            <input
              id="search-q"
              className="search-form__input"
              type="search"
              name="q"
              autoComplete="off"
              enterKeyHint="search"
              inputMode="search"
              placeholder="Apple, tomato, onion…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button className="search-form__submit" type="submit">
              Search
            </button>
          </div>
        </form>

        {loading && urlQuery ? (
          <>
            <p className="sr-only" aria-live="polite">
              Searching…
            </p>
            <SearchResultsShimmer />
          </>
        ) : null}

        {error ? (
          <p className="form-error search-state" role="alert">
            {error}
          </p>
        ) : null}

        {searched && !loading && !error && urlQuery ? (
          <section className="search-results" aria-label="Search results">
            {results.length === 0 ? (
              <div className="search-empty">
                <p className="search-empty__title">No matches</p>
                <p className="search-empty__text muted">
                  Nothing for “{urlQuery}”. Try another name or check spelling.
                </p>
              </div>
            ) : (
              <>
                <div className="search-results__header">
                  <h2 className="search-results__heading">Results</h2>
                  <span className="search-results__count">
                    {results.length} item{results.length === 1 ? "" : "s"}
                  </span>
                </div>
                <ul className="search-results__list">
                  {results.map((p) => (
                    <li key={p.id} className="search-results__item">
                      <CategoryProductCard product={p} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        ) : null}

        {!urlQuery && !loading ? (
          <div className="search-empty search-empty--hint">
            <p className="search-empty__title">Find groceries</p>
            <p className="search-empty__text muted">
              Search by product name. Uses{" "}
              <code className="search-code">GET /api/product/search?name=…</code>
            </p>
          </div>
        ) : null}
      </div>
    </Screen>
  );
}
