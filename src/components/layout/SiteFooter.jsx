import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav className="site-footer__nav" aria-label="Legal and information">
        <Link to="/about" className="site-footer__link">
          About
        </Link>
        <Link to="/contact" className="site-footer__link">
          Contact
        </Link>
        <Link to="/faq" className="site-footer__link">
          FAQ
        </Link>
        <Link to="/delivery" className="site-footer__link">
          Delivery
        </Link>
        <Link to="/privacy" className="site-footer__link">
          Privacy
        </Link>
        <Link to="/terms" className="site-footer__link">
          Terms
        </Link>
      </nav>
    </footer>
  );
}
