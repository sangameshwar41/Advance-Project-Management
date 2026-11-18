
import request from "./api";

// Get all tasks
export async function getTasks() {
    return await request("/task");
}

// Create a new task
export async function createTask(taskData) {
    return await request("/task", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
    });
}

// Update a task
export async function updateTask(taskId, taskData) {
    return await request(`/task/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
    });
}

// Delete a task
export async function deleteTask(taskId) {
    return await request(`/task/${taskId}`, {
        method: "DELETE"
    });
}
