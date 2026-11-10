import { useSyncExternalStore } from "react";

export type NotificationType = "patch" | "voting" | "general";

export interface AppNotification {
  id: string;
  gameName: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  to: string;
}

export const notifications: AppNotification[] = [
  {
    id: "n1",
    gameName: "Game 2",
    type: "patch",
    title: "Game 2 Patch Notes",
    body: "Version 1.4 adds the Archer enemy and rebalances sword damage.",
    time: "2 hours ago",
    to: "/games/game-2/updates",
  },
  {
    id: "n2",
    gameName: "Game 1",
    type: "voting",
    title: "Game 1 Voting Result",
    body: "Feature B won with 45% of the vote.",
    time: "Yesterday",
    to: "/games/game-1/voting",
  },
  {
    id: "n3",
    gameName: "Game 2",
    type: "voting",
    title: "Game 2 Voting Is Live",
    body: "Pick the next feature: Swordsman, Archer, or Co-op raid.",
    time: "2 days ago",
    to: "/games/game-2/voting",
  },
  {
    id: "n4",
    gameName: "Game 1",
    type: "patch",
    title: "Game 1 Patch Notes",
    body: "Fixes a bug where co-op raid invites would not send.",
    time: "3 days ago",
    to: "/games/game-1/updates",
  },
  {
    id: "n5",
    gameName: "Game 3",
    type: "general",
    title: "Game 3 Scheduled Maintenance",
    body: "Servers will be down Friday from 2 to 4 AM.",
    time: "Last week",
    to: "/games/game-3/updates",
  },
];

const STORAGE_KEY = "readNotificationIds";
const DEFAULT_READ = ["n4", "n5"];

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : DEFAULT_READ;
  } catch {
    return DEFAULT_READ;
  }
}

let readIds: string[] = load();
const listeners = new Set<() => void>();

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds));
  } catch {
    // ignore storage errors
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function markRead(id: string) {
  if (readIds.includes(id)) return;
  readIds = [...readIds, id];
  save();
  emit();
}

export function markAllRead() {
  readIds = notifications.map((n) => n.id);
  save();
  emit();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot() {
  return readIds;
}

export function useReadIds() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function useUnreadCount() {
  const ids = useReadIds();
  return notifications.filter((n) => !ids.includes(n.id)).length;
}