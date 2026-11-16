
const { body } = require("express-validator");

const taskUpdateValidation = [

    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Task title cannot be empty"),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Task description cannot be empty"),

    body("project")
        .optional()
        .isMongoId()
        .withMessage("Invalid project ID"),

    body("assignedTo")
        .optional()
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
        .optional()
        .isISO8601()
        .withMessage("Please provide a valid due date")

];

module.exports = taskUpdateValidation;
