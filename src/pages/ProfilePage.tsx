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
                    <div className="profile-avatar">K</div>
                    <h2>Kirby</h2>
                    <p>kirby@example.com</p>
                    <div className="about-divider" />
                    <div className="about-detail">
                        <span>Username</span>
                        <strong>Kirby</strong>
                    </div>
                    <div className="about-detail">
                        <span>Email</span>
                        <strong>kirby@example.com</strong>
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
                            <strong>Notifications</strong>
                            <span>Receive updates and alerts</span>
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
                            <Shield size={21} />
                        </div>
                        <div className="settings-description">
                            <strong>Privacy</strong>
                            <span>Account and privacy preferences</span>
                        </div>
                        <Info size={19} className="settings-info-icon" />
                    </div>
                </div>
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
                <div className="profile-avatar">K</div>
                <div className="profile-summary-text">
                    <h2>Kirby</h2>
                    <p>kirby@example.com</p>
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