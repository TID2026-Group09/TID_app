import "./App.css";
import AuthPage from "./pages/AuthPage.jsx";
import ListPage from "./pages/ListPage.jsx";
import { getCurrentUser, logOut } from "./services/authService.js";
import LandingPage from "./pages/LandingPage.jsx";
import TaskDetailsPage from "./pages/TaskDetailsPage.jsx";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

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
      <Navbar user={user} onLogout={handleLogOut} />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/lists/:listId" element={<ListPage />} />
          <Route path="/lists/:listId/:todoId" element={<TaskDetailsPage />} />
          <Route path="*" element={<Link to="/">No such page exists.</Link>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
