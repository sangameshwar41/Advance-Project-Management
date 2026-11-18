
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    }

    return (
        <nav>
            <Link to="/dashboard">Dashboard</Link>{" | "}
            <Link to="/projects">Projects</Link>{" | "}
            <Link to="/tasks">Tasks</Link>{" | "}
            <Link to="/team-members">Team Members</Link>{" | "}
            <Link to="/activity-logs">Activity Logs</Link>{" | "}

            <button onClick={handleLogout}>Logout</button>
        </nav>
    );
}

export default Navbar;
