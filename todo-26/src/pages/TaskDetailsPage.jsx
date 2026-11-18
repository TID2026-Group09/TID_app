import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  fetchToDoById,
  fetchListById,
  updateToDo,
  deleteToDo,
  createDummyListWithId,
} from "../services/toDoService.js";
import { getListMembers } from "../services/listMemberService.js";
import WarningPopup from "../components/WarningPopup.jsx";
// import dayjs from "dayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export default function TaskDetailsPage() {
  const navigate = useNavigate();

  const { listId, todoId } = useParams();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const [members, setMembers] = useState([]);
  const [list, setList] = useState(null);

  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [assignee, setAssignee] = useState("");
  const [note, setNote] = useState("");

  // Keep track of the original date to allow overdue dates to stay, but not new dates in the past
  const [originalDueDate, setOriginalDueDate] = useState("");

  useEffect(() => {
    let cancelled = false; // ignore the result if the user navigates away first

    async function load() {
      setLoading(true);
      try {
        // Fetch the list, members of it and the todo item in parallel
        const pointer = createDummyListWithId(listId);
        const [list, listMembers, todo] = await Promise.all([
          fetchListById(listId),
          getListMembers(pointer),
          fetchToDoById(todoId),
        ]);
        if (cancelled) return;

        setMembers(listMembers);
        setList(list);
        setTaskName(todo.taskName ?? "");
        setDueDate(todo.dueDate ?? "");
        setOriginalDueDate(todo.dueDate ?? "");
        setDueTime(todo.dueTime ?? "");
        setPriority(todo.priority ?? "");
        setDifficulty(todo.difficulty ?? "");
        setAssignee(todo.assignee ?? "");
        setNote(todo.note ?? "");
      } catch (err) {
        if (!cancelled) setLoadError("Task not found.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [listId, todoId]);

  if (loading) return <p>Loading...</p>;
  if (loadError)
    return <Link to={`/lists/${listId}`}>{loadError} Back to list</Link>;

  async function handleSave(e) {
    e.preventDefault();
    if (taskName === "") {
      setSaveError("The task name can't be empty.");
      return;
    }
    if (dueDate !== originalDueDate && isPast(dueDate)) {
      setSaveError("The due date can't be in the past.");
      return;
    }
    try {
      await updateToDo(todoId, {
        taskName,
        dueDate,
        dueTime,
        priority,
        difficulty,
        assignee,
        note,
      });
      navigate(`/lists/${listId}`);
    } catch (err) {
      setSaveError("Could not save the task.");
    }
  }

  async function handleDelete() {
    try {
      await deleteToDo(todoId);
      navigate(`/lists/${listId}`);
    } catch (err) {
      setShowWarning(false);
      setSaveError("Couldn't delete the task.");
    }
  }

  const pad = (n) => String(n).padStart(2, "0");

  // Today as "YYYY-MM-DD" in local time. These strings compare correctly with < and >.
  function todayString() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  const isPast = (date) => date !== "" && date < todayString();

  return (
    <div>
      <Link to={`/lists/${listId}`}>← Back to list</Link>
      <form onSubmit={handleSave}>
        <h1 className="light-header">Task Details</h1>
        <div className="form-field">
          <input
            type="text"
            placeholder="Task name..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>
        <div className="form-field">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <input
            type="time"
            value={dueTime}
            disabled={!dueDate}
            onChange={(e) => setDueTime(e.target.value)}
          />
        </div>
        {/* FOR LATER:
          <DatePicker
          label="Due date"
          minDate={today}
          value={dueDate ? dayjs(dueDate) : null}
          onChange={(v) => {
            const valid = v && v.isValid();
            setDueDate(valid ? v.format("YYYY-MM-DD") : "");
            if (!valid) setDueTime("");
          }}
          slotProps={{ textField: { id: "due-date" } }}
        />

        <TimePicker
          label="Due time"
          ampm={false}
          disabled={!dueDate}
          value={dueTime ? dayjs(`2000-01-01T${dueTime}`) : null} // Arbitrary dummy date for the time picker
          onChange={(v) =>
            setDueTime(v && v.isValid() ? v.format("HH:mm") : "")
          }
          slotProps={{ textField: { id: "due-time" } }}
        /> */}
        <div className="form-field">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="No priority">No priority</option>
            <option value="Low priority">Low priority</option>
            <option value="Medium priority">Medium priority</option>
            <option value="High priority">High priority</option>
          </select>
        </div>
        <div className="form-field">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="No difficulty">No difficulty</option>
            <option value="Low difficulty">Low difficulty</option>
            <option value="Medium difficulty">Medium difficulty</option>
            <option value="High difficulty">High difficulty</option>
          </select>
        </div>
        <div className="form-field">
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="">Unassigned</option>
            <option value={list.get("owner").get("username")}>
              {list.get("owner").get("username")}
            </option>
            {members.map((member) => (
              <option key={member.memberId} value={member.username}>
                {member.username}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <input
            type="text"
            placeholder="Notes..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button type="submit" onClick={handleSave}>
          Save
        </button>
        <button type="button" onClick={() => setShowWarning(true)}>
          Delete
        </button>
        {saveError && (
          <p role="alert" style={{ color: "red" }}>
            {saveError}
          </p>
        )}
      </form>
      {showWarning && (
        <WarningPopup
          message={`Are you sure you want to delete "${taskName}"?`}
          onConfirm={handleDelete}
          onClose={() => setShowWarning(false)}
        />
      )}
    </div>
  );
}
