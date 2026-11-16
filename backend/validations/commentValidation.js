
const { body } = require("express-validator");

const commentValidation = [

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Comment content is required")

];

module.exports = commentValidation;
