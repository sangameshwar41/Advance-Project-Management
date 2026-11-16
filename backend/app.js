
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRouter");
const authMiddleware = require("./middleware/authMiddleware");
const projectRoutes = require("./routes/projectRouter");
const taskRoutes = require("./routes/taskRouter");
const commentRoutes = require("./routes/commentRouter");
const activityLogRoutes = require("./routes/activityLogRouter");
const dashboardRoutes = require("./routes/dashboardRouter");

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

// User routes
app.use("/api/users", userRoutes);
app.use("/api/projects",projectRoutes)
app.use("/api/task",taskRoutes)
app.use("/api/tasks", commentRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/dashboard", dashboardRoutes);



// Home route
app.get("/", function (req, res) {
    res.status(200).json({
        message: "Project Management API is running"
    });
});

module.exports = app;
