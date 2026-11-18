import { useState } from "react";
import WarningPopup from "./WarningPopup";
import { Typography, IconButton } from "@mui/material";

export default function ToDoItem({ ToDoElem, onToggle, onRemove }) {
  const [showWarning, setShowWarning] = useState(false);

  return (
    <li className="layout-row">
      <IconButton
        onClick={() => onToggle(ToDoElem.id)}
        aria-label={ToDoElem.done ? "Mark task as undone" : "Mark task as done"}
        aria-pressed={ToDoElem.done}
      >
        <span
          className={`material-symbols-outlined ${ToDoElem.done ? "filled" : ""}`} // display filled icon variant, if task is done
        >
          {ToDoElem.done ? "check_box" : "check_box_outline_blank"}
        </span>
      </IconButton>

      <span className={ToDoElem.done ? "done" : ""} key={ToDoElem.id}>
        {ToDoElem.taskName}
      </span>

      <IconButton onClick={() => setShowWarning(true)} aria-label="Delete task">
        <span className="material-symbols-outlined delete">delete</span>
      </IconButton>

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
