import { useState } from "react";
import { createToDo, createDummyListWithId } from "../services/toDoService";
import { useNavigate, useParams } from "react-router-dom";

export default function AddToDoForm({ onAdd }) {
  const navigate = useNavigate();
  const { listId } = useParams();
  const [inputValue, setInputValue] = useState("");

  // Handle submit manually
  function handleSubmit(e) {
    e.preventDefault();
    onAdd(inputValue);
    setInputValue("");
  }

  async function onDetailedAdd() {
    const dummyList = createDummyListWithId(listId)
    const created = await createToDo(inputValue, dummyList);
    navigate(`/lists/${listId}/${created.id}`);
    setInputValue("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={"Add a task"}
      />
      <button type="submit" disabled={inputValue.trim().length === 0}>Quick Add</button>
      <button type="button" onClick={onDetailedAdd} disabled={inputValue.trim().length === 0}>Detailed Add</button>
    </form>
  );
}
