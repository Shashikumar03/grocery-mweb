import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link to="/privacy" className="site-footer__link">
        Privacy Policy
      </Link>
    </footer>
  );
}
