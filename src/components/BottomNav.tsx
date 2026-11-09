import { NavLink } from "react-router";
import { House, Bell, UserRound } from "lucide-react";
import { useUnreadCount } from "../notificationStore";
import "../notifications.css";

function BottomNav() {
    const unread = useUnreadCount();
    return (
        <nav className="bottom-nav">
        <NavLink to="/" end className="nav-item">
            <House size={24} />
            <span>Home</span>
        </NavLink>

        <NavLink to="/notifications" className="nav-item">
            <span className="notif-bell-wrap">
                <Bell size={24} />
                {unread > 0 && <span className="notif-badge">{unread}</span>}
            </span>
            <span>Notifications</span>
        </NavLink>

        <NavLink to="/profile" className="nav-item">
            <UserRound size={24} />
            <span>Profile</span>
        </NavLink>
        </nav>
    );
}

export default BottomNav;