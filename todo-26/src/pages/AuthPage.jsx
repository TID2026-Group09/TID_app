import { useState } from "react";
import { signUp, logIn } from "../services/authService";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function AuthPage({ onAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignUp(e) {
    e.preventDefault();
    setError("");
    try {
      onAuthenticated(await signUp(username, password));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLogIn(e) {
    e.preventDefault();
    setError("");
    try {
      onAuthenticated(await logIn(username, password));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <Typography variant="h1">Welcome</Typography>
      <form onSubmit={handleLogIn}>
        <div className="layout-column">
          {error && (
            <Typography variant="body1" color="danger">
              {error}
            </Typography>
          )}

          <TextField
            label="Username"
            placeholder="Enter a username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            placeholder="Enter a password..."
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="layout-row layout-equal-children">
            <Button type="submit" variant="contained" color="primary">
              Log In
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
