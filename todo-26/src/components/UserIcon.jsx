import { Typography } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NoAccountsOutlinedIcon from "@mui/icons-material/NoAccountsOutlined";

export default function UserIcon({ user, username, variant = "body1" }) {
  const name = username ?? user?.get?.("username") ?? user?.username;
  const isUnassigned = !name || name === "Unassigned";

  return (
    <span className="layout-row">
      {isUnassigned ? (
        <NoAccountsOutlinedIcon />
      ) : (
        <AccountCircleOutlinedIcon />
      )}

      <Typography variant={variant}>
        {isUnassigned ? "Unassigned" : name}
      </Typography>
    </span>
  );
}
