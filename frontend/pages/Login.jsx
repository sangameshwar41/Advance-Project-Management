
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authApi";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(event) {
        event.preventDefault();

        try {
            setError("");

            const response = await loginUser({
                email,
                password
            });

            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));

            navigate("/dashboard");
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="auth-container">
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                <button type="submit">Login</button>
            </form>

            {error && <p>{error}</p>}

            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default Login;
