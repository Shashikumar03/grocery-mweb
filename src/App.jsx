import { Routes, Route } from "react-router-dom";
import { CookieConsent } from "./components/ads/CookieConsent.jsx";
import { AppShell } from "./components/layout/AppShell.jsx";
import { AdConsentProvider } from "./context/AdConsentContext.jsx";
import { CartCountProvider } from "./context/CartCountContext.jsx";
import { routes } from "./routes/index.jsx";

export default function App() {
  return (
    <AdConsentProvider>
      <CartCountProvider>
        <AppShell>
          <Routes>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
          <CookieConsent />
        </AppShell>
      </CartCountProvider>
    </AdConsentProvider>
  );
}
