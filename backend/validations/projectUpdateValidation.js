
const { body } = require("express-validator");

const projectUpdateValidation = [

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Project name cannot be empty"),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Project description cannot be empty"),

    body("startDate")
        .optional()
        .isISO8601()
        .withMessage("Please provide a valid start date"),

    body("endDate")
        .optional()
        .isISO8601()
        .withMessage("Please provide a valid end date"),

    body("status")
        .optional()
        .isIn(["Planning", "In Progress", "On Hold", "Completed"])
        .withMessage("Invalid project status"),

    body("members")
        .optional()
        .isArray()
        .withMessage("Members must be an array"),

    body("members.*")
        .optional()
        .isMongoId()
        .withMessage("Invalid member ID")

];

module.exports = projectUpdateValidation;
