import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography } from "@mui/material";
import ToDoList from "../components/ToDoList.jsx";
import { fetchListById } from "../services/toDoService.js";
import { ArrowBackOutlined } from "@mui/icons-material";

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
        <Typography color="error">{error}</Typography>
        <Link to="/" className="text-link">
          <ArrowBackOutlined />
          Back to all lists
        </Link>
      </div>
    );
  }

  if (!list) {
    return <Typography>Loading...</Typography>;
  }

  return <ToDoList key={list.id} list={list} />;
}
