export default function UserIcon({ user }) {
  return (
    <div className="user-icon" key={user.userId}>
      <span className="material-symbols-outlined">account_circle</span>
      <span>{user.username}</span>
    </div>
  );
}
