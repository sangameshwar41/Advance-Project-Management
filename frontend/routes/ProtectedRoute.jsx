
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
function ProtectedRoute() {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

export default ProtectedRoute;
