
const Task = require("../models/task");
const Project = require("../models/project");
const User = require("../models/user");

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

        // Check whether the project exists
        const existingProject = await Project.findById(project);

        if (!existingProject) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Check whether the assigned user exists
        const existingUser = await User.findById(assignedTo);

        if (!existingUser) {
            return res.status(404).json({
                message: "Assigned user not found"
            });
        }

        // Check whether the assigned user is a project member
        if (!existingProject.members.some(
            member => member.toString() === assignedTo
        )) {
            return res.status(400).json({
                message: "Assigned user is not a member of this project"
            });
        }

        // Create a new task
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
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const tasks = await Task.find()
            .populate("project", "name")
            .populate("assignedTo", "userName email")
            .populate("createdBy", "userName email")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalTasks = await Task.countDocuments();

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
        const task = await Task.findById(req.params.id)
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

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

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
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

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
