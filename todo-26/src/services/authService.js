import Parse from "./parse.js";

export async function signUp(username, password) {
    const user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    await user.signUp();

    const acl = new Parse.ACL(user);
    acl.setPublicReadAccess(true);
    user.setACL(acl);
    await user.save();

    return user;
}

export function logIn(username, password) {
    return Parse.User.logIn(username, password);
}

export function logOut() {
    return Parse.User.logOut();
}

export function getCurrentUser() {
    return Parse.User.current();
}