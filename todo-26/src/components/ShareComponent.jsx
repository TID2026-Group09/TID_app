// import {
//   shareList,
//   getListMembers,
//   removeUserFromList,
// } from "../services/toDoService.js";
import {shareList, getListMembers, removeUserFromList} from "../services/listMemberService.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserIcon from "./UserIcon.jsx";
import TextForm from "./TextForm.jsx";
import WarningPopup from "./WarningPopup.jsx";
import { getCurrentUser } from "../services/authService.js";

export default function ShareComponent({
  list,
  todos,
  onRemoveAccess,
  onClose,
}) {
  const navigate = useNavigate();
  // Get the list of members with access to the list
  const [members, setMembers] = useState([]);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [error, setError] = useState("");

  async function fetchMembers() {
    setMembers(await getListMembers(list));
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  // Close the popup when the Escape key is pressed
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Handle sharing of the list
  async function handleShare(username) {
    setError("");
    try {
      await shareList(list, username);
      await fetchMembers();
    } catch (err) {
      setError(err.message);
    }
  }

  // Remove the user's access and update member and to-do lists in UI
  async function handleUnshare(member) {
    const isSelf = member.username === (await getCurrentUser()).get("username");

    await removeUserFromList(list, member.memberId);

    if (isSelf) {
      // They no longer have access to the list, so leave instead of refetching
      navigate("/");
      return;
    }

    await fetchMembers();
    onRemoveAccess();
  }

  // Number of assinged tasks for the member that is about to be removed (for the warning message)
  const unfinishedCount = memberToRemove
    ? todos.filter((todo) => todo.assignee === memberToRemove.username).length
    : 0;

  return (
    <>
      <div className="popup-overlay" onClick={onClose}>
        <div
          className="popup"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="popup-title"
          aria-describedby="popup-message"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="popup-header">
            <h2 className="popup-title">Share list</h2>
            <button
              className="popup-close"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <TextForm
            onButtonClick={handleShare}
            buttonText="Share list"
            placeholder="Username to share with"
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <p>Owner</p>
          <UserIcon user={{ username: list.get("owner").get("username") }} />
          <p>Currently shared with</p>
          {members.length === 0 ? (
            <p>The list hasn't been shared with anyone yet.</p>
          ) : (
            <ul className="shared-list">
              {members.map((member) => (
                <li className="shared-with" key={member.memberId}>
                  <UserIcon user={member} />
                  <button
                    onClick={() => setMemberToRemove(member)}
                    aria-label={`Unshare list with ${member.username}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* One warning popup, for the member that was clicked */}
      {memberToRemove && (
        <WarningPopup
          message={`Are you sure you want to remove ${memberToRemove.username}'s access to the ${list.get("listName")} list?\n\nThey have ${unfinishedCount} unfinished task(s) which will become unassigned.`}
          onConfirm={async () => {
            await handleUnshare(memberToRemove);
            setMemberToRemove(null);
          }}
          onClose={() => setMemberToRemove(null)}
        />
      )}
    </>
  );
}
