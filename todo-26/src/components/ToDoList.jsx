import TextForm from "./TextForm.jsx";
import ToDoItem from "./ToDoItem.jsx";
import { useState, useEffect } from "react";
import { fetchToDos, createToDo, setToDoDone, deleteToDo, shareList } from "../services/toDoService.js";

export default function ToDoList({list}) {
  const [toDoList, setToDoList] = useState([]);

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

  async function handleToggle(id) {
    const toDo = toDoList.find((t) => t.id === id);
    await setToDoDone(id, !toDo.done);
    setToDoList(
      toDoList.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  async function handleRemove(idToDelete) {
    await deleteToDo(idToDelete);
    setToDoList(toDoList.filter((t) => t.id !== idToDelete));
  }

  async function handleShare(username) {
    await shareList(list, username)
  }

  return (
    <div className="todo-list" style={{backgroundColor: "#e9edc9"}}>
      <h1>{list.get("listName")}</h1>
      <TextForm onButtonClick={handleAdd} buttonText="Add" placeholder="Add a task" />
      <TextForm onButtonClick={handleShare} buttonText="Share list" placeholder="Username to share with" />
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
    </div>
  );
}
