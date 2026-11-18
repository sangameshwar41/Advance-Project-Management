
import { useEffect, useState } from "react";
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} from "../services/taskApi";
import { getProjects } from "../services/projectsApi";
import TaskComments from "../components/TaskComments";

function Tasks() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [project, setProject] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const canManage =
        user?.role === "Admin" ||
        user?.role === "Project Manager";

    // Get tasks and projects
    async function fetchData() {
        try {
            setError("");

            const taskResponse = await getTasks();
            const projectResponse = await getProjects();

            setTasks(taskResponse.tasks);
            setProjects(projectResponse.projects);
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(function () {
        fetchData();
    }, []);

    // Get members of selected project
    const selectedProject = projects.find(function (item) {
        return item._id === project;
    });

    // Create a new task
    async function handleCreateTask(event) {
        event.preventDefault();

        try {
            setError("");
            setMessage("");

            await createTask({
                title,
                description,
                project,
                assignedTo,
                priority,
                dueDate
            });

            setMessage("Task created successfully!");

            setTitle("");
            setDescription("");
            setProject("");
            setAssignedTo("");
            setPriority("Medium");
            setDueDate("");

            fetchData();
        } catch (error) {
            setError(error.message);
        }
    }

    // Update task status
    async function handleStatusUpdate(taskId, status) {
        try {
            setError("");

            await updateTask(taskId, { status });
            fetchData();
        } catch (error) {
            setError(error.message);
        }
    }

    // Delete task
    async function handleDeleteTask(taskId) {
        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }

        try {
            setError("");

            await deleteTask(taskId);
            setMessage("Task deleted successfully!");
            fetchData();
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="tasks-page">
            <h1>Tasks Management</h1>

            {canManage && (
                <form
                    className="task-form"
                    onSubmit={handleCreateTask}
                >
                    <h2>Create Task</h2>

                    <input
                        type="text"
                        placeholder="Task Title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                    />

                    <textarea
                        placeholder="Task Description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required
                    />

                    <label>Select Project</label>
                    <select
                        value={project}
                        onChange={(event) => {
                            setProject(event.target.value);
                            setAssignedTo("");
                        }}
                        required
                    >
                        <option value="">Select Project</option>

                        {projects.map(function (item) {
                            return (
                                <option key={item._id} value={item._id}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>

                    <label>Assign Team Member</label>
                    <select
                        value={assignedTo}
                        onChange={(event) => setAssignedTo(event.target.value)}
                        required
                        disabled={!project}
                    >
                        <option value="">Select Team Member</option>

                        {selectedProject?.members?.map(function (member) {
                            return (
                                <option key={member._id} value={member._id}>
                                    {member.userName}
                                </option>
                            );
                        })}
                    </select>

                    <label>Priority</label>
                    <select
                        value={priority}
                        onChange={(event) => setPriority(event.target.value)}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>

                    <label>Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(event) => setDueDate(event.target.value)}
                        required
                    />

                    <button type="submit">Create Task</button>
                </form>
            )}

            {message && (
                <p className="success-message">{message}</p>
            )}

            {error && (
                <p className="error-message">{error}</p>
            )}

            <h2>All Tasks</h2>

            {tasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                <div className="tasks-list">
                    {tasks.map(function (task) {
                        return (
                            <div className="task-card" key={task._id}>
                                <h3>{task.title}</h3>

                                <p>{task.description}</p>

                                <p>
                                    <strong>Priority:</strong> {task.priority}
                                </p>

                                <p>
                                    <strong>Status:</strong> {task.status}
                                </p>

                                <p>
                                    <strong>Due Date:</strong>{" "}
                                    {task.dueDate?.slice(0, 10)}
                                </p>

                                {canManage && (
                                    <div className="task-actions">
                                        <label>Update Status</label>

                                        <select
                                            value={task.status}
                                            onChange={(event) =>
                                                handleStatusUpdate(
                                                    task._id,
                                                    event.target.value
                                                )
                                            }
                                        >
                                            <option value="To Do">To Do</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Review">Review</option>
                                            <option value="Completed">Completed</option>
                                        </select>

                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleDeleteTask(task._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}

                                <div className="task-comments">
                                    <TaskComments taskId={task._id} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Tasks;
