
const Comment = require("../models/comment");
const Task = require("../models/task");

// Add a comment to a task
async function addComment(req, res) {
    try {
        const { content } = req.body;
        const { taskId } = req.params;

        // Check whether the task exists
        const existingTask = await Task.findById(taskId);

        if (!existingTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Create a comment
        const comment = await Comment.create({
            task: taskId,
            user: req.user.userId,
            content
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

        // Check whether the task exists
        const existingTask = await Task.findById(taskId);

        if (!existingTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Retrieve comments
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
