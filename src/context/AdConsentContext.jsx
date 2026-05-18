import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "grocery-ad-consent";

/** @type {import("react").Context<{ consented: boolean; decided: boolean; grant: () => void; deny: () => void }>} */
const AdConsentContext = createContext({
  consented: false,
  decided: false,
  grant: () => {},
  deny: () => {},
});

function readStoredConsent() {
  if (typeof window === "undefined") return { consented: false, decided: false };
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "granted") return { consented: true, decided: true };
  if (v === "denied") return { consented: false, decided: true };
  return { consented: false, decided: false };
}

export function AdConsentProvider({ children }) {
  const [state, setState] = useState(readStoredConsent);

  const grant = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "granted");
    setState({ consented: true, decided: true });
  }, []);

  const deny = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "denied");
    setState({ consented: false, decided: true });
  }, []);

  const value = useMemo(
    () => ({ ...state, grant, deny }),
    [state, grant, deny]
  );

  return (
    <AdConsentContext.Provider value={value}>{children}</AdConsentContext.Provider>
  );
}

export function useAdConsent() {
  return useContext(AdConsentContext);
}
