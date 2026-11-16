
const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getUsers
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    registerValidation,
    loginValidation,
    checkValidation
} = require("../validations/userValidation");

// Register
router.post(
    "/register",
    registerValidation,
    checkValidation,
    registerUser
);

// Login
router.post(
    "/login",
    loginValidation,
    checkValidation,
    loginUser
);

// Get all users - Admin and Project Manager only
router.get(
    "/",
    authMiddleware,
    authorizeRoles("Admin", "Project Manager"),
    getUsers
);

module.exports = router;
