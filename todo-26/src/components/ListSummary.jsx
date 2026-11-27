import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import SimpleToDoItem from "./SimpleToDoItem.jsx";
import {
  fetchToDos,
  setToDoDone,
  deleteToDo,
} from "../services/toDoService.js";
import { prioritizeTasks } from "../services/sortingService.js";
import { getCurrentUser } from "../services/authService.js";

export default function ToDoList({ list }) {
  const [toDoList, setToDoList] = useState([]);

  // Filter and sort tasks to only have active tasks that are either
  // assigned to the current user or not assigned
  const relevantTasks = [...toDoList]
    .filter(
      (elem) =>
        elem.done == false &&
        (elem.assignee === getCurrentUser().get("username") ||
          elem.assignee === "Unassigned"),
    )
    .sort(prioritizeTasks);

  // Filter tasks with and without dueDate after priority
  const tasksWithDate = [...relevantTasks].filter((elem) => elem.dueDate);
  const tasksWithoutDate = [...relevantTasks].filter((elem) => !elem.dueDate);

  const tasksPerList = 1;

  const visibleTasks = [
    ...tasksWithDate.slice(0, tasksPerList),
    ...tasksWithoutDate.slice(0, tasksPerList),
  ];

  // Fetch all the to dos for the list on mount
  useEffect(() => {
    async function load() {
      setToDoList(await fetchToDos(list));
    }
    load();
    // const interval = setInterval(load, 5000);
    // return () => clearInterval(interval);
  }, []);

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

  return (
    <div>
      <Link to={`/lists/${list.id}`} className="text-link">
        <Typography variant="h2">{list.get("listName")}</Typography>
      </Link>
      <div className="layout-column">
        {relevantTasks.filter((elem) => elem.done === false).length === 0 ? (
          <>
            <Typography>
              No tasks are unassigned or assigned to you on this list.
            </Typography>
            <Typography>
              There are{" "}
              <strong className="text-emphasized">
                {toDoList.filter((elem) => !elem.done).length} active task(s)
              </strong>{" "}
              assigned to other people.
            </Typography>
          </>
        ) : (
          <ul className="layout-column">
            {visibleTasks.map((task) => (
              <SimpleToDoItem
                key={task.id}
                ToDoElem={task}
                onToggle={handleToggle}
                onRemove={handleRemove}
                listId={list.id}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
