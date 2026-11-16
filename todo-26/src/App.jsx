import "./App.css";
import AuthPage from "./pages/AuthPage.jsx";
import ListPage from "./pages/ListPage.jsx";
import { getCurrentUser, logOut } from "./services/authService.js";
import ListOverview from "./components/ListOverview.jsx";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

function App() {
  const [user, setUser] = useState(getCurrentUser());

  function handleAuthenticated(loggedInUser) {
    setUser(loggedInUser);
  }

  async function handleLogOut() {
    await logOut();
    setUser(null);
    window.history.replaceState(null, "", import.meta.env.BASE_URL);
  }

  if (!user) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="layout-row layout-between">
        <Typography variant="h2">
          Logged in as: {user.get("username")}
        </Typography>
        <Button variant="contained" onClick={handleLogOut}>
          Log Out
        </Button>
      </div>
      <Routes>
        <Route path="/" element={<ListOverview />} />
        <Route path="/lists/:listId" element={<ListPage />} />
        <Route path="*" element={<Link to="/">No such page exists.</Link>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
