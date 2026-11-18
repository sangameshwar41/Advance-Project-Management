
import request from "./api";

// Register a new user
export async function registerUser(userData) {
    return await request("/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });
}

// Login user
export async function loginUser(loginData) {
    return await request("/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    });
}
