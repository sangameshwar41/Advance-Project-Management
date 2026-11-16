
const Comment = require("../models/comment");
const Task = require("../models/task");
const Project = require("../models/project");
const createActivityLog = require("../services/activityLogService");

// Check whether the user can access the task
async function checkTaskAccess(taskId, user) {
    const task = await Task.findById(taskId);

    if (!task) {
        return {
            status: 404,
            message: "Task not found"
        };
    }

    // Admin can access all tasks
    if (user.role === "Admin") {
        return { task };
    }

    // Project Manager can access tasks in projects they created
    if (user.role === "Project Manager") {
        const project = await Project.findOne({
            _id: task.project,
            createdBy: user.userId
        });

        if (!project) {
            return {
                status: 403,
                message: "You do not have permission to access this task"
            };
        }

        return { task };
    }

    // Team Member can access only assigned tasks
    if (user.role === "Team Member") {
        if (task.assignedTo.toString() !== user.userId) {
            return {
                status: 403,
                message: "You do not have permission to access this task"
            };
        }

        return { task };
    }

    return {
        status: 403,
        message: "You do not have permission to access this task"
    };
}

// Add a comment to a task
async function addComment(req, res) {
    try {
        const { content } = req.body;
        const { taskId } = req.params;

        const access = await checkTaskAccess(taskId, req.user);

        if (!access.task) {
            return res.status(access.status).json({
                message: access.message
            });
        }

        const existingTask = access.task;

        const comment = await Comment.create({
            task: taskId,
            user: req.user.userId,
            content
        });

        await createActivityLog({
            user: req.user.userId,
            action: "Comment Added",
            project: existingTask.project,
            task: existingTask._id,
            details: "Added a comment to task: " + existingTask.title
        });

        return res.status(201).json({
            message: "Comment added successfully",
            comment
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to add comment",
            error: error.message
        });
    }
}

// Get all comments for a task
async function getTaskComments(req, res) {
    try {
        const { taskId } = req.params;

        const access = await checkTaskAccess(taskId, req.user);

        if (!access.task) {
            return res.status(access.status).json({
                message: access.message
            });
        }

        const comments = await Comment.find({ task: taskId })
            .populate("user", "userName email")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            message: "Comments retrieved successfully",
            comments
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve comments",
            error: error.message
        });
    }
}

module.exports = {
    addComment,
    getTaskComments
};
