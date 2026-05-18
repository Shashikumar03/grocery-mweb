import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * @param {{
 *   open: boolean;
 *   onClose: () => void;
 *   title?: string;
 *   message: string;
 *   confirmLabel?: string;
 *   variant?: "error" | "default";
 *   autoCloseMs?: number;
 * }} props
 */
export function AlertModal({
  open,
  onClose,
  title = "Something went wrong",
  message,
  confirmLabel = "OK",
  variant = "default",
  autoCloseMs,
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const timer =
      autoCloseMs != null && autoCloseMs > 0
        ? window.setTimeout(onClose, autoCloseMs)
        : undefined;
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      if (timer != null) window.clearTimeout(timer);
    };
  }, [open, onClose, autoCloseMs]);

  if (!open || !message) return null;

  return createPortal(
    <div
      className="modal-root"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-modal-title"
      aria-describedby="alert-modal-desc"
    >
      <button
        type="button"
        className="modal-backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className={`modal-card${variant === "error" ? " modal-card--error" : ""}`}
      >
        <h2 id="alert-modal-title" className="modal-card__title">
          {title}
        </h2>
        <p id="alert-modal-desc" className="modal-card__desc">
          {message}
        </p>
        <div className="modal-card__actions">
          <button
            type="button"
            className="modal-card__primary"
            onClick={onClose}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
