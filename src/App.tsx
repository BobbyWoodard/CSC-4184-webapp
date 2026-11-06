import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import GamePage from "./pages/GamePage";
import BottomNav from "./components/BottomNav";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  const login = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <div className="mobile-container">
        {!isLoggedIn ? (
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={login} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <>
            <main className="mobile-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route
                  path="/profile"
                  element={<ProfilePage onLogout={logout} />}
                />

                <Route path="/games/:gameId" element={<GamePage />} />
                

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <BottomNav />
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;