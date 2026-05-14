import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav.jsx";
import { MobileHeader } from "./MobileHeader.jsx";

export function AppShell({ children }) {
  return (
    <div className="app-mobile-frame">
      <div className="app-shell">
        <MobileHeader />
        <main className="app-main">{children ?? <Outlet />}</main>
        <BottomNav />
      </div>
    </div>
  );
}
