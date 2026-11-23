import Parse from "./parse.js";

const ToDoItem = Parse.Object.extend("ToDoItem");
const List = Parse.Object.extend("List");
const ListMember = Parse.Object.extend("ListMember");

// Converts a Parse object to a plain JS object.
// Pointers need to fetch their related class before they can proceed.
function toPlainObject(parseObject) {
  const list = parseObject.get("list");
  const assignee = parseObject.get("assignee");
  const priority = parseObject.get("priority");
  const difficulty = parseObject.get("difficulty");
  return {
    id: parseObject.id,
    createdAt: parseObject.createdAt,
    taskName: parseObject.get("taskName"),
    done: parseObject.get("done"),
    doneDate: parseObject.get("doneDate"),
    dueDate: parseObject.get("dueDate"),
    dueTime: parseObject.get("dueTime"),
    priority: priority ? priority : "No Priority",
    difficulty: difficulty ? difficulty : "No Difficulty",
    assignee: assignee ? assignee : "Unassigned",
    note: parseObject.get("note"),
    list: list ? list.id : null,
  };
}

// Converts a date and time string to a JS Date object. If no time is provided, it defaults to 23:59 (end of day).
export function convertToDateObject(date, time) {
  return new Date(`${date}T${time || "23:59"}`);
}

export function isOverdue(date, time) {
  if (!date) {
    return false;
  }

  return convertToDateObject(date, time) < new Date();
}

// For when the whole list isn't needed
export function createDummyListWithId(listId) {
  return List.createWithoutData(listId);
}

// Creates a new list for the current user
export async function createList(title) {
  const currentUser = Parse.User.current();

  const list = new List();

  list.set("listName", title);
  list.set("owner", currentUser);

  list.setACL(new Parse.ACL(currentUser));

  return await list.save();
}

// Delete all list memberships and to dos for a list and then the list
export async function deleteList(list) { 
  console.log(list, list instanceof Parse.Object);
  const members = await new Parse.Query(ListMember).equalTo("list", list).findAll();
  const todos = await new Parse.Query(ToDoItem).equalTo("list", list).findAll();

  await Parse.Object.destroyAll([...members, ...todos]);
  await list.destroy();
}

// Fetch all lists for the current user (based on ACL)
export async function fetchLists() {
  const query = new Parse.Query(List);
  query.include("owner");
  return await query.find();
}

// Fetch a specific list for the current user (the user must have ACL)
export async function fetchListById(listId) {
  const query = new Parse.Query(List);
  query.include("owner");
  return await query.get(listId);
}

// Fetch a specific task
export async function fetchToDoById(todoId) {
  const query = new Parse.Query(ToDoItem);
  return toPlainObject(await query.get(todoId));
}

// Fetches all active (undone) tasks for the currently logged in user
export async function fetchToDos(list) {
  const query = new Parse.Query(ToDoItem);
  query.equalTo("list", list);
  query.ascending("createdAt");

  const results = await query.find();
  return results.map(toPlainObject);
}

// Checks if a state of a task/item is empty and unsets it
function setOrUnset(item, field, value) {
  if (value === undefined || value == null || value === "") {
    item.unset(field);
  } else {
    item.set(field, value);
  }
}

//
function applyDetails(item, details = {}) {
  const { taskName, dueDate, dueTime, priority, difficulty, assignee, note } =
    details;

  if (taskName !== undefined) {
    item.set("taskName", taskName.trim());
  }

  // Due date and time (a time without a date is not allowed)
  if (dueDate !== undefined) {
    setOrUnset(item, "dueDate", dueDate);
    if (!dueDate) item.unset("dueTime");
  }
  if (dueTime !== undefined && dueDate !== "") {
    setOrUnset(item, "dueTime", dueTime);
  }

  // "No Priority" and "No Difficulty" is stored as the default options
  if (priority !== undefined) {
    item.set("priority", priority || "No Priority");
  }
  if (difficulty !== undefined) {
    item.set("difficulty", difficulty || "No Difficulty");
  }

  // Unassinged = no value in the database in case of username "Unassigned"
  if (assignee !== undefined) {
    setOrUnset(item, "assignee", assignee === "Unassigned" ? "" : assignee);
  }

  setOrUnset(item, "note", note);
}

// Creates a new task for the current user
export async function createToDo(taskName, list, details = {}) {
  const item = new ToDoItem();

  item.set("taskName", taskName);
  item.set("done", false);
  item.set("list", list);
  item.set("priority", "No Priority");
  item.set("difficulty", "No Difficulty");

  applyDetails(item, { ...details, taskName });

  const acl = list.getACL();
  item.setACL(acl);
  return toPlainObject(await item.save());
}

// Update the details of an existing to-do
export async function updateToDo(id, details) {
  const item = ToDoItem.createWithoutData(id);
  applyDetails(item, details);
  return toPlainObject(await item.save());
}

// Updates the "done" status of a task with a given id
export async function setToDoDone(id, done) {
  const item = ToDoItem.createWithoutData(id);
  item.set("done", done);
  item.set("doneDate", done ? new Date() : null);

  return toPlainObject(await item.save());
}

// Deletes a task with a given id
export async function deleteToDo(id) {
  const item = ToDoItem.createWithoutData(id);
  await item.destroy();
}
