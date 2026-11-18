export default function UserIcon({ user }) {
  return (
    <div className="layout-row" key={user.userId}>
      <span className="material-symbols-outlined">account_circle</span>
      <span>{user.username}</span>
    </div>
  );
}
