import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, SendHorizontal } from "lucide-react";
import {
  CATEGORIES,
  CURRENT_USER,
  addMessage,
  avatarColor,
  timeAgo,
  useThreads,
} from "../forumStore";
import "../forum.css";

function ThreadPage() {
  const { gameId = "", threadId = "" } = useParams();
  const threads = useThreads(gameId);
  const thread = threads.find((t) => t.id === threadId);

  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const messageCount = thread?.messages.length ?? 0;

  // Keep the newest message in view, like a chat app.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messageCount]);

  if (!thread) {
    return (
      <div className="thread-page thread-missing">
        <h1>Thread not found</h1>
        <p>It may have been removed. Go back to see the other conversations.</p>
        <Link to={`/games/${gameId}/forum`} className="primary-button">
          Back to forum
        </Link>
      </div>
    );
  }

  const categoryLabel =
    CATEGORIES.find((c) => c.key === thread.category)?.label ?? "Discussion";

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text) return;
    addMessage(gameId, thread.id, text);
    setDraft("");
  };

  return (
    <div className="thread-page">
      <header className="thread-header">
        <Link to={`/games/${gameId}/forum`} className="back-button forum-back">
          <ArrowLeft size={20} />
          <span>Forum</span>
        </Link>
        <span className={`thread-tag thread-tag--${thread.category}`}>
          {categoryLabel}
        </span>
        <h1>{thread.title}</h1>
      </header>

      <div className="thread-messages">
        {thread.messages.map((m) => {
          const mine = m.author === CURRENT_USER;
          const isNew = mine && Date.now() - m.createdAt < 2000;
          return (
            <div
              key={m.id}
              className={`message${mine ? " message--mine" : ""}${isNew ? " message--new" : ""}`}
            >
              {!mine && (
                <div
                  className="message-avatar"
                  style={{ background: avatarColor(m.author) }}
                  aria-hidden="true"
                >
                  {m.author.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="message-body">
                <div className="message-meta">
                  <strong>{mine ? "You" : m.author}</strong>
                  <span>{timeAgo(m.createdAt)}</span>
                </div>
                <p className="message-bubble">{m.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form className="thread-composer" onSubmit={send}>
        <textarea
          rows={1}
          placeholder="Write a reply"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          aria-label="Write a reply"
        />
        <button
          type="submit"
          className="composer-send"
          disabled={!draft.trim()}
          aria-label="Send reply"
        >
          <SendHorizontal size={20} />
        </button>
      </form>
    </div>
  );
}

export default ThreadPage;
