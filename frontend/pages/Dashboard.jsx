
import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardApi";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState("");

    useEffect(function () {
        async function fetchDashboard() {
            try {
                const response = await getDashboard();
                setDashboard(response.dashboard);
            } catch (error) {
                setError(error.message);
            }
        }

        fetchDashboard();
    }, []);

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p>Welcome back, {user?.userName}!</p>
                    <span>Role: {user?.role}</span>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            {!dashboard && !error && (
                <p>Loading dashboard...</p>
            )}

            {dashboard && (
                <>
                    <div className="dashboard-cards">

                        <div className="dashboard-card">
                            <h3>Total Projects</h3>
                            <p>{dashboard.totalProjects}</p>
                        </div>

                        <div className="dashboard-card">
                            <h3>Total Tasks</h3>
                            <p>{dashboard.totalTasks}</p>
                        </div>

                        <div className="dashboard-card">
                            <h3>Completed Tasks</h3>
                            <p>{dashboard.completedTasks}</p>
                        </div>

                        <div className="dashboard-card">
                            <h3>Pending Tasks</h3>
                            <p>{dashboard.pendingTasks}</p>
                        </div>

                        <div className="dashboard-card">
                            <h3>In Progress</h3>
                            <p>{dashboard.inProgressTasks}</p>
                        </div>

                        <div className="dashboard-card">
                            <h3>Under Review</h3>
                            <p>{dashboard.reviewTasks}</p>
                        </div>

                        <div className="dashboard-card">
                            <h3>Overdue Tasks</h3>
                            <p>{dashboard.overdueTasks}</p>
                        </div>

                    </div>

                    <div className="completion-card">
                        <h2>Project Completion</h2>

                        <h3>
                            {dashboard.completionPercentage}%
                        </h3>

                        <div className="progress-background">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${dashboard.completionPercentage}%`
                                }}
                            ></div>
                        </div>

                        <p>Overall task completion</p>
                    </div>
                </>
            )}
        </div>
    );
}

export default Dashboard;
