// import {
//   shareList,
//   getListMembers,
//   removeUserFromList,
// } from "../services/toDoService.js";
import { Typography, Button, IconButton } from "@mui/material";
import {
  shareList,
  getListMembers,
  removeUserFromList,
} from "../services/listMemberService.js";
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

  // Number of assigned tasks for the member that is about to be removed (for the warning message)
  const unfinishedCount = memberToRemove
    ? todos.filter((todo) => todo.assignee === memberToRemove.username).length
    : 0;

  return (
    <>
      <div className="popup-overlay" onClick={onClose}>
        <div
          className="popup"
          role="alertdialog"
          // Accessibility attributes for screen readers
          aria-modal="true"
          aria-labelledby="popup-title"
          aria-describedby="popup-message"
          // Prevent clicks inside the popup from closing it
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            onClick={onClose}
            aria-label="Close popup"
            className="close-popup-button"
          >
            <span className="material-symbols-outlined">close</span>
          </IconButton>

          <Typography variant="h2" id="popup-title">
            List Sharing
          </Typography>

          <div className="layout-column">
            <Typography id="popup-message">
              Manage who has access to this list and share it with other users.
            </Typography>

            <TextForm
              onButtonClick={handleShare}
              buttonText="Share"
              label={"Username"}
              placeholder="Enter a username..."
            />
            {error && <Typography color="error">{error}</Typography>}
            <Typography>Owner:</Typography>
            <UserIcon user={{ username: list.get("owner").get("username") }} />
            <Typography>Currently shared with:</Typography>
            {members.length === 0 ? (
              <Typography>
                The list has not been shared with anyone yet.
              </Typography>
            ) : (
              <ul className="layout-column">
                {members.map((member) => (
                  <li
                    className="layout-row layout-between"
                    key={member.memberId}
                  >
                    <UserIcon user={member} />
                    <Button
                      variant="outlined"
                      color="danger"
                      size="small"
                      onClick={() => setMemberToRemove(member)}
                      aria-label={`Unshare list with ${member.username}`}
                    >
                      Unshare
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* One warning popup, for the member that was clicked */}
      {memberToRemove && (
        <WarningPopup
          message={
            <div className="layout-column">
              <Typography>
                Are you sure you want to{" "}
                <strong className="text-emphasized">
                  {" "}
                  remove {memberToRemove.username}'s access to the "
                  {list.get("listName")}" list
                </strong>
                ?
              </Typography>
              <Typography>
                They have{" "}
                <strong className="text-emphasized">
                  {unfinishedCount} unfinished task(s)
                </strong>{" "}
                which will become unassigned.
              </Typography>
            </div>
          }
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
