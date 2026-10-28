export default function ToDoItem({ ToDoElem, onToggle, onRemove }) {
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
      <button className="delete-button" onClick={() => onRemove(ToDoElem.id)}>
        <span className="material-symbols-outlined">delete</span>
      </button>
    </li>
  );
}
