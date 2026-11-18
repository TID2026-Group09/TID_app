import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { Typography } from "@mui/material";

import ToDoList from "../components/ToDoList.jsx";
import { fetchListById } from "../services/toDoService.js";

export default function ListPage() {
  const { listId } = useParams();
  const [list, setList] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setList(await fetchListById(listId));
      } catch (error) {
        setError("This list does not exist, or you do not have access to it.");
      }
    }

    load();
  }, [listId]);

  if (error) {
    return (
      <div className="layout-column">
        <Typography color="danger">{error}</Typography>
        <Typography variant="h2">
          <Link to="/" className="text-link">
            ← Back to all lists
          </Link>
        </Typography>
      </div>
    );
  }

  if (!list) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div className="layout-column">
      <Typography variant="h2">
        <Link to="/" className="text-link">
          ← Back to all lists
        </Link>
      </Typography>
      <ToDoList key={list.id} list={list} />
    </div>
  );
}
