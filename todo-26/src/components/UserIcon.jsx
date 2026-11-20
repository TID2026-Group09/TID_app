export default function UserIcon({ user, username }) {
  const name = username ?? user?.username;

  return (
    <span className="layout-row">
      <span className="material-symbols-outlined">account_circle</span>
      <span>{name}</span>
    </span>
  );
}