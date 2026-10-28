import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

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
        setError("This list doesn't exist or you don't have access to it.");
      }
    }

    load();
  }, [listId]);

  if (error) {
    return (
      <div>
        <p style={{ color: "white" }}>{error}</p>
        <Link to="/">← Back to lists</Link>
      </div>
    );
  }

  if (!list) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link to="/">← Back to all lists</Link>
      <ToDoList key={list.id} list={list} />
    </div>
  );
}
