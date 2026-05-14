import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell.jsx";
import { routes } from "./routes/index.jsx";

export default function App() {
  return (
    <AppShell>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </AppShell>
  );
}
