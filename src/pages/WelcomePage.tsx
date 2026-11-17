
import { useNavigate } from "react-router";
import "../WelcomePage.css";

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <h1>Welcome to Kwesta</h1>
        <p>
          Connect with your gaming community, share ideas, and stay
          up to date with the games you love.
        </p>

        <div className="welcome-buttons">
          <button
            className="welcome-login-button"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>

          <button
            className="welcome-signup-button"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
        </div>

        <p className="welcome-footer">
          Your gaming community starts here.
        </p>
      </div>
    </div>
  );
}

export default WelcomePage;
