
import request from "./api";

// Get comments for a task
export async function getComments(taskId) {
    return await request(`/tasks/${taskId}/comments`);
}

// Add a comment to a task
export async function addComment(taskId, content) {
    return await request(`/tasks/${taskId}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ content })
    });
}
