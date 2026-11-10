import { useSyncExternalStore } from "react";

export type NotificationType = "patch" | "voting" | "general";

export interface AppNotification {
  id: string;
  gameId: string;
  type: NotificationType;
  title: string;
  body: string;
  details: string[];
  time: string;
  to: string;
}

export const GAMES = [
  { id: "minecraft", name: "Minecraft" },
  { id: "fortnite", name: "Fortnite" },
  { id: "deadlock", name: "Deadlock" },
];

export function gameNameFromId(gameId: string | undefined) {
  const found = GAMES.find((g) => g.id === gameId);
  if (found) return found.name;
  if (!gameId) return "Game";
  return gameId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const notifications: AppNotification[] = [
  {
    id: "n1",
    gameId: "minecraft",
    type: "patch",
    title: "Minecraft Patch Notes",
    body: "Villager trades now restock correctly and caves are easier to see.",
    details: [
      "Villagers now restock trades correctly after a workstation is reclaimed.",
      "Improved lighting in deep caves.",
      "Fixed a crash when opening a bundle in a full inventory.",
    ],
    time: "2 hours ago",
    to: "/games/minecraft/updates",
  },
  {
    id: "n2",
    gameId: "fortnite",
    type: "voting",
    title: "Fortnite Voting Result",
    body: "Players voted to bring back the old map locations.",
    details: [
      "Bring back old map locations won with 52% of the vote.",
      "Map changes for the next season will be announced soon.",
    ],
    time: "Yesterday",
    to: "/games/fortnite/voting",
  },
  {
    id: "n3",
    gameId: "deadlock",
    type: "patch",
    title: "Deadlock Patch Notes",
    body: "Hero ability balance changes and shorter matchmaking waits.",
    details: [
      "Rebalanced ability cooldowns for several heroes.",
      "Reduced matchmaking wait times at peak hours.",
      "Fixed a bug where the shop did not close after respawn.",
    ],
    time: "2 days ago",
    to: "/games/deadlock/updates",
  },
  {
    id: "n4",
    gameId: "minecraft",
    type: "voting",
    title: "Minecraft Voting Is Live",
    body: "Vote on the next community feature.",
    details: [
      "Voting closes Friday at 11:59 PM.",
      "Options: a new biome, a boats overhaul, or new villager jobs.",
    ],
    time: "3 days ago",
    to: "/games/minecraft/voting",
  },
  {
    id: "n5",
    gameId: "fortnite",
    type: "patch",
    title: "Fortnite Patch Notes",
    body: "Weapon tuning and a fix for emote lag.",
    details: [
      "Tuned damage on two weapons.",
      "Fixed emote lag in lobbies.",
      "Added a new report option for lobby chat.",
    ],
    time: "4 days ago",
    to: "/games/fortnite/updates",
  },
  {
    id: "n6",
    gameId: "deadlock",
    type: "general",
    title: "Deadlock Scheduled Maintenance",
    body: "Servers will be down Friday from 2 to 4 AM.",
    details: [
      "Servers will be offline Friday from 2 to 4 AM.",
      "Ranked queues close 30 minutes earlier.",
    ],
    time: "Last week",
    to: "/games/deadlock/updates",
  },
];

const STORAGE_KEY = "readNotificationIds";
const DEFAULT_READ = ["n4", "n5", "n6"];

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