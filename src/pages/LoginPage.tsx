import { useState } from "react";
import { useNavigate } from "react-router";

interface LoginPageProps {
    onLogin: () => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (username === "kirby" && password === "password123") {
            localStorage.setItem("currentUser", "kirby");
            onLogin();
            navigate("/");
            return;
        }

        const storedAccount = localStorage.getItem("user_" + username);

        if (storedAccount) {
            const account = JSON.parse(storedAccount);

            if (account.password === password) {
                localStorage.setItem("currentUser", username);
                onLogin();
                navigate("/");
                return;
            }
        }

        setError("Invalid username or password.");
    };

    return (
        <div className="login-page">
        <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Log in to continue.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
            <label>Username</label>
            <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            </div>

            <div className="form-group">
            <label>Password</label>
            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-button">
            Log In
            </button>
        </form>

        <p className="login-footer">
            Don't have an account?{" "}
            <button
                type="button"
                onClick={() => navigate("/signup")}
                className="login-signup-link"
            >
                Sign up
            </button>
        </p>

        <div className="demo-credentials">
            <p>Demo Account</p>
            <span>Username: kirby</span>
            <span>Password: password123</span>
        </div>
        </div>
    );
}

export default LoginPage;