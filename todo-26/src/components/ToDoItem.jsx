import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WarningPopup from "./WarningPopup";
import { Typography, IconButton, Chip } from "@mui/material";
import UserIcon from "./UserIcon";
import { isOverdue, formatDate } from "../services/dateService";
import { getChipColor } from "../utils/chipUtils";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

export default function ToDoItem({ ToDoElem, onToggle, onRemove }) {
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();
  const { listId } = useParams();

  function openDetails() {
    navigate(`/lists/${listId}/${ToDoElem.id}`);
  }

  return (
    <li>
      <div
        className="layout-row"
        style={{ opacity: ToDoElem.done ? 0.5 : 1, flex: 1 }}
      >
        <IconButton
          onClick={() => onToggle(ToDoElem.id)}
          aria-label={
            ToDoElem.done ? "Mark task as undone" : "Mark task as done"
          }
          aria-pressed={ToDoElem.done}
          sx={{ color: "primary.dark" }}
        >
          {ToDoElem.done ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
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
          <DeleteOutlinedIcon sx={{ color: "secondary.dark" }} />
        </IconButton>
      </div>

      <div className="layout-row-wrap" onClick={openDetails}>
        <Chip
          label={formatDate(ToDoElem)}
          color={
            isOverdue(ToDoElem.dueDate, ToDoElem.dueTime) ? "high" : "neutral"
          }
        />
        <Chip
          label={ToDoElem.priority}
          color={getChipColor(ToDoElem.priority)}
        />
        <Chip
          label={ToDoElem.difficulty}
          color={getChipColor(ToDoElem.difficulty)}
        />
        <Chip
          label={<UserIcon username={ToDoElem.assignee} />}
          color="neutral"
        />
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
