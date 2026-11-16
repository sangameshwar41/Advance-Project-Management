
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addComment,
    getTaskComments
} = require("../controllers/commentController");

const commentValidation = require("../validations/commentValidation");
const { checkValidation } = require("../validations/userValidation");

// Add a comment to a task
router.post(
    "/:taskId/comments",
    authMiddleware,
    commentValidation,
    checkValidation,
    addComment
);

// Get all comments for a task
router.get(
    "/:taskId/comments",
    authMiddleware,
    getTaskComments
);

module.exports = router;
