const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 18,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["Admin", "Project Manager", "Team Member"],
        default: "Team Member"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);