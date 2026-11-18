import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import TextForm from "./TextForm.jsx";
import { fetchLists, createList } from "../services/toDoService.js";

export default function ListOverview() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    async function load() {
      setLists(await fetchLists());
    }
    load();
  }, []);

  async function handleAddList(name) {
    const created = await createList(name);
    setLists([...lists, created]);
  }

  return (
    <>
      <Typography variant="h1">My Lists</Typography>
      <div className="layout-column">
        <Typography variant="b1">
          Create lists and see your most important tasks for each list, based on
          their due date and priority.
        </Typography>
        <TextForm
          onButtonClick={handleAddList}
          buttonText="Create List"
          label={"List Name"}
          placeholder="Enter a list name..."
        />

        {lists.length === 0 ? (
          <>
            <Typography>You do not currently have any lists.</Typography>

            <Typography>
              To add a task, you first need to create a list for it to belong
              to. Once you have created a list, you can keep it private or share
              it with other users.
            </Typography>
          </>
        ) : (
          <ul className="layout-column">
            {lists.map((list) => (
              <li key={list.id} className="surface">
                <Link to={`/lists/${list.id}`} className="text-link">
                  <Typography variant="h2">{list.get("listName")}</Typography>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
