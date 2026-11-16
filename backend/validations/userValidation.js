const { body, validationResult } = require("express-validator");

// Registration validation
const registerValidation = [

    body("userName").trim().notEmpty().withMessage("Username is required").isLength({ min: 8, max: 18 }).withMessage("Username must be between 8 and 18 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must contain at least 8 characters")

];

// Login validation
const loginValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")

];

// Check validation errors
function checkValidation(req, res, next) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array()
        });
    }

    next();
}

module.exports = {
    registerValidation,
    loginValidation,
    checkValidation
};