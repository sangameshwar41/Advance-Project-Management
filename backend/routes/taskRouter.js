
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const taskValidation = require("../validations/taskValidation");
const taskUpdateValidation = require("../validations/taskUpdateValidation");
const { checkValidation } = require("../validations/userValidation");

// Create task
router.post(
    "/",
    authMiddleware,
    authorizeRoles("Admin", "Project Manager"),
    taskValidation,
    checkValidation,
    createTask
);

// Get all tasks
router.get(
    "/",
    authMiddleware,
    getTasks
);

// Get single task
router.get(
    "/:id",
    authMiddleware,
    getTaskById
);

// Update task
router.patch(
    "/:id",
    authMiddleware,
    authorizeRoles("Admin", "Project Manager"),
    taskUpdateValidation,
    checkValidation,
    updateTask
);

// Delete task
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("Admin", "Project Manager"),
    deleteTask
);

module.exports = router;
