import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

/**
 * @param {{
 *   open: boolean;
 *   onClose: () => void;
 *   returnTo?: string;
 *   title?: string;
 *   description?: string;
 * }} props
 */
export function AuthPromptModal({
  open,
  onClose,
  returnTo,
  title = "Sign in to continue",
  description = "Log in or create an account to add items to your cart.",
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const navState = returnTo ? { from: returnTo } : undefined;

  return createPortal(
    <div className="modal-root" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <button
        type="button"
        className="modal-backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="modal-card">
        <h2 id="auth-modal-title" className="modal-card__title">
          {title}
        </h2>
        <p className="modal-card__desc muted">{description}</p>
        <div className="modal-card__actions">
          <Link
            to="/auth/login"
            state={navState}
            className="modal-card__primary"
            onClick={onClose}
          >
            Log in
          </Link>
          <Link
            to="/signup"
            state={navState}
            className="modal-card__secondary"
            onClick={onClose}
          >
            Create account
          </Link>
        </div>
        <button type="button" className="modal-card__dismiss" onClick={onClose}>
          Not now
        </button>
      </div>
    </div>,
    document.body
  );
}
