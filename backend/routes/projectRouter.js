
const express = require("express");
const router = express.Router();


const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const projectUpdateValidation = require("../validations/projectUpdateValidation");

const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

const projectValidation = require("../validations/projectValidation");
const { checkValidation } = require("../validations/userValidation");

// Create project
router.post(
    "/",
    authMiddleware,
    authorizeRoles("Admin", "Project Manager"),
    projectValidation,
    checkValidation,
    createProject
);

// Get all projects
router.get("/", authMiddleware, getProjects);

// Get single project
router.get("/:id", authMiddleware, getProjectById);

// Update project
router.patch(
    "/:id",
    authMiddleware,
    authorizeRoles("Admin", "Project Manager"),
    projectUpdateValidation,
    checkValidation,
    updateProject
);

// Delete project
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("Admin", "Project Manager"),
    deleteProject
);

module.exports = router;
