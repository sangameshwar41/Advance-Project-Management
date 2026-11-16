
const Project = require("../models/project");
const User = require("../models/user");
const createActivityLog = require("../services/activityLogService");

// Create a new project
async function createProject(req, res) {
    try {
        const {
            name,
            description,
            startDate,
            endDate,
            status,
            members
        } = req.body;

        // Validate project members
        if (members !== undefined) {
            if (!Array.isArray(members)) {
                return res.status(400).json({
                    message: "Members must be an array"
                });
            }

            const memberIds = [...new Set(members.map(String))];

            const existingUsers = await User.find({
                _id: { $in: memberIds }
            }).select("_id");

            if (existingUsers.length !== memberIds.length) {
                return res.status(400).json({
                    message: "One or more project members do not exist"
                });
            }
        }

        const project = await Project.create({
            name,
            description,
            startDate,
            endDate,
            status,
            members,
            createdBy: req.user.userId
        });

        await createActivityLog({
            user: req.user.userId,
            action: "Project Created",
            project: project._id,
            details: "Created project: " + project.name
        });

        return res.status(201).json({
            message: "Project created successfully",
            projectDetails: project
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to create project",
            error: error.message
        });
    }
}

// Get all projects with search, filter, sorting and pagination
async function getProjects(req, res) {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);

        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            50
        );

        const { search, status, sortBy, sortOrder } = req.query;

        const filter = {};

        // Restrict projects based on user role
        if (req.user.role === "Team Member") {
            filter.members = req.user.userId;
        }
        else if (req.user.role === "Project Manager") {
            filter.createdBy = req.user.userId;
        }

        // Search by project name
        if (search) {
            const escapedSearch = search.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.name = {
                $regex: escapedSearch,
                $options: "i"
            };
        }

        // Filter by project status
        if (status) {
            filter.status = status;
        }

        // Sorting
        const allowedSortFields = [
            "name",
            "createdAt",
            "startDate",
            "endDate"
        ];

        const sortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";

        const sortDirection = sortOrder === "asc" ? 1 : -1;

        const projects = await Project.find(filter)
            .populate("createdBy", "userName email")
            .populate("members", "userName email")
            .sort({ [sortField]: sortDirection })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalProjects = await Project.countDocuments(filter);

        return res.status(200).json({
            message: "Projects retrieved successfully",
            projects,
            pagination: {
                totalProjects,
                currentPage: page,
                totalPages: Math.ceil(totalProjects / limit)
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve projects",
            error: error.message
        });
    }
}

// Get a single project
async function getProjectById(req, res) {
    try {
        const filter = {
            _id: req.params.id
        };

        // Restrict project access based on role
        if (req.user.role === "Team Member") {
            filter.members = req.user.userId;
        }
        else if (req.user.role === "Project Manager") {
            filter.createdBy = req.user.userId;
        }

        const project = await Project.findOne(filter)
            .populate("createdBy", "userName email")
            .populate("members", "userName email");

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        return res.status(200).json({
            message: "Project retrieved successfully",
            project
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve project",
            error: error.message
        });
    }
}

// Update a project
async function updateProject(req, res) {
    try {
        const {
            name,
            description,
            startDate,
            endDate,
            status,
            members
        } = req.body;

        const filter = {
            _id: req.params.id
        };

        // Project Managers can update only their own projects
        if (req.user.role === "Project Manager") {
            filter.createdBy = req.user.userId;
        }

        const existingProject = await Project.findOne(filter);

        if (!existingProject) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Validate project members
        if (members !== undefined) {
            if (!Array.isArray(members)) {
                return res.status(400).json({
                    message: "Members must be an array"
                });
            }

            const memberIds = [...new Set(members.map(String))];

            const existingUsers = await User.find({
                _id: { $in: memberIds }
            }).select("_id");

            if (existingUsers.length !== memberIds.length) {
                return res.status(400).json({
                    message: "One or more project members do not exist"
                });
            }
        }

        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (startDate !== undefined) updateData.startDate = startDate;
        if (endDate !== undefined) updateData.endDate = endDate;
        if (status !== undefined) updateData.status = status;
        if (members !== undefined) updateData.members = members;

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        await createActivityLog({
            user: req.user.userId,
            action: "Project Updated",
            project: project._id,
            details: "Updated project: " + project.name
        });

        return res.status(200).json({
            message: "Project updated successfully",
            project
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to update project",
            error: error.message
        });
    }
}

// Delete a project
async function deleteProject(req, res) {
    try {
        const filter = {
            _id: req.params.id
        };

        // Project Managers can delete only their own projects
        if (req.user.role === "Project Manager") {
            filter.createdBy = req.user.userId;
        }

        const project = await Project.findOneAndDelete(filter);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        await createActivityLog({
            user: req.user.userId,
            action: "Project Deleted",
            project: project._id,
            details: "Deleted project: " + project.name
        });

        return res.status(200).json({
            message: "Project deleted successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to delete project",
            error: error.message
        });
    }
}

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
};
