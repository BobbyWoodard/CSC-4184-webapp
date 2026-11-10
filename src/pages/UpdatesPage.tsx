import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Search, ChevronDown, ChevronUp } from "lucide-react";
import {
  notifications,
  markRead,
  useReadIds,
  gameNameFromId,
} from "../notificationStore";
import type { NotificationType } from "../notificationStore";
import "../notifications.css";

type UpdateFilter = "all" | "unread" | NotificationType;

const FILTERS: { key: UpdateFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "patch", label: "Patch notes" },
  { key: "voting", label: "Voting" },
];

function UpdatesPage() {
  const { gameId } = useParams();
  const gameName = gameNameFromId(gameId);
  const readIds = useReadIds();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<UpdateFilter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const normalized = query.trim().toLowerCase();

  const visible = notifications
    .filter((n) => n.gameId === gameId)
    .filter((n) => {
      const isUnread = !readIds.includes(n.id);
      const matchesFilter =
        filter === "all" ? true : filter === "unread" ? isUnread : n.type === filter;
      const matchesQuery =
        normalized === "" ||
        `${n.title} ${n.body}`.toLowerCase().includes(normalized);
      return matchesFilter && matchesQuery;
    });

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
    markRead(id);
  };

  return (
    <div className="page notif-page">
      <Link to={`/games/${gameId}`} className="back-button">
        <ArrowLeft size={20} />
        <span>{gameName}</span>
      </Link>

      <p className="eyebrow">GAME UPDATES</p>
      <h1>{gameName} Updates</h1>

      <label className="notif-search">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search updates"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search updates"
        />
      </label>

      <div className="notif-filters" role="group" aria-label="Filter updates">
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

      <h2 className="notif-header">What's new?</h2>

      {visible.length === 0 ? (
        <p className="notif-empty">No updates match your search.</p>
      ) : (
        <ul className="notif-list">
          {visible.map((n) => {
            const isUnread = !readIds.includes(n.id);
            const isOpen = openId === n.id;
            return (
              <li key={n.id}>
                <button
                  type="button"
                  className={`notif-item${isUnread ? " unread" : ""}`}
                  onClick={() => toggle(n.id)}
                  aria-expanded={isOpen}
                >
                  {isUnread && <span className="notif-dot" aria-label="Unread" />}
                  <span className="notif-text">
                    <span className="notif-title">{n.title}</span>
                    <span className="notif-body">{n.body}</span>
                    <span className="notif-time">{n.time}</span>
                  </span>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {isOpen && (
                  <div className="notif-details">
                    <ul>
                      {n.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                    {n.type === "voting" && (
                      <Link to={n.to} className="notif-details-link">
                        Go to voting
                      </Link>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default UpdatesPage;