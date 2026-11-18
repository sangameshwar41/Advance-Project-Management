
import request from "./api";

// Get all registered users
export async function getUsers() {
    return await request("/users");
}
