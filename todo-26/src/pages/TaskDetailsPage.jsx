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
import "dayjs/locale/da";
import { getChipColor } from "../utils/chipUtils.js";
import UserIcon from "../components/UserIcon.jsx";
import { ArrowBackOutlined } from "@mui/icons-material";

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

  if (loadError) {
    return (
      <div className="layout-column">
        <Typography color="error">{loadError}</Typography>
        <Link to={`/lists/${listId}`} className="text-link">
          <ArrowBackOutlined />
          Back to list
        </Link>
      </div>
    );
  }

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

  // The below pad and todayString can be simplified using dayjs

  // const pad = (n) => String(n).padStart(2, "0");

  // // Today as "YYYY-MM-DD" in local time. These strings compare correctly with < and >.
  // function todayString() {
  //   const d = new Date();
  //   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  // }

  // Can replace pad and todayString above
  const todayString = () => dayjs().format("YYYY-MM-DD");

  const isPast = (date) => date !== "" && date < todayString();

  const PRIORITY_OPTIONS = [
    "No Priority",
    "Low Priority",
    "Medium Priority",
    "High Priority",
  ];

  const DIFFICULTY_OPTIONS = [
    "No Difficulty",
    "Low Difficulty",
    "Medium Difficulty",
    "High Difficulty",
  ];

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="da">
        <form className="layout-column" onSubmit={handleSave}>
          <Typography variant="h1">Task Details</Typography>

          <div className="layout-column">
            <div className="form-field">
              <TextField
                fullWidth
                label={"Task Name"}
                placeholder={"Task name..."}
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>

            <div className="form-field layout-row layout-equal-children">
              <DatePicker
                label="Due Date"
                // Can be left out when setting adapterLocale="da" in LocalizationProvider,
                // however, the display format will be DD.MM.YYYY, i.e., "." instead of "-"
                format="DD-MM-YYYY"
                displayWeekNumber
                minDate={dayjs(todayString())}
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
                // Can be left out when setting adapterLocale="da" in LocalizationProvider
                // ampm={false}
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
                  // Render selected priority as color-coded chip inside closed input
                  renderValue={(value) => (
                    <Chip label={value} color={getChipColor(value)} />
                  )}
                >
                  {/* Render each priority option as matching color-coded chip */}
                  {PRIORITY_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      <Chip label={option} color={getChipColor(option)} />
                    </MenuItem>
                  ))}
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
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      <Chip label={option} color={getChipColor(option)} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="form-field">
              <FormControl fullWidth>
                <InputLabel>Assignee</InputLabel>
                <Select
                  // Fall back to "Unassigned" when assignee state is "" (unassigned in DB)
                  value={assignee || "Unassigned"}
                  label="Assignee"
                  onChange={(e) => setAssignee(e.target.value)}
                  // Render selected assignee (or Unassigned) as a neutral chip inside the closed input
                  renderValue={(value) => (
                    <Chip
                      label={<UserIcon username={value || "Unassigned"} />}
                      color="neutral"
                    />
                  )}
                >
                  {/* Unassigned default option */}
                  <MenuItem value="Unassigned">
                    <Chip
                      label={<UserIcon username="Unassigned" />}
                      color="neutral"
                    />
                  </MenuItem>
                  {/* List owner option */}
                  <MenuItem value={list.get("owner").get("username")}>
                    <Chip
                      label={
                        <UserIcon
                          username={list.get("owner").get("username")}
                        />
                      }
                      color="neutral"
                    />
                  </MenuItem>
                  {/* List member options */}
                  {members.map((member) => (
                    <MenuItem key={member.memberId} value={member.username}>
                      <Chip
                        label={<UserIcon username={member.username} />}
                        color="neutral"
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="form-field">
              <TextField
                fullWidth
                label="Notes"
                placeholder="Notes..."
                value={note}
                multiline
                minRows={3}
                maxRows={10}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <div className="form-field layout-row layout-equal-children">
            <Button type="submit" variant="contained">
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
