import Parse from "./parse.js";

const ToDoItem = Parse.Object.extend("ToDoItem");
const List = Parse.Object.extend("List");

// Converts a Parse object to a plain JS object.
// Pointers need to fetch their related class before they can proceed.
function toPlainObject(parseObject) {
  const list = parseObject.get("list");
  const assignee = parseObject.get("assignee");
  const priority = parseObject.get("priority");
  const difficulty = parseObject.get("difficulty");
  return {
    id: parseObject.id,
    taskName: parseObject.get("taskName"),
    done: parseObject.get("done"),
    doneDate: parseObject.get("doneDate"),
    dueDate: parseObject.get("dueDate"),
    priority: priority ? priority : "No priority",
    difficulty: difficulty ? difficulty : "No difficulty",
    assignee: assignee ? assignee : "Unassigned",
    note: parseObject.get("note"),
    list: list ? list.id : null,
  };
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

// Fetch all lists for the current user (based on ACL)
export async function fetchLists() {
  const query = new Parse.Query(List);
  return await query.find();
}

// Fetch a specific list for the current user (the user must have ACL)
export async function fetchListById(listId) {
  const query = new Parse.Query(List);
  return await query.get(listId);
}

// Fetches all active (undone) tasks for the currently logged in user
export async function fetchToDos(list) {
  const query = new Parse.Query(ToDoItem);
  query.equalTo("list", list);
  query.equalTo("done", false);
  query.ascending("createdAt");

  const results = await query.find();
  return results.map(toPlainObject);
}

// Creates a new task for the current user
export async function createToDo(taskName, list) {
  const item = new ToDoItem();

  item.set("taskName", taskName);
  item.set("done", false);
  item.set("list", list);

  const acl = list.getACL();
  item.setACL(acl);
  return toPlainObject(await item.save());
}

// Updates the "done" status of a task with a given id
export async function setToDoDone(id, done) {
  const item = ToDoItem.createWithoutData(id);
  item.set("done", done);
  return toPlainObject(await item.save());
}

// Deletes a task with a given id
export async function deleteToDo(id) {
  const item = ToDoItem.createWithoutData(id);
  await item.destroy();
}
