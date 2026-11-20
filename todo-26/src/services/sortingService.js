import { convertToDateObject } from "./toDoService";

// Constants for prioritizing tasks
const PRIORITY_RANK = {
  "High priority": 0,
  "Medium priority": 1,
  "Low priority": 2,
};
const DIFFICULTY_RANK = {
  "High difficulty": 0,
  "Medium difficulty": 1,
  "Low difficulty": 2,
};
const rank = (map, value) => map[value] ?? 3; // anything else (incl. "No difficulty") = 3

const dueTimestamp = (t) =>
  t.dueDate
    ? convertToDateObject(t.dueDate, t.dueTime).getTime()
    : Number.MAX_SAFE_INTEGER; // no date sorts after every real date

// Comparator for a sorting function. || only returns truthy values, meaning non-zero values,
// so tie-breakers will move on to the next comparison. If the number is negative, a goes before b.
// If positive, b goes before a.
export function prioritizeTasks(a, b) {
  return (
    dueTimestamp(a) - dueTimestamp(b) ||
    rank(PRIORITY_RANK, a.priority) - rank(PRIORITY_RANK, b.priority) ||
    rank(DIFFICULTY_RANK, a.difficulty) - rank(DIFFICULTY_RANK, b.difficulty) ||
    a.createdAt - b.createdAt
  );
}

export function sortDoneDateDescending(list) {
  const sortedToDos = [...list].sort((a, b) => {
    const aTime = a.doneDate ? new Date(a.doneDate).getTime() : null;
    const bTime = b.doneDate ? new Date(b.doneDate).getTime() : null;

    if (aTime === null && bTime === null) return 0;
    if (aTime === null) return 1;
    if (bTime === null) return -1;
    return bTime - aTime;
  });

  return sortedToDos;
}
