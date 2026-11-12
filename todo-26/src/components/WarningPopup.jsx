import { useEffect } from "react";

export default function WarningPopup({ message, onConfirm, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Confirm the action and close the popup
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup"
        role="alertdialog"
        // Accessibility attributes for screen readers
        aria-modal="true"
        aria-labelledby="warning-title"
        aria-describedby="warning-message"
        // Stop popup from closing when clicking inside the popup
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-header">
          <p className="popup-title">
            This action cannot be undone!
          </p>
          <button
            className="popup-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="popup-message">
          {message}
        </p>

        <div className="popup-actions">
          <button className="popup-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="popup-confirm" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}