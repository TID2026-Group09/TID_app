import Parse from "./parse.js";

const ToDoItem = Parse.Object.extend("ToDoItem");
const List = Parse.Object.extend("List");
const ListMember = Parse.Object.extend("ListMember");

// Converts a Parse object to a plain JS object.
// Pointers need to fetch their related class before they can proceed.
function toPlainObject(parseObject) {
  const owner = parseObject.get("owner");
  const list = parseObject.get("list");
  return {
    id: parseObject.id,
    taskName: parseObject.get("taskName"),
    done: parseObject.get("done"),
    owner: owner ? owner.id : null,
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

// Gives another existing user read and write access to a list and all its tasks
// through ACL and creates a ListMember object to keep track of the sharing
export async function shareList(list, username) {
  const user = await new Parse.Query(Parse.User)
    .equalTo("username", username)
    .first();

  if (!user) {
    throw new Error("User not found");
  }

  const member = new ListMember();
  member.set("list", list);
  member.set("user", user);
  const memberAcl = new Parse.ACL(Parse.User.current());
  memberAcl.setReadAccess(user, true);
  memberAcl.setWriteAccess(user, true);
  member.setACL(memberAcl);

  const acl = list.getACL();
  acl.setReadAccess(user, true);
  acl.setWriteAccess(user, true);
  list.setACL(acl);
  const todos = await new Parse.Query(ToDoItem).equalTo("list", list).find();
  todos.forEach((todo) => todo.setACL(acl));

  await Parse.Object.saveAll([member, list, ...todos]);
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
