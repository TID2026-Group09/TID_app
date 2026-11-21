import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, IconButton, Chip } from "@mui/material";
import AddToDoForm from "./AddToDoForm.jsx";
import ToDoItem from "./ToDoItem.jsx";
import SharingComponent from "./ShareComponent.jsx";
import {
  fetchToDos,
  createToDo,
  setToDoDone,
  deleteToDo,
} from "../services/toDoService.js";
import {
  prioritizeTasks,
  sortDoneDateDescending,
} from "../services/sortingService.js";
import { leaveList } from "../services/listMemberService.js";
import { getCurrentUser } from "../services/authService.js";
import WarningPopup from "./WarningPopup.jsx";
import { getChipColor } from "../utils/chipUtils.js";

export default function ToDoList({ list }) {
  const navigate = useNavigate();
  const [toDoList, setToDoList] = useState([]);
  const [showSharing, setShowSharing] = useState(false);
  const [leavePopup, setLeavePopup] = useState(false);

  const completedToDos = sortDoneDateDescending(
    toDoList.filter((elem) => elem.done),
  );

  const prioritizedTasks = [...toDoList].sort(prioritizeTasks);

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

  // Used when checking or unchecking tasks (also updates the doneDate)
  async function handleToggle(id) {
    const toDo = toDoList.find((t) => t.id === id);
    const updated = await setToDoDone(id, !toDo.done);
    setToDoList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t)),
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
    <div>
      <Typography variant="h1">{list.get("listName")}</Typography>
      <div className="layout-column">
        <div className="layout-row-wrap layout-equal-children">
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

          <Button variant="outlined" onClick={() => setShowSharing(true)}>
            Share List
          </Button>
        </div>

        <div className="surface">
          <Typography variant="h2">Add New Task</Typography>
          <AddToDoForm onAdd={handleAdd} label={"Task Name"} />
        </div>

        <div className="surface">
          <Typography variant="h2">Tasks to Do</Typography>
          {prioritizedTasks.filter((elem) => elem.done === false).length ===
          0 ? (
            <Typography>No tasks yet. Enjoy your day!</Typography>
          ) : (
            <ul className="layout-column">
              {prioritizedTasks
                .filter((elem) => elem.done === false)
                .map((elem) => (
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

        <div className="surface">
          <Typography variant="h2">Completed Tasks</Typography>
          {completedToDos.filter((elem) => elem.done === true).length === 0 ? (
            <Typography>No tasks have been completed yet.</Typography>
          ) : (
            <ul className="layout-column">
              {completedToDos
                .filter((elem) => elem.done === true)
                .map((elem) => (
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
    </div>
  );
}
