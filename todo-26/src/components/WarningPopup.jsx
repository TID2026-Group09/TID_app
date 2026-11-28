import { Typography, IconButton, Button } from "@mui/material";
import { useEffect } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

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
        // Prevent clicks inside the popup from closing it
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          onClick={onClose}
          aria-label="Close popup"
          className="close-popup-button"
        >
          <CloseOutlinedIcon />
        </IconButton>

        <Typography variant="h2" id="warning-title">
          This Action Cannot Be Undone!
        </Typography>

        <div className="layout-column">
          <div className="popup-message" id="warning-message">
            {message}
          </div>

          <div className="layout-row layout-equal-children">
            <Button variant="contained" onClick={onClose}>
              Cancel
            </Button>

            <Button variant="soft" color="danger" onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
