import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NoAccountsOutlinedIcon from "@mui/icons-material/NoAccountsOutlined";

export default function UserIcon({ user, username }) {
  const name = username ?? user?.username;
  const isUnassigned = !name || name === "Unassigned";

  return (
    <span className="layout-row">
      {isUnassigned ? (
        <NoAccountsOutlinedIcon />
      ) : (
        <AccountCircleOutlinedIcon />
      )}
      <span>{isUnassigned ? "Unassigned" : name}</span>
    </span>
  );
}
