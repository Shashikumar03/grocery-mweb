/**
 * @param {{ className?: string; style?: object; width?: string; height?: string; rounded?: boolean }} props
 */
export function ShimmerBox({
  className = "",
  style,
  width,
  height,
  rounded = true,
}) {
  return (
    <span
      className={`shimmer-box${rounded ? " shimmer-box--rounded" : " shimmer-box--flat"} ${className}`.trim()}
      style={{ width, height, ...style }}
      aria-hidden
    />
  );
}

export function ShopPageShimmer() {
  return (
    <div className="shimmer-page" aria-busy="true" aria-label="Loading shop">
      {[0, 1].map((section) => (
        <div key={section} className="shimmer-section">
          <ShimmerBox className="shimmer-section__title" width="45%" height="18px" />
          <ShimmerBox
            className="shimmer-section__subtitle"
            width="70%"
            height="12px"
            rounded={false}
          />
          <div className="shimmer-section__cards">
            {[0, 1, 2].map((row) => (
              <div key={row} className="shimmer-product-row">
                <ShimmerBox
                  className="shimmer-product-row__thumb"
                  width="72px"
                  height="72px"
                />
                <div className="shimmer-product-row__text">
                  <ShimmerBox width="85%" height="14px" />
                  <ShimmerBox width="55%" height="11px" rounded={false} />
                  <div className="shimmer-product-row__meta">
                    <ShimmerBox width="4rem" height="13px" />
                    <ShimmerBox width="4.5rem" height="20px" rounded />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SearchResultsShimmer() {
  return (
    <div className="shimmer-page shimmer-page--tight" aria-busy="true" aria-label="Loading results">
      <div className="shimmer-search-header">
        <ShimmerBox width="5.5rem" height="16px" />
        <ShimmerBox width="3.5rem" height="11px" rounded={false} />
      </div>
      <ul className="shimmer-search-list">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <li key={i} className="shimmer-search-list__item">
            <div className="shimmer-product-row">
              <ShimmerBox
                className="shimmer-product-row__thumb"
                width="72px"
                height="72px"
              />
              <div className="shimmer-product-row__text">
                <ShimmerBox width="78%" height="14px" />
                <ShimmerBox width="50%" height="11px" rounded={false} />
                <div className="shimmer-product-row__meta">
                  <ShimmerBox width="3.5rem" height="13px" />
                  <ShimmerBox width="4rem" height="20px" rounded />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CartPageShimmer() {
  return (
    <div className="shimmer-page shimmer-cart" aria-busy="true" aria-label="Loading cart">
      <ShimmerBox
        className="shimmer-cart__status"
        width="42%"
        height="14px"
        rounded={false}
      />
      <ul className="shimmer-cart-list">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="shimmer-cart-list__item">
            <div className="shimmer-cart-row">
              <ShimmerBox
                className="shimmer-cart-row__thumb"
                width="56px"
                height="56px"
              />
              <div className="shimmer-cart-row__body">
                <ShimmerBox width="72%" height="13px" />
                <ShimmerBox width="48%" height="11px" rounded={false} />
              </div>
              <ShimmerBox
                className="shimmer-cart-row__price"
                width="3.25rem"
                height="15px"
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="shimmer-cart-summary">
        <div className="shimmer-cart-summary__row">
          <ShimmerBox width="30%" height="13px" rounded={false} />
          <ShimmerBox width="22%" height="13px" rounded={false} />
        </div>
        <div className="shimmer-cart-summary__row shimmer-cart-summary__row--total">
          <ShimmerBox width="22%" height="16px" rounded={false} />
          <ShimmerBox width="28%" height="18px" />
        </div>
      </div>
      <div className="shimmer-cart-pay">
        <ShimmerBox width="5.5rem" height="15px" rounded={false} />
        <ShimmerBox
          className="shimmer-cart-pay__hint"
          width="92%"
          height="11px"
          rounded={false}
        />
        {[0, 1, 2, 3].map((i) => (
          <ShimmerBox
            key={i}
            className="shimmer-cart-pay__option"
            width="100%"
            height="48px"
            rounded
          />
        ))}
      </div>
    </div>
  );
}
