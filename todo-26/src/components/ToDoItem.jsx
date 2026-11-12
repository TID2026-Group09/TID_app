import { useState } from "react";
import WarningPopup from "./WarningPopup";

export default function ToDoItem({ ToDoElem, onToggle, onRemove }) {
  const [showWarning, setShowWarning] = useState(false);
  
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={ToDoElem.done}
        onChange={() => onToggle(ToDoElem.id)}
      />
      <span className={ToDoElem.done ? "done" : ""} key={ToDoElem.id}>
        {ToDoElem.taskName}
      </span>
      <button className="delete-button" onClick={() => setShowWarning(true)}>
        <span className="material-symbols-outlined">delete</span>
      </button>
      
      {/* Show warning popup when delete button is clicked */}
      {showWarning && (
        <WarningPopup
          message={`Are you sure you want to delete "${ToDoElem.taskName}"?`}
          onConfirm={() => onRemove(ToDoElem.id)}
          onClose={() => setShowWarning(false)}
        />
      )}
    </li>
  );
}
