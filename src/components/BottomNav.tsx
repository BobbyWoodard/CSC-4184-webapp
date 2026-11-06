import { NavLink } from "react-router";
import { House, Bell, UserRound } from "lucide-react";

function BottomNav() {
    return (
        <nav className="bottom-nav">
        <NavLink to="/" end className="nav-item">
            <House size={24} />
            <span>Home</span>
        </NavLink>

        <NavLink to="/notifications" className="nav-item">
            <Bell size={24} />
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