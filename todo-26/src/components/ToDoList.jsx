import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, IconButton } from "@mui/material";
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
    <div className="layout-column">
      <div className="layout-row layout-between">
        <Typography variant="h1">{list.get("listName")}</Typography>

        <IconButton
          onClick={() => setShowSharing(true)}
          aria-label="Share list"
          sx={{ mt: -4 }}
        >
          <span className="material-symbols-outlined large">group</span>
        </IconButton>
      </div>

      <div className="layout-row layout-equal-children">
        <Button
          variant="soft"
          color="danger"
          onClick={() => setLeavePopup(true)}
          disabled={
            list.get("owner").get("username") ===
            getCurrentUser().get("username")
          }
        >
          Leave List
        </Button>

        <Button
          variant="soft"
          color="danger"
          // TODO: Implement delete list functionality
          disabled={
            list.get("owner").get("username") !==
            getCurrentUser().get("username")
          }
        >
          Delete List
        </Button>
      </div>

      <div className="surface">
        <Typography variant="h2">Add New Task</Typography>
        <TextForm
          onButtonClick={handleAdd}
          buttonText="Add"
          label={"Task Name"}
          placeholder="Enter a task name..."
        />
      </div>

      <div className="surface">
        <Typography variant="h2">Tasks to Do</Typography>
        {toDoList.length === 0 ? (
          <Typography>No tasks yet. Enjoy your day!</Typography>
        ) : (
          <ul className="layout-column">
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
      </div>

      <div className="surface" style={{ opacity: 0.5 }}>
        <Typography variant="h2">Completed Tasks</Typography>
        {/* TODO: Add functionality for displaying completed tasks */}
      </div>

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
          message={
            <div className="layout-column">
              <Typography>
                Are you sure you want to{" "}
                <strong className="text-emphasized">
                  leave the "{list.get("listName")}" list
                </strong>
                ?
              </Typography>
              <Typography>
                You have{" "}
                <strong className="text-emphasized">
                  {
                    toDoList.filter(
                      (todo) =>
                        todo.assignee === getCurrentUser().get("username"),
                    ).length
                  }{" "}
                  unfinished task(s){" "}
                </strong>
                which will become unassigned.
              </Typography>
            </div>
          }
          onConfirm={handleLeaveList}
          onClose={() => setLeavePopup(false)}
        />
      )}
    </div>
  );
}
