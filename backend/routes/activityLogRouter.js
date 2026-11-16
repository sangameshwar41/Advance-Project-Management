
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getActivityLogs
} = require("../controllers/activityLogController");

// Get all activity logs
router.get(
    "/",
    authMiddleware,
    getActivityLogs
);

module.exports = router;
