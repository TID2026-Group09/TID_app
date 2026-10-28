import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
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

    return (<div>
        <TextForm onButtonClick={handleAddList} buttonText="Create list" placeholder="New list name" />
        {lists.length === 0 ? (
            <p style={{ color: "white" }}>No lists yet</p>
        ) : (
            <ul>
                {lists.map((list) => (
                    <li key={list.id}>
                        <Link to={`/lists/${list.id}`}>{list.get("listName")}</Link>
                    </li>
                ))}
            </ul>
        )}
    </div>)
}