
import request from "./api";

// Get all activity logs
export async function getActivityLogs() {
    return await request("/activity-logs");
}
