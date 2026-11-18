
import { useEffect, useState } from "react";
import { getActivityLogs } from "../services/activityLogApi";

function ActivityLogs() {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState("");

    useEffect(function () {
        async function fetchLogs() {
            try {
                const response = await getActivityLogs();
                setLogs(response.activityLogs);
            } catch (error) {
                setError(error.message);
            }
        }

        fetchLogs();
    }, []);

    return (
        <div className="activity-logs-page">
            <h1>Activity Logs</h1>

            {error && (
                <p className="error-message">{error}</p>
            )}

            {logs.length === 0 ? (
                <p>No activity logs found.</p>
            ) : (
                <div className="activity-logs-list">
                    {logs.map(function (log) {
                        return (
                            <div
                                className="activity-log-card"
                                key={log._id}
                            >
                                <p>
                                    <strong>
                                        {log.user?.userName || "User"}
                                    </strong>
                                    {" - "}
                                    {log.action}
                                </p>

                                <p>{log.description}</p>

                                <p>
                                    <strong>Project:</strong>{" "}
                                    {log.project?.name || "N/A"}
                                </p>

                                <p>
                                    <strong>Task:</strong>{" "}
                                    {log.task?.title || "N/A"}
                                </p>

                                <small>
                                    {log.createdAt?.slice(0, 10)}
                                </small>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ActivityLogs;
