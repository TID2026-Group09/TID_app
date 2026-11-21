export default function UserIcon({ user, username }) {
  const name = username ?? user?.username;
  const isUnassigned = !name || name === "Unassigned";

  return (
    <span className="layout-row">
      <span className="material-symbols-outlined">
        {isUnassigned ? "account_circle_off" : "account_circle"}
      </span>
      <span>{isUnassigned ? "Unassigned" : name}</span>
    </span>
  );
}
