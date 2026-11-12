import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextForm from "./TextForm.jsx";
import ToDoItem from "./ToDoItem.jsx";
import SharingComponent from "./ShareComponent.jsx";
import {
  fetchToDos,
  createToDo,
  setToDoDone,
  deleteToDo,
} from "../services/toDoService.js";
import { leaveList } from "../services/listMemberService.js";
import { getCurrentUser } from "../services/authService.js";
import WarningPopup from "./WarningPopup.jsx";

export default function ToDoList({ list }) {
  const navigate = useNavigate();
  const [toDoList, setToDoList] = useState([]);
  const [showSharing, setShowSharing] = useState(false);
  const [leavePopup, setLeavePopup] = useState(false);

  // Will run when the component is mounted because of []
  useEffect(() => {
    async function load() {
      setToDoList(await fetchToDos(list));
    }
    load();
  }, []);

  // Passed on to ToDoForm as a prop and used by it to add new tasks
  async function handleAdd(newToDo) {
    const created = await createToDo(newToDo, list);
    setToDoList([...toDoList, created]);
  }

  // Passed to ToDoItem as a prop and used when toggling tasks
  async function handleToggle(id) {
    const toDo = toDoList.find((t) => t.id === id);
    await setToDoDone(id, !toDo.done);
    setToDoList(
      toDoList.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  // Passed to ToDoItem as a prop and used when deleting tasks
  async function handleRemove(idToDelete) {
    await deleteToDo(idToDelete);
    setToDoList(toDoList.filter((t) => t.id !== idToDelete));
  }

  // Passed to WarningPopup as a prop and used to leave a list
  async function handleLeaveList() {
    await leaveList(list);
    setLeavePopup(false);
    navigate("/");
  }

  // Passed to ShareComponent as a prop and used to update the list of tasks after a user is removed
  async function handleRemoveAccess() {
    setToDoList(await fetchToDos(list));
  }

  return (
    <div className="todo-list" style={{ backgroundColor: "#e9edc9" }}>
      <h1>{list.get("listName")}</h1>
      <button onClick={() => setShowSharing(true)}>Share</button>
      <button
        onClick={() => setLeavePopup(true)}
        disabled={
          list.get("owner").get("username") === getCurrentUser().get("username")
        }
      >
        Leave list
      </button>
      <TextForm
        onButtonClick={handleAdd}
        buttonText="Add"
        placeholder="Add a task"
      />
      {toDoList.length === 0 ? (
        <p>No tasks yet. Enjoy your day!</p>
      ) : (
        <ul>
          {toDoList.map((elem) => (
            <ToDoItem
              key={elem.id}
              ToDoElem={elem}
              onToggle={handleToggle}
              onRemove={handleRemove}
            />
          ))}
        </ul>
      )}
      
      {/* Show sharing component when share button is clicked */}
      {showSharing && (
        <SharingComponent
          list={list}
          todos={toDoList}
          onRemoveAccess={handleRemoveAccess}
          onClose={() => setShowSharing(false)}
        />
      )}
      {/* Show leave list warning popup when leave button is clicked */}
      {leavePopup && (
        <WarningPopup
          message={`Are you sure you want to leave the ${list.get("listName")} list?\n\nYou have ${toDoList.filter((todo) => todo.assignee === getCurrentUser().get("username")).length} unfinished task(s) which will become unassigned.`}
          onConfirm={handleLeaveList}
          onClose={() => setLeavePopup(false)}
        />
      )}
    </div>
  );
}
