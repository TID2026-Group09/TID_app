import Parse from "./parse.js";

const ListMember = Parse.Object.extend("ListMember");
const ToDoItem = Parse.Object.extend("ToDoItem");

// Gives another existing user read and write access to a list and all its tasks
// through ACL and creates a ListMember object to keep track of the sharing
export async function shareList(list, username) {
  const user = await new Parse.Query(Parse.User)
    .equalTo("username", username)
    .first();

  if (!user) {
    throw new Error("User not found");
  }

 // Update the list's ACL first, so everything below can reuse it
  const acl = list.getACL();
  acl.setReadAccess(user, true);
  acl.setWriteAccess(user, true);
  list.setACL(acl);

  // Existing member rows: let the new user see them
  const existingMembers = await new Parse.Query(ListMember)
    .equalTo("list", list)
    .find();
  existingMembers.forEach((m) => m.setACL(acl));

  if (existingMembers.filter((m) => m.get("user").id === user.id).length > 0) {
    throw new Error("User already has access to this list");
  }

  if (list.get("owner").id === user.id) {
    throw new Error("The owner already has access to this list");
  }

  // New member row: visible to the owner, existing members and the new user
  const member = new ListMember();
  member.set("list", list);
  member.set("user", user);
  member.setACL(acl);

  const todos = await new Parse.Query(ToDoItem).equalTo("list", list).find();
  todos.forEach((todo) => todo.setACL(acl));

  await Parse.Object.saveAll([member, list, ...existingMembers, ...todos]);
}

// Removes a user's access to a list and all its tasks through ACL and deletes the ListMember row
export async function removeUserFromList(list, memberId) {
  // Verify that the member belongs to the list
  const member = await new Parse.Query(ListMember)
    .include("user")
    .get(memberId);

  if (member.get("list").id !== list.id) {
    throw new Error("Member does not belong to this list");
  }

  // Remove the user's access to the list and all its tasks
  const user = member.get("user");
  const todos = await new Parse.Query(ToDoItem).equalTo("list", list).find();
  const otherMembers = await new Parse.Query(ListMember)
    .equalTo("list", list)
    .notEqualTo("objectId", member.id)
    .find();

  const acl = list.getACL();
  acl.setReadAccess(user, false);
  acl.setWriteAccess(user, false);
  list.setACL(acl);

  // Remove the assignedTo field from tasks that were assigned to the user being removed
  todos.forEach((todo) => {
    if (todo.get("assignee") === user.get("username")) {
      todo.unset("assignee");
    }
    todo.setACL(acl);
  });

  // Other members' rows will no longer be visible to the removed user
  otherMembers.forEach((m) => m.setACL(acl));

  await Parse.Object.saveAll([list, ...todos, ...otherMembers]);
  await member.destroy();
}

// Removes the current user's access to a list and all its tasks through ACL and deletes the ListMember row
export async function leaveList(list) {
  const member = await new Parse.Query(ListMember)
    .equalTo("list", list)
    .equalTo("user", Parse.User.current())
    .first();

  if (!member) {
    throw new Error("You are not a member of this list");
  }

  await removeUserFromList(list, member.id);
}

// Fetch a list of all users that have access to a list
export async function getListMembers(list) {
  const members = await new Parse.Query(ListMember)
    .equalTo("list", list)
    .include("user")
    .find();

  return members.map((member) => ({
    memberId: member.id,
    userId: member.get("user").id,
    username: member.get("user").get("username"),
  }));
}