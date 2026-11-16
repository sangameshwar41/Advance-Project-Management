
const Task = require("../models/task");
const Project = require("../models/project");
const User = require("../models/user");
const createActivityLog = require("../services/activityLogService");

// Create a new task
async function createTask(req, res) {
    try {
        const {
            title,
            description,
            project,
            assignedTo,
            priority,
            status,
            dueDate
        } = req.body;

        const existingProject = await Project.findById(project);

        if (!existingProject) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Project Managers can create tasks only in their own projects
        if (
            req.user.role === "Project Manager" &&
            existingProject.createdBy.toString() !== req.user.userId
        ) {
            return res.status(403).json({
                message: "You cannot create tasks in another manager's project"
            });
        }

        const existingUser = await User.findById(assignedTo);

        if (!existingUser) {
            return res.status(404).json({
                message: "Assigned user not found"
            });
        }

        if (!existingProject.members.some(
            member => member.toString() === assignedTo
        )) {
            return res.status(400).json({
                message: "Assigned user is not a member of this project"
            });
        }

        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            priority,
            status,
            dueDate,
            createdBy: req.user.userId
        });

        await createActivityLog({
            user: req.user.userId,
            action: "Task Created",
            project: task.project,
            task: task._id,
            details: "Created task: " + task.title
        });

        return res.status(201).json({
            message: "Task created successfully",
            task
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to create task",
            error: error.message
        });
    }
}

// Get all tasks
async function getTasks(req, res) {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            50
        );

        const {
            search,
            status,
            priority,
            project,
            sortBy,
            sortOrder
        } = req.query;

        const filter = {};

        if (req.user.role === "Team Member") {
            filter.assignedTo = req.user.userId;
        }
        else if (req.user.role === "Project Manager") {
            const projects = await Project.find({
                createdBy: req.user.userId
            }).select("_id");

            filter.project = {
                $in: projects.map(item => item._id)
            };
        }

        if (search) {
            const escapedSearch = search.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.title = {
                $regex: escapedSearch,
                $options: "i"
            };
        }

        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        if (project) {
            filter.project = project;
        }

        const allowedSortFields = [
            "title",
            "dueDate",
            "createdAt",
            "priority",
            "status"
        ];

        const sortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";

        const sortDirection = sortOrder === "asc" ? 1 : -1;

        const tasks = await Task.find(filter)
            .populate("project", "name")
            .populate("assignedTo", "userName email")
            .populate("createdBy", "userName email")
            .sort({ [sortField]: sortDirection })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalTasks = await Task.countDocuments(filter);

        return res.status(200).json({
            message: "Tasks retrieved successfully",
            tasks,
            pagination: {
                totalTasks,
                currentPage: page,
                totalPages: Math.ceil(totalTasks / limit)
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve tasks",
            error: error.message
        });
    }
}

// Get a single task
async function getTaskById(req, res) {
    try {
        const filter = {
            _id: req.params.id
        };

        if (req.user.role === "Team Member") {
            filter.assignedTo = req.user.userId;
        }
        else if (req.user.role === "Project Manager") {
            const projects = await Project.find({
                createdBy: req.user.userId
            }).select("_id");

            filter.project = {
                $in: projects.map(item => item._id)
            };
        }

        const task = await Task.findOne(filter)
            .populate("project", "name")
            .populate("assignedTo", "userName email")
            .populate("createdBy", "userName email");

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            task
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve task",
            error: error.message
        });
    }
}

// Update a task
async function updateTask(req, res) {
    try {
        const {
            title,
            description,
            project,
            assignedTo,
            priority,
            status,
            dueDate
        } = req.body;

        const existingTask = await Task.findById(req.params.id);

        if (!existingTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const newProjectId = project || existingTask.project.toString();
        const newAssignedTo = assignedTo || existingTask.assignedTo.toString();

        const existingProject = await Project.findById(newProjectId);

        if (!existingProject) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Project Managers can update only tasks in their own projects
        if (
            req.user.role === "Project Manager" &&
            (
                existingTask.project.toString() !== newProjectId ||
                existingProject.createdBy.toString() !== req.user.userId
            )
        ) {
            return res.status(403).json({
                message: "You cannot update tasks outside your own projects"
            });
        }

        const existingUser = await User.findById(newAssignedTo);

        if (!existingUser) {
            return res.status(404).json({
                message: "Assigned user not found"
            });
        }

        if (!existingProject.members.some(
            member => member.toString() === newAssignedTo
        )) {
            return res.status(400).json({
                message: "Assigned user is not a member of this project"
            });
        }

        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (project !== undefined) updateData.project = project;
        if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
        if (priority !== undefined) updateData.priority = priority;
        if (status !== undefined) updateData.status = status;
        if (dueDate !== undefined) updateData.dueDate = dueDate;

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        await createActivityLog({
            user: req.user.userId,
            action: "Task Updated",
            project: task.project,
            task: task._id,
            details: "Updated task: " + task.title
        });

        return res.status(200).json({
            message: "Task updated successfully",
            task
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to update task",
            error: error.message
        });
    }
}

// Delete a task
async function deleteTask(req, res) {
    try {
        const filter = {
            _id: req.params.id
        };

        if (req.user.role === "Project Manager") {
            const projects = await Project.find({
                createdBy: req.user.userId
            }).select("_id");

            filter.project = {
                $in: projects.map(item => item._id)
            };
        }

        const task = await Task.findOneAndDelete(filter);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        await createActivityLog({
            user: req.user.userId,
            action: "Task Deleted",
            project: task.project,
            task: task._id,
            details: "Deleted task: " + task.title
        });

        return res.status(200).json({
            message: "Task deleted successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to delete task",
            error: error.message
        });
    }
}

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};
