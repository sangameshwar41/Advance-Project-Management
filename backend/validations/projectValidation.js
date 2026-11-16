
const { body } = require("express-validator");

const projectValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Project name is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Project description is required"),

    body("startDate")
        .notEmpty()
        .withMessage("Start date is required")
        .isISO8601()
        .withMessage("Please provide a valid start date"),

    body("endDate")
        .notEmpty()
        .withMessage("End date is required")
        .isISO8601()
        .withMessage("Please provide a valid end date")
        .custom((endDate, { req }) => {
            if (new Date(endDate) < new Date(req.body.startDate)) {
                throw new Error("End date cannot be before start date");
            }

            return true;
        }),

    body("status")
        .optional()
        .isIn(["Planning", "In Progress", "On Hold", "Completed"])
        .withMessage("Invalid project status")

];

module.exports = projectValidation;
