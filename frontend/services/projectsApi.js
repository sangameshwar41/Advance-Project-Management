
import request from "./api";

// Get all projects
export async function getProjects() {
    return await request("/projects");
}

// Create a new project
export async function createProject(projectData) {
    return await request("/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(projectData)
    });
}

// Update a project
export async function updateProject(projectId, projectData) {
    return await request(`/projects/${projectId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(projectData)
    });
}

// Delete a project
export async function deleteProject(projectId) {
    return await request(`/projects/${projectId}`, {
        method: "DELETE"
    });
}
