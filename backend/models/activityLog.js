const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    action: {
        type: String,
        required: true,
        trim: true
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },

    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    },

    details: {
        type: String,
        trim: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);