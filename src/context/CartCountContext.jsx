import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { fetchCart } from "../services/cart/index.js";
import { getLoggedInUserId } from "../utils/authSession.js";

/** Sum line quantities (falls back to 1 per row if quantity missing). */
export function countItemsInCart(cart) {
  const lines = Array.isArray(cart?.cartItemsDto) ? cart.cartItemsDto : [];
  return lines.reduce((sum, row) => {
    if (!row || typeof row !== "object") return sum;
    const q = Number(/** @type {Record<string, unknown>} */ (row).quantity);
    return sum + (Number.isFinite(q) && q > 0 ? q : 1);
  }, 0);
}

/** @type {import("react").Context<{ itemCount: number; refreshCartCount: () => Promise<void>; syncCartFromResponse: (cart: unknown) => void }>} */
const CartCountContext = createContext({
  itemCount: 0,
  refreshCartCount: async () => {},
  syncCartFromResponse: () => {},
});

export function CartCountProvider({ children }) {
  const [itemCount, setItemCount] = useState(0);
  const { pathname } = useLocation();

  const syncCartFromResponse = useCallback((cart) => {
    setItemCount(countItemsInCart(cart));
  }, []);

  const refreshCartCount = useCallback(async () => {
    const uid = getLoggedInUserId();
    if (uid == null) {
      setItemCount(0);
      return;
    }
    try {
      const data = await fetchCart(uid);
      syncCartFromResponse(data);
    } catch {
      setItemCount(0);
    }
  }, [syncCartFromResponse]);

  useEffect(() => {
    void refreshCartCount();
  }, [pathname, refreshCartCount]);

  const value = useMemo(
    () => ({ itemCount, refreshCartCount, syncCartFromResponse }),
    [itemCount, refreshCartCount, syncCartFromResponse]
  );

  return (
    <CartCountContext.Provider value={value}>{children}</CartCountContext.Provider>
  );
}

export function useCartCount() {
  return useContext(CartCountContext);
}
