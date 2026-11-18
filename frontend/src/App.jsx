
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import Tasks from "../pages/Tasks";
import TeamMembers from "../pages/TeamMembers";
import ActivityLogs from "../pages/ActivityLogs";

import ProtectedRoute from "../routes/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/team-members" element={<TeamMembers />} />
                    <Route path="/activity-logs" element={<ActivityLogs />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
