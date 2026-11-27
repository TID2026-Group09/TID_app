import dayjs from "dayjs";

// Format a date to the European date format
export function formatDate(elem) {
    if (elem.dueDate && elem.dueTime) {
      return `${dayjs(elem.dueDate).format("DD-MM-YYYY")}, ${elem.dueTime}`;
    } else if (elem.dueDate) {
      return `${dayjs(elem.dueDate).format("DD-MM-YYYY")}`;
    } else {
      return "No Date";
    }
  }

// Converts a date and time string to a JS Date object. If no time is provided, it defaults to 23:59 (end of day).
export function convertToDateObject(date, time) {
  return new Date(`${date}T${time || "23:59"}`);
}

// Returns true is a date and time string is overdue
export function isOverdue(date, time) {
  if (!date) {
    return false;
  }

  return convertToDateObject(date, time) < new Date();
}