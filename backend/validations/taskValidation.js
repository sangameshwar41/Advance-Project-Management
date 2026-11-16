
const { body } = require("express-validator");

const taskValidation = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Task title is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Task description is required"),

    body("project")
        .notEmpty()
        .withMessage("Project ID is required")
        .isMongoId()
        .withMessage("Invalid project ID"),

    body("assignedTo")
        .notEmpty()
        .withMessage("Assigned user ID is required")
        .isMongoId()
        .withMessage("Invalid assigned user ID"),

    body("priority")
        .optional()
        .isIn(["Low", "Medium", "High", "Critical"])
        .withMessage("Invalid task priority"),

    body("status")
        .optional()
        .isIn(["To Do", "In Progress", "Review", "Completed"])
        .withMessage("Invalid task status"),

    body("dueDate")
        .notEmpty()
        .withMessage("Due date is required")
        .isISO8601()
        .withMessage("Please provide a valid due date")

];

module.exports = taskValidation;
