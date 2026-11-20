import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WarningPopup from "./WarningPopup";
import { Typography, IconButton } from "@mui/material";

export default function ToDoItem({ ToDoElem, onToggle, onRemove }) {
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();
  const { listId } = useParams();

  function openDetails() {
    navigate(`/lists/${listId}/${ToDoElem.id}`);
  }

  return (
    <li className="layout-row">
      <div style={{ opacity: ToDoElem.done ? 0.5 : 1, flex: 1 }}>
        <IconButton
          onClick={() => onToggle(ToDoElem.id)}
          aria-label={
            ToDoElem.done ? "Mark task as undone" : "Mark task as done"
          }
          aria-pressed={ToDoElem.done}
        >
          <span
            className={`material-symbols-outlined ${ToDoElem.done ? "filled" : ""}`} // display filled icon variant, if task is done
          >
            {ToDoElem.done ? "check_box" : "check_box_outline_blank"}
          </span>
        </IconButton>

        <span
          className={ToDoElem.done ? "done" : ""}
          role="button"
          tabIndex={0}
          onClick={openDetails}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openDetails();
            }
          }}
          aria-label={`Edit task: ${ToDoElem.taskName}`}
        >
          {ToDoElem.taskName}
        </span>

        <IconButton
          onClick={() => setShowWarning(true)}
          aria-label="Delete task"
        >
          <span className="material-symbols-outlined delete">delete</span>
        </IconButton>
      </div>

      {/* Show warning popup when delete button is clicked */}
      {showWarning && (
        <WarningPopup
          message={
            <div className="layout-column">
              <Typography>
                Are you sure that you want to{" "}
                <strong className="text-emphasized">
                  permanently delete the "{ToDoElem.taskName}" task
                </strong>
                ?
              </Typography>
              <Typography>
                Once deleted, the task cannot be restored.
              </Typography>
            </div>
          }
          onConfirm={() => onRemove(ToDoElem.id)}
          onClose={() => setShowWarning(false)}
        />
      )}
    </li>
  );
}
