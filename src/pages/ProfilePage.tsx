import { useState } from "react";
import {
    UserRound,
    Settings,
    LogOut,
    ChevronRight,
    ArrowLeft,
    Bell,
    Shield,
    Info,
} from "lucide-react";

interface ProfilePageProps {
    onLogout: () => void;
}

type ProfileSection = "main" | "about" | "settings";

function ProfilePage({ onLogout }: ProfilePageProps) {
    const [section, setSection] = useState<ProfileSection>("main");
    const [notifications, setNotifications] = useState(true);
    const [showAbout, setShowAbout] = useState(false);

    const currentUsername = localStorage.getItem("currentUser") || "kirby";
    const storedAccount = localStorage.getItem("user_" + currentUsername);
    
    const profile = storedAccount
        ? JSON.parse(storedAccount)
        : {
            username: "Kirby",
            email: "kirby@example.com",
        };

    const displayName =
        profile.username.charAt(0).toUpperCase() + profile.username.slice(1);

    const avatarLetter = displayName.charAt(0).toUpperCase();

    const goBack = () => setSection("main");

    if (section === "about") {
        return (
            <div className="page profile-page">
                <button className="profile-back" onClick={goBack}>
                    <ArrowLeft size={20} />
                    <span>Profile</span>
                </button>

                <div className="profile-heading">
                    <p className="eyebrow">YOUR ACCOUNT</p>
                    <h1>About Me</h1>
                    <p>Your personal profile information.</p>
                </div>

                <div className="about-card">
                    <div className="profile-avatar">{avatarLetter}</div>
                    <h2>{displayName}</h2>
                    <p>{profile.email}</p>

                    <div className="about-divider" />

                    <div className="about-detail">
                        <span>Username</span>
                        <strong>{displayName}</strong>
                    </div>
                    <div className="about-detail">
                        <span>Email</span>
                        <strong>{profile.email}</strong>
                    </div>
                </div>
            </div>
        );
    }

    if (section === "settings") {
        return (
            <div className="page profile-page">
                <button className="profile-back" onClick={goBack}>
                    <ArrowLeft size={20} />
                    <span>Profile</span>
                </button>

                <div className="profile-heading">
                    <p className="eyebrow">PREFERENCES</p>
                    <h1>Settings</h1>
                    <p>Customize your app experience.</p>
                </div>

                <div className="settings-card">
                    <div className="settings-item">
                        <div className="settings-icon">
                            <Bell size={21} />
                        </div>
                        <div className="settings-description">
                            <strong>Push Notifications</strong>
                            <span>Receive updates and alerts when the app is closed</span>
                        </div>
                        <button
                            className={`toggle-switch ${notifications ? "enabled" : ""}`}
                            onClick={() => setNotifications(!notifications)}
                            aria-label="Toggle notifications"
                            aria-pressed={notifications}
                        >
                            <span />
                        </button>
                    </div>

                    <div className="settings-divider" />

                    <div className="settings-item">
                        <div className="settings-icon">
                            <Info size={21} />
                        </div>
                        <div className="settings-description">
                            <strong>About this app</strong>
                            <span>Learn more about the app and its purpose</span>
                        </div>
                        <button
                            className="settings-info-button"
                            onClick={() => setShowAbout(true)}
                            aria-label="More information about Kwesta"
                        >
                            <Info size={19} />
                        </button>
                    </div>
                </div>

                {showAbout && (
                    <div
                        className="popup-overlay"
                        onClick={() => setShowAbout(false)}
                    >
                        <div
                            className="about-popup"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="popup-icon">
                                <Info size={26} />
                            </div>

                            <h2>About this app</h2>

                            <p>
                                This is a platform designed to bring gaming
                                communities together. Connect with other players,
                                participate in community discussions and voting,
                                and stay informed about the games you love.
                            </p>

                            <button
                                className="popup-close"
                                onClick={() => setShowAbout(false)}
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="page profile-page">
            <div className="profile-heading">
                <p className="eyebrow">YOUR ACCOUNT</p>
                <h1>My Profile</h1>
                <p>Manage your account and preferences.</p>
            </div>

            <div className="profile-summary">
                <div className="profile-avatar">{avatarLetter}</div>
                <div className="profile-summary-text">
                    <h2>{displayName}</h2>
                    <p>{profile.email}</p>
                </div>
            </div>

            <div className="profile-menu">
                <button
                    className="profile-menu-item"
                    onClick={() => setSection("about")}
                >
                    <div className="profile-menu-icon">
                        <UserRound size={23} />
                    </div>
                    <div className="profile-menu-text">
                        <strong>About</strong>
                        <span>View your profile information</span>
                    </div>
                    <ChevronRight size={21} className="profile-chevron" />
                </button>

                <div className="profile-menu-divider" />

                <button
                    className="profile-menu-item"
                    onClick={() => setSection("settings")}
                >
                    <div className="profile-menu-icon">
                        <Settings size={23} />
                    </div>
                    <div className="profile-menu-text">
                        <strong>Settings</strong>
                        <span>Manage your preferences</span>
                    </div>
                    <ChevronRight size={21} className="profile-chevron" />
                </button>
            </div>

            <button className="logout-button" onClick={onLogout}>
                <LogOut size={19} />
                <span>Log Out</span>
            </button>
        </div>
    );
}

export default ProfilePage;