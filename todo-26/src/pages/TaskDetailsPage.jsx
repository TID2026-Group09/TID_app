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
import {
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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

  if (loading) return <Typography>Loading...</Typography>;
  if (loadError)
    return (
      <Link className="text-link" to={`/lists/${listId}`}>
        {loadError}← Back to list
      </Link>
    );

  async function handleSave(e) {
    e.preventDefault();
    if (taskName === "") {
      setSaveError("The task name cannot be empty.");
      return;
    }
    if (dueDate !== originalDueDate && isPast(dueDate)) {
      setSaveError("The due date cannot be in the past.");
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
      setSaveError("Could not delete the task.");
    }
  }

  const pad = (n) => String(n).padStart(2, "0");

  // Today as "YYYY-MM-DD" in local time. These strings compare correctly with < and >.
  function todayString() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  const isPast = (date) => date !== "" && date < todayString();

  const getChipColor = (value) => {
    if (value.startsWith("Low")) return "low";
    if (value.startsWith("Medium")) return "medium";
    if (value.startsWith("High")) return "high";

    return "neutral";
  };

  return (
    <div>
      <Typography variant="h2">
        <Link className="text-link" to={`/lists/${listId}`}>
          ← Back to list
        </Link>
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form className="layout-column" onSubmit={handleSave}>
          <Typography variant="h1">Task Details</Typography>

          <div className="layout-column">
            <div className="form-field">
              <TextField
                fullWidth
                type="text"
                label={"Task Name"}
                placeholder={"Task name..."}
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>

            <div className="form-field layout-row layout-equal-children">
              <DatePicker
                label="Due Date"
                format="DD-MM-YYYY"
                minDate={dayjs(todayString())}
                // minDate={dayjs(originalDueDate || todayString())} // Allow for an already overdue task to retain its original date
                value={dueDate ? dayjs(dueDate) : null}
                onChange={(v) => {
                  const valid = v && v.isValid();
                  setDueDate(valid ? v.format("YYYY-MM-DD") : "");
                  if (!valid) setDueTime("");
                }}
                slotProps={{ textField: { id: "due-date" } }}
              />

              <TimePicker
                label="Due Time"
                ampm={false}
                disabled={!dueDate}
                value={dueTime ? dayjs(`2000-01-01T${dueTime}`) : null} // Arbitrary dummy date for the time picker
                onChange={(v) =>
                  setDueTime(v && v.isValid() ? v.format("HH:mm") : "")
                }
                slotProps={{ textField: { id: "due-time" } }}
              />
            </div>

            <div className="form-field">
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priority}
                  label="Priority"
                  onChange={(e) => setPriority(e.target.value)}
                  renderValue={(value) => (
                    <Chip label={value} color={getChipColor(value)} />
                  )}
                >
                  <MenuItem value="No Priority">No Priority</MenuItem>
                  <MenuItem value="Low Priority">Low Priority</MenuItem>
                  <MenuItem value="Medium Priority">Medium Priority</MenuItem>
                  <MenuItem value="High Priority">High Priority</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="form-field">
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={difficulty}
                  label="Difficulty"
                  onChange={(e) => setDifficulty(e.target.value)}
                  renderValue={(value) => (
                    <Chip label={value} color={getChipColor(value)} />
                  )}
                >
                  <MenuItem value="No Difficulty">No Difficulty</MenuItem>
                  <MenuItem value="Low Difficulty">Low Difficulty</MenuItem>
                  <MenuItem value="Medium Difficulty">
                    Medium Difficulty
                  </MenuItem>
                  <MenuItem value="High difficulty">High Difficulty</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="form-field">
              <FormControl fullWidth>
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={assignee}
                  label="Assignee"
                  onChange={(e) => setAssignee(e.target.value)}
                  renderValue={(value) => (
                    <Chip label={value || "Unassigned"} color="neutral" />
                  )}
                >
                  <MenuItem value="Unassigned">Unassigned</MenuItem>
                  <MenuItem value={list.get("owner").get("username")}>
                    {list.get("owner").get("username")}
                  </MenuItem>
                  {members.map((member) => (
                    <MenuItem key={member.memberId} value={member.username}>
                      {member.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="form-field">
              <TextField
                fullWidth
                type="text"
                label="Notes"
                placeholder="Notes..."
                value={note}
                multiline={true}
                minRows={3}
                maxRows={10}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <div className="form-field layout-row layout-equal-children">
            <Button type="submit" variant="contained" onClick={handleSave}>
              Save
            </Button>
            <Button
              type="button"
              variant="soft"
              color="danger"
              onClick={() => setShowWarning(true)}
            >
              Delete
            </Button>
          </div>
          {saveError && (
            <Typography role="alert" color="error">
              {saveError}
            </Typography>
          )}
        </form>
      </LocalizationProvider>
      {showWarning && (
        <WarningPopup
          message={
            <div className="layout-column">
              <Typography>
                Are you sure that you want to permanently{" "}
                <strong className="text-emphasized">
                  delete the "{taskName}" task
                </strong>
                ?
              </Typography>
              <Typography>
                Once deleted, the task cannot be restored.
              </Typography>
            </div>
          }
          onConfirm={handleDelete}
          onClose={() => setShowWarning(false)}
        />
      )}
    </div>
  );
}
