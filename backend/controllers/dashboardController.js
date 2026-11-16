
const Project = require("../models/project");
const Task = require("../models/task");
const ActivityLog = require("../models/activityLog");

async function getDashboard(req, res) {
    try {
        const isTeamMember = req.user.role === "Team Member";

        const projectFilter = isTeamMember
            ? { members: req.user.userId }
            : {};

        const taskFilter = isTeamMember
            ? { assignedTo: req.user.userId }
            : {};

        const projects = await Project.find(projectFilter)
            .select("_id name status startDate endDate");

        const projectIds = projects.map(project => project._id);

        const totalProjects = projects.length;

        const totalTasks = await Task.countDocuments(taskFilter);

        const completedTasks = await Task.countDocuments({
            ...taskFilter,
            status: "Completed"
        });

        const pendingTasks = await Task.countDocuments({
            ...taskFilter,
            status: "To Do"
        });

        const inProgressTasks = await Task.countDocuments({
            ...taskFilter,
            status: "In Progress"
        });

        const reviewTasks = await Task.countDocuments({
            ...taskFilter,
            status: "Review"
        });

        const overdueTasks = await Task.countDocuments({
            ...taskFilter,
            dueDate: { $lt: new Date() },
            status: { $ne: "Completed" }
        });

        const completionPercentage = totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

        const projectProgress = await Promise.all(
            projects.map(async function (project) {
                const projectTaskFilter = {
                    project: project._id
                };

                const projectTotalTasks = await Task.countDocuments(
                    projectTaskFilter
                );

                const projectCompletedTasks = await Task.countDocuments({
                    ...projectTaskFilter,
                    status: "Completed"
                });

                const progress = projectTotalTasks === 0
                    ? 0
                    : Math.round(
                        (projectCompletedTasks / projectTotalTasks) * 100
                    );

                return {
                    projectId: project._id,
                    projectName: project.name,
                    status: project.status,
                    totalTasks: projectTotalTasks,
                    completedTasks: projectCompletedTasks,
                    progress
                };
            })
        );

        const activityFilter = isTeamMember
            ? { project: { $in: projectIds } }
            : {};

        const recentActivities = await ActivityLog.find(activityFilter)
            .populate("user", "userName")
            .populate("project", "name")
            .populate("task", "title")
            .sort({ createdAt: -1 })
            .limit(5);

        return res.status(200).json({
            message: "Dashboard data retrieved successfully",
            dashboard: {
                totalProjects,
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                reviewTasks,
                overdueTasks,
                completionPercentage,
                projectProgress,
                recentActivities
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve dashboard data",
            error: error.message
        });
    }
}

module.exports = { getDashboard };
