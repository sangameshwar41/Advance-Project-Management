const ActivityLog = require("../models/activityLog");

async function createActivityLog({
    user,
    action,
    project,
    task,
    details
}) {
    try {
        await ActivityLog.create({
            user,
            action,
            project,
            task,
            details
        });
    }
    catch (error) {
        console.log("Failed to create activity log: " + error.message);
    }
}

module.exports = createActivityLog;