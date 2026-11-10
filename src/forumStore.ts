import { useSyncExternalStore } from "react";

export const CURRENT_USER = "Kirby";

export type ThreadCategory = "discussion" | "help" | "bug" | "ideas";

export const CATEGORIES: { key: ThreadCategory; label: string }[] = [
  { key: "discussion", label: "Discussion" },
  { key: "help", label: "Help" },
  { key: "bug", label: "Bug report" },
  { key: "ideas", label: "Ideas" },
];

export interface ForumMessage {
  id: string;
  author: string;
  text: string;
  createdAt: number;
}

export interface ForumThread {
  id: string;
  title: string;
  category: ThreadCategory;
  messages: ForumMessage[];
}

type ForumState = Record<string, ForumThread[]>;

const STORAGE_KEY = "forumThreads";
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/* ---------- Game name lookup ---------- */

export function getGameName(gameId: string): string {
  try {
    const saved = localStorage.getItem("myGames");
    if (saved) {
      const games = JSON.parse(saved) as { id: string; name: string }[];
      const match = games.find((g) => g.id === gameId);
      if (match) return match.name;
    }
  } catch {
    // fall through to the formatted id
  }
  return gameId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/* ---------- Starter content for each game ---------- */

function seedThreads(gameId: string): ForumThread[] {
  const now = Date.now();
  const game = getGameName(gameId);
  const msg = (author: string, text: string, ago: number, i: number) => ({
    id: `${gameId}-seed-${i}`,
    author,
    text,
    createdAt: now - ago,
  });

  return [
    {
      id: `${gameId}-update`,
      title: "Did you see the new update?",
      category: "discussion",
      messages: [
        msg("pixelpanda", "Did anyone see the update that dropped this morning?", 3 * HOUR, 1),
        msg("nightowl_22", "No, what changed?", 2 * HOUR + 40 * MINUTE, 2),
        msg(
          "ravenclaw88",
          "They added a new character! The patch notes say she's a support class.",
          2 * HOUR + 15 * MINUTE,
          3
        ),
        msg("pixelpanda", "Finally. Team comps were getting stale.", 1 * HOUR + 50 * MINUTE, 4),
      ],
    },
    {
      id: `${gameId}-vote`,
      title: "What should we vote for next?",
      category: "ideas",
      messages: [
        msg(
          "quietstorm",
          "Voting opens soon. I'm hoping for a new map. What are you all picking?",
          6 * HOUR,
          5
        ),
        msg("mossy", "Co-op mode, no question.", 5 * HOUR, 6),
        msg(
          "lagslayer",
          "New map for me too. We've played the current ones to death.",
          4 * HOUR,
          7
        ),
      ],
    },
    {
      id: `${gameId}-crash`,
      title: "Crashing on the loading screen",
      category: "bug",
      messages: [
        msg(
          "lagslayer",
          "Anyone else crashing on the loading screen since the update? It happens about half the time for me.",
          1 * DAY + 2 * HOUR,
          8
        ),
        msg(
          "pixelpanda",
          "Same here. Restarting fixed it for me, and the devs said a hotfix is coming this week.",
          1 * DAY,
          9
        ),
      ],
    },
    {
      id: `${gameId}-tips`,
      title: "Tips for new players?",
      category: "help",
      messages: [
        msg(
          "mossy",
          `Just picked up ${game}. What do you wish you knew when you started?`,
          3 * DAY,
          10
        ),
        msg(
          "nightowl_22",
          "Check the controls in settings first. The defaults aren't great.",
          3 * DAY - 2 * HOUR,
          11
        ),
        msg(
          "ravenclaw88",
          "Play with friends early on. It's way easier to learn when someone can explain things.",
          2 * DAY + 20 * HOUR,
          12
        ),
      ],
    },
  ];
}

/* ---------- Store ---------- */

function load(): ForumState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ForumState) : {};
  } catch {
    return {};
  }
}

let state: ForumState = load();
const listeners = new Set<() => void>();

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

// Seeds a game's forum the first time it is opened, then returns a stable array.
function getThreads(gameId: string): ForumThread[] {
  if (!state[gameId]) {
    state = { ...state, [gameId]: seedThreads(gameId) };
    save();
  }
  return state[gameId];
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createThread(
  gameId: string,
  title: string,
  category: ThreadCategory,
  text: string
): string {
  const thread: ForumThread = {
    id: makeId(),
    title,
    category,
    messages: [{ id: makeId(), author: CURRENT_USER, text, createdAt: Date.now() }],
  };
  state = { ...state, [gameId]: [thread, ...getThreads(gameId)] };
  save();
  emit();
  return thread.id;
}

export function addMessage(gameId: string, threadId: string, text: string) {
  const message: ForumMessage = {
    id: makeId(),
    author: CURRENT_USER,
    text,
    createdAt: Date.now(),
  };
  state = {
    ...state,
    [gameId]: getThreads(gameId).map((t) =>
      t.id === threadId ? { ...t, messages: [...t.messages, message] } : t
    ),
  };
  save();
  emit();
}

export function useThreads(gameId: string): ForumThread[] {
  return useSyncExternalStore(subscribe, () => getThreads(gameId));
}

/* ---------- Helpers ---------- */

export function lastActivity(thread: ForumThread): number {
  return thread.messages[thread.messages.length - 1]?.createdAt ?? 0;
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < MINUTE) return "Just now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;
  if (diff < 2 * DAY) return "Yesterday";
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)} days ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

const AVATAR_COLORS = ["#691769", "#8E437B", "#3d577d", "#86A2A6", "#7c69a8"];

export function avatarColor(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
