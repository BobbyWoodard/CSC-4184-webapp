
import { useState } from "react";
import { useNavigate } from "react-router";

interface SignupPageProps {
  onLogin: () => void;
}

function SignupPage({ onLogin }: SignupPageProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (localStorage.getItem("user_" + username)) {
      setError("Username is already taken.");
      return;
    }

    const account = {
      username,
      email,
      password,
    };

    localStorage.setItem("user_" + username, JSON.stringify(account));

    localStorage.setItem("currentUser", username);

    onLogin();
    navigate("/");
  };

  return (
    <div className="signup-page">
      <div className="signup-header">
        <h1>Create Account</h1>
        <p>Join your gaming community.</p>
      </div>

      <form onSubmit={handleSignup} className="signup-form">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="signup-button">
          Create Account
        </button>
      </form>

      <p className="signup-footer">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>Log in</span>
      </p>
    </div>
  );
}

export default SignupPage;
