import { Link } from "react-router-dom";
import { Screen } from "../../components/common/Screen.jsx";

export function NotFoundPage() {
  return (
    <Screen title="Page not found">
      <p className="muted">We could not find that screen.</p>
      <Link to="/">Back home</Link>
    </Screen>
  );
}
