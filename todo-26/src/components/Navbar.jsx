import { useNavigate, useLocation, replace } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import UserIcon from "./UserIcon";

export default function Navbar({
  user,
  onLogout,
  popupOpen = false,
  closePopup,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === "/";

  function handleBack() {
    // Close popup instead of navigating back
    if (popupOpen) {
      closePopup?.();
      return;
    }

    // Go back if browser history exists, otherwise navigate to landing page
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", (replace = true));
    }
  }

  return (
    <nav className="navbar">
      {/* Empty div serves as placeholder to maintain three-column grid layout  */}
      {isLandingPage ? (
        <div />
      ) : (
        <Button
          color="inherit"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
      )}

      <UserIcon user={user} variant="h2" />

      <Button
        color="inherit"
        endIcon={<LogoutOutlinedIcon />}
        onClick={onLogout}
      >
        Logout
      </Button>
    </nav>
  );
}
