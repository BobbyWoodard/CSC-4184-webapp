import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, MessageCircle, Plus, X, ChevronRight } from "lucide-react";
import {
  CATEGORIES,
  CURRENT_USER,
  createThread,
  getGameName,
  lastActivity,
  timeAgo,
  useThreads,
} from "../forumStore";
import type { ThreadCategory } from "../forumStore";
import "../forum.css";

function ForumPage() {
  const { gameId = "" } = useParams();
  const navigate = useNavigate();
  const threads = useThreads(gameId);
  const gameName = getGameName(gameId);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ThreadCategory>("discussion");
  const [message, setMessage] = useState("");

  const sorted = [...threads].sort((a, b) => lastActivity(b) - lastActivity(a));

  const closeForm = () => {
    setShowForm(false);
    setTitle("");
    setMessage("");
    setCategory("discussion");
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanMessage = message.trim();
    if (!cleanTitle || !cleanMessage) return;

    const id = createThread(gameId, cleanTitle, category, cleanMessage);
    closeForm();
    navigate(`/games/${gameId}/forum/${id}`);
  };

  return (
    <div className="forum-page">
      <Link to={`/games/${gameId}`} className="back-button forum-back">
        <ArrowLeft size={20} />
        <span>{gameName}</span>
      </Link>

      <header className="forum-header">
        <div>
          <p className="eyebrow">{gameName.toUpperCase()} COMMUNITY</p>
          <h1>Forum</h1>
          <p className="forum-subtitle">Talk with other {gameName} players.</p>
        </div>
      </header>

      <button
        type="button"
        className="primary-button forum-new-button"
        onClick={() => setShowForm(true)}
      >
        <Plus size={18} />
        Start a thread
      </button>

      <ul className="thread-list">
        {sorted.map((thread) => {
          const last = thread.messages[thread.messages.length - 1];
          const replies = thread.messages.length - 1;
          const categoryLabel =
            CATEGORIES.find((c) => c.key === thread.category)?.label ?? "Discussion";

          return (
            <li key={thread.id}>
              <Link
                to={`/games/${gameId}/forum/${thread.id}`}
                className="thread-card"
              >
                <div className="thread-card-body">
                  <span className={`thread-tag thread-tag--${thread.category}`}>
                    {categoryLabel}
                  </span>
                  <h2>{thread.title}</h2>
                  <p className="thread-preview">
                    <strong>{last.author === CURRENT_USER ? "You" : last.author}:</strong>{" "}
                    {last.text}
                  </p>
                  <div className="thread-meta">
                    <span>
                      <MessageCircle size={14} />
                      {replies} {replies === 1 ? "reply" : "replies"}
                    </span>
                    <span>{timeAgo(lastActivity(thread))}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="thread-chevron" />
              </Link>
            </li>
          );
        })}
      </ul>

      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <form
            className="forum-modal"
            onSubmit={handleCreate}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={closeForm}
              aria-label="Close"
            >
              <X size={22} />
            </button>

            <h2>Start a thread</h2>
            <p>Ask a question or start a conversation about {gameName}.</p>

            <label className="forum-field">
              <span>Topic</span>
              <input
                autoFocus
                type="text"
                placeholder="What's it about?"
                maxLength={80}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>

            <div className="forum-field">
              <span>Category</span>
              <div className="forum-category-picker" role="group" aria-label="Category">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    className={`forum-chip${category === c.key ? " active" : ""}`}
                    aria-pressed={category === c.key}
                    onClick={() => setCategory(c.key)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="forum-field">
              <span>Message</span>
              <textarea
                placeholder="Write your first message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              className="primary-button"
              disabled={!title.trim() || !message.trim()}
            >
              Post thread
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ForumPage;
