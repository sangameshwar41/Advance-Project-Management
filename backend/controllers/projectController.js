
const Project = require("../models/project");

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

        const project = await Project.create({
            name,
            description,
            startDate,
            endDate,
            status,
            members,
            createdBy: req.user.userId
        });

        return res.status(201).json({
            message: "Project created successfully",
            projectDetails:project
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to create project",
            error: error.message
        });
    }
}

// Get all projects

async function getProjects(req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const projects = await Project.find()
            .populate("createdBy", "userName email")
            .populate("members", "userName email")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalProjects = await Project.countDocuments();

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
        const project = await Project.findById(req.params.id)
            .populate("createdBy", "userName email")
            .populate("members", "userName email");

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        return res.status(200).json({
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

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

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
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

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
