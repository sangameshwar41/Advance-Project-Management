
const ActivityLog = require("../models/activityLog");
const Project = require("../models/project");

// Get activity logs
async function getActivityLogs(req, res) {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);

        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            50
        );

        const filter = {};

        // Team Members can see activity from their projects only
        if (req.user.role === "Team Member") {
            const projects = await Project.find({
                members: req.user.userId
            }).select("_id");

            const projectIds = projects.map(project => project._id);

            filter.project = { $in: projectIds };
        }

        const activityLogs = await ActivityLog.find(filter)
            .populate("user", "userName email")
            .populate("project", "name")
            .populate("task", "title")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalActivities = await ActivityLog.countDocuments(filter);

        return res.status(200).json({
            message: "Activity logs retrieved successfully",
            activityLogs,
            pagination: {
                totalActivities,
                currentPage: page,
                totalPages: Math.ceil(totalActivities / limit)
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve activity logs",
            error: error.message
        });
    }
}

module.exports = { getActivityLogs };
