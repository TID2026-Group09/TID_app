import { useState } from "react";
import { createToDo, createDummyListWithId } from "../services/toDoService";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button } from "@mui/material";

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

  // Created a new task and let the user update the information
  async function onDetailedAdd() {
    const dummyList = createDummyListWithId(listId);
    const created = await createToDo(inputValue, dummyList);
    navigate(`/lists/${listId}/${created.id}`);
    setInputValue("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="layout-column">
        <TextField
          size="small"
          label={"Task Name"}
          placeholder={"Enter a task name..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="layout-row-wrap layout-equal-children">
          <Button
            type="submit"
            variant="contained"
            disabled={inputValue.trim().length === 0}
          >
            Quick Add
          </Button>
          <Button
            type="button"
            onClick={onDetailedAdd}
            variant="outlined"
            disabled={inputValue.trim().length === 0}
          >
            Detailed Add
          </Button>
        </div>
      </div>
    </form>
  );
}
