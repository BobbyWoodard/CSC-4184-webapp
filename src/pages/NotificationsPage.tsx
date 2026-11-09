import { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  CheckCheck,
} from "lucide-react";
import {
  notifications,
  markRead,
  markAllRead,
  useReadIds,
} from "../notificationStore";
import type { NotificationType } from "../notificationStore";
import "../notifications.css";

type NotifFilter = "all" | "unread" | NotificationType;

const FILTERS: { key: NotifFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "patch", label: "Patch notes" },
  { key: "voting", label: "Voting" },
];

const GAMES = [
  { id: "game-1", name: "Game 1" },
  { id: "game-2", name: "Game 2" },
  { id: "game-3", name: "Game 3" },
];

function NotificationsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<NotifFilter>("all");
  const readIds = useReadIds();

  const normalized = query.trim().toLowerCase();
  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const visible = notifications.filter((n) => {
    const isUnread = !readIds.includes(n.id);
    const matchesFilter =
      filter === "all" ? true : filter === "unread" ? isUnread : n.type === filter;
    const matchesQuery =
      normalized === "" ||
      `${n.title} ${n.body} ${n.gameName}`.toLowerCase().includes(normalized);
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="page notif-page">
      <h1>Notifications</h1>

      <label className="notif-search">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search feed"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search notifications"
        />
      </label>

      <div className="notif-filters" role="group" aria-label="Filter notifications">
        <SlidersHorizontal size={18} aria-hidden="true" />
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`notif-chip${filter === f.key ? " active" : ""}`}
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="notif-section-head">
        <h2 className="notif-header">What's new?</h2>
        <button
          type="button"
          className="notif-markall"
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck size={16} aria-hidden="true" /> Mark all read
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="notif-empty">No notifications match your search.</p>
      ) : (
        <ul className="notif-list">
          {visible.map((n) => {
            const isUnread = !readIds.includes(n.id);
            return (
              <li key={n.id}>
                <Link
                  to={n.to}
                  className={`notif-item${isUnread ? " unread" : ""}`}
                  onClick={() => markRead(n.id)}
                >
                  {isUnread && <span className="notif-dot" aria-label="Unread" />}
                  <span className="notif-text">
                    <span className="notif-title">{n.title}</span>
                    <span className="notif-body">{n.body}</span>
                    <span className="notif-time">{n.time}</span>
                  </span>
                  <ChevronRight size={20} aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="notif-header">Updates by game</h2>
      <ul className="notif-list">
        {GAMES.map((g) => (
          <li key={g.id}>
            <Link to={`/games/${g.id}/updates`} className="notif-item">
              <span className="notif-text">
                <span className="notif-title">{g.name} Updates</span>
              </span>
              <ChevronRight size={20} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationsPage;