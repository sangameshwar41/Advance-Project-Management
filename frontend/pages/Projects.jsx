
import { useEffect, useState } from "react";
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject
} from "../services/projectsApi";
import { getUsers } from "../services/userApi";

function Projects() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [members, setMembers] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("Planning");

    const [editingProjectId, setEditingProjectId] = useState(null);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Get projects and users
    async function fetchData() {
        try {
            setError("");

            const projectResponse = await getProjects();
            setProjects(projectResponse.projects);

            if (
                user?.role === "Admin" ||
                user?.role === "Project Manager"
            ) {
                const userResponse = await getUsers();
                setUsers(userResponse.users);
            }
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(function () {
        fetchData();
    }, []);

    // Select or unselect project members
    function handleMemberChange(userId) {
        if (members.includes(userId)) {
            setMembers(members.filter(function (id) {
                return id !== userId;
            }));
        } else {
            setMembers([...members, userId]);
        }
    }

    // Create or update a project
    async function handleSubmitProject(event) {
        event.preventDefault();

        try {
            setError("");
            setMessage("");

            const projectData = {
                name,
                description,
                startDate,
                endDate,
                status,
                members
            };

            if (editingProjectId) {
                await updateProject(editingProjectId, projectData);
                setMessage("Project updated successfully!");
            } else {
                await createProject(projectData);
                setMessage("Project created successfully!");
            }

            resetForm();
            fetchData();
        } catch (error) {
            setError(error.message);
        }
    }

    // Fill the form with existing project details
    function handleEditProject(project) {
        setEditingProjectId(project._id);
        setName(project.name);
        setDescription(project.description);
        setStartDate(project.startDate.slice(0, 10));
        setEndDate(project.endDate.slice(0, 10));
        setStatus(project.status);

        setMembers(
            project.members.map(function (member) {
                return typeof member === "string" ? member : member._id;
            })
        );

        setMessage("");
        setError("");
    }

    // Clear the form
    function resetForm() {
        setEditingProjectId(null);
        setName("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setStatus("Planning");
        setMembers([]);
    }

    // Delete a project
    async function handleDeleteProject(projectId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await deleteProject(projectId);

            setMessage("Project deleted successfully!");
            fetchData();
        } catch (error) {
            setError(error.message);
        }
    }

    const canManage =
        user?.role === "Admin" ||
        user?.role === "Project Manager";

    return (
        <div className="projects-page">
            <h1>Projects Management</h1>

            {canManage && (
                <form
                    className="project-form"
                    onSubmit={handleSubmitProject}
                >
                    <h2>
                        {editingProjectId ? "Edit Project" : "Create Project"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Project Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />

                    <textarea
                        placeholder="Project Description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required
                    />

                    <label>Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(event) => setStartDate(event.target.value)}
                        required
                    />

                    <label>End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                        required
                    />

                    <label>Project Status</label>
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                    >
                        <option value="Planning">Planning</option>
                        <option value="In Progress">In Progress</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <h3>Select Project Members</h3>

                    <div className="project-members">
                        {users.map(function (item) {
                            return (
                                <label key={item._id}>
                                    <input
                                        type="checkbox"
                                        checked={members.includes(item._id)}
                                        onChange={() => handleMemberChange(item._id)}
                                    />
                                    {item.userName} ({item.role})
                                </label>
                            );
                        })}
                    </div>

                    <button type="submit">
                        {editingProjectId ? "Update Project" : "Create Project"}
                    </button>

                    {editingProjectId && (
                        <button type="button" onClick={resetForm}>
                            Cancel
                        </button>
                    )}
                </form>
            )}

            {message && (
                <p className="success-message">{message}</p>
            )}

            {error && (
                <p className="error-message">{error}</p>
            )}

            <h2>All Projects</h2>

            {projects.length === 0 ? (
                <p>No projects found.</p>
            ) : (
                <div className="projects-list">
                    {projects.map(function (project) {
                        return (
                            <div
                                className="project-card"
                                key={project._id}
                            >
                                <h3>{project.name}</h3>

                                <p>{project.description}</p>

                                <p>
                                    <strong>Status:</strong> {project.status}
                                </p>

                                <p>
                                    <strong>Start Date:</strong>{" "}
                                    {project.startDate?.slice(0, 10)}
                                </p>

                                <p>
                                    <strong>End Date:</strong>{" "}
                                    {project.endDate?.slice(0, 10)}
                                </p>

                                {canManage && (
                                    <div className="project-actions">
                                        <button
                                            onClick={() => handleEditProject(project)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeleteProject(project._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Projects;
