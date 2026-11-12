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

/* Game name lookup  */

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

/*  Starter content for each game */

// [author, text, how long ago it was posted]
type SeedMessage = [string, string, number];

interface SeedThread {
  key: string;
  title: string;
  category: ThreadCategory;
  messages: SeedMessage[];
}

const GAME_SEEDS: Record<string, SeedThread[]> = {
  minecraft: [
    {
      key: "update",
      title: "Did you read the new patch notes?",
      category: "discussion",
      messages: [
        ["blockbuilder", "Did anyone read the patch notes that dropped this morning?", 3 * HOUR],
        ["creeper_hugs", "No, what changed?", 2 * HOUR + 40 * MINUTE],
        ["redstone_rae", "Villagers restock their trades properly now, and caves are way easier to see.", 2 * HOUR + 15 * MINUTE],
        ["blockbuilder", "Finally. My trading hall has been broken for weeks.", 1 * HOUR + 50 * MINUTE],
      ],
    },
    {
      key: "vote",
      title: "What are you voting for?",
      category: "ideas",
      messages: [
        ["creeper_hugs", "Voting is live! Co-op Mode, Character Customization, or New Biomes. What are you all picking?", 6 * HOUR],
        ["blockbuilder", "Co-op Mode. Playing with friends across Bedrock and Java would be huge.", 5 * HOUR],
        ["diamondfinder", "New Biomes, easy pick. And Witch's Swamp in the biome vote, obviously.", 4 * HOUR + 30 * MINUTE],
        ["redstone_rae", "Medieval Mountains for me. Castles and nicer dragons? Yes please.", 4 * HOUR],
      ],
    },
    {
      key: "chunks",
      title: "Chunks not loading on our server",
      category: "bug",
      messages: [
        ["redstone_rae", "Anyone else getting chunks that won't load near spawn? Our server map has big holes in it.", 1 * DAY + 2 * HOUR],
        ["creeper_hugs", "Same here. Lowering render distance and rejoining fixed it for us.", 1 * DAY],
      ],
    },
    {
      key: "diamonds",
      title: "Best Y level for diamonds?",
      category: "help",
      messages: [
        ["newminer_jo", "Just started a new survival world. What height should I mine at for diamonds?", 3 * DAY],
        ["diamondfinder", "Around Y -58. Strip mine there and you'll find them way faster.", 3 * DAY - 2 * HOUR],
        ["redstone_rae", "Bring a water bucket. There's lava everywhere that low.", 2 * DAY + 20 * HOUR],
      ],
    },
  ],

  fortnite: [
    {
      key: "old-map",
      title: "The old map is coming back!",
      category: "discussion",
      messages: [
        ["dropzone", "Did you see the voting results? The old map locations are coming back!", 3 * HOUR],
        ["nobuild_nina", "Wait, really? I missed the vote.", 2 * HOUR + 40 * MINUTE],
        ["victoryvee", "Yep, it won by a lot. Can't wait to drop at all the classic spots again.", 2 * HOUR + 15 * MINUTE],
        ["dropzone", "Love that our votes actually decided it.", 1 * HOUR + 50 * MINUTE],
      ],
    },
    {
      key: "vote",
      title: "Which Battle Pass theme are you voting for?",
      category: "ideas",
      messages: [
        ["victoryvee", "Battle Pass voting is open. Space Odyssey, Pirate Adventure, or Wild West?", 6 * HOUR],
        ["dropzone", "Pirate Adventure. Ships and treasure would be so fun.", 5 * HOUR],
        ["buildfast_ty", "Space Odyssey, just for the futuristic weapons.", 4 * HOUR + 30 * MINUTE],
        ["nobuild_nina", "Wild West duels would be amazing though.", 4 * HOUR],
      ],
    },
    {
      key: "emote-lag",
      title: "Lag whenever someone emotes",
      category: "bug",
      messages: [
        ["squadfill_sam", "Anyone else getting a lag spike whenever someone emotes mid-match?", 1 * DAY + 2 * HOUR],
        ["victoryvee", "Yes! The new patch notes say it's fixed, so make sure your game is updated.", 1 * DAY],
        ["squadfill_sam", "Updated and it's gone. Thanks!", 23 * HOUR],
      ],
    },
    {
      key: "zero-build",
      title: "Build or Zero Build for a beginner?",
      category: "help",
      messages: [
        ["squadfill_sam", "Just started playing. Should I learn building or stick to Zero Build?", 3 * DAY],
        ["buildfast_ty", "Start in Zero Build to learn the guns and the map. Practice building in Creative on the side.", 3 * DAY - 2 * HOUR],
        ["nobuild_nina", "Zero Build is way less stressful. I never went back.", 2 * DAY + 20 * HOUR],
      ],
    },
  ],

  deadlock: [
    {
      key: "update",
      title: "Did you see the new update?",
      category: "discussion",
      messages: [
        ["soulcollector", "Did anyone see the patch that dropped last night?", 3 * HOUR],
        ["laneking", "No, what changed?", 2 * HOUR + 40 * MINUTE],
        ["urnrunner", "A bunch of hero ability balance changes, and matchmaking waits are shorter.", 2 * HOUR + 15 * MINUTE],
        ["soulcollector", "Shorter queues alone make it worth it.", 1 * HOUR + 50 * MINUTE],
      ],
    },
    {
      key: "maintenance",
      title: "Servers down Friday morning?",
      category: "discussion",
      messages: [
        ["newhero_ash", "Got a notification about maintenance. Does anyone know how long it'll be?", 6 * HOUR],
        ["laneking", "Friday from 2 to 4 AM. Shouldn't bother anyone who actually sleeps.", 5 * HOUR],
        ["midbossmara", "Guess I'm sleeping for once.", 4 * HOUR],
      ],
    },
    {
      key: "crash",
      title: "Crashing when the match loads",
      category: "bug",
      messages: [
        ["urnrunner", "Anyone else crashing right when the match loads? It happens about half the time for me.", 1 * DAY + 2 * HOUR],
        ["laneking", "Same. Verifying the game files in Steam fixed it for me.", 1 * DAY],
      ],
    },
    {
      key: "laning",
      title: "How do I stop losing my lane?",
      category: "help",
      messages: [
        ["newhero_ash", "I keep losing lane every game. Any tips?", 3 * DAY],
        ["laneking", "Focus on last-hitting troopers and denying souls. Don't take big fights until you have a couple of items.", 3 * DAY - 2 * HOUR],
        ["midbossmara", "Watch the minimap too. If your laner disappears, they're probably coming for you.", 2 * DAY + 20 * HOUR],
      ],
    },
  ],
};

// Used for any game a user adds that isn't listed above.
function genericSeeds(game: string): SeedThread[] {
  return [
    {
      key: "update",
      title: "Did you see the new update?",
      category: "discussion",
      messages: [
        ["pixelpanda", "Did anyone see the update that dropped this morning?", 3 * HOUR],
        ["nightowl_22", "No, what changed?", 2 * HOUR + 40 * MINUTE],
        ["ravenclaw88", "They added a new character! The patch notes say she's a support class.", 2 * HOUR + 15 * MINUTE],
        ["pixelpanda", "Finally. Team comps were getting stale.", 1 * HOUR + 50 * MINUTE],
      ],
    },
    {
      key: "vote",
      title: "What should we vote for next?",
      category: "ideas",
      messages: [
        ["quietstorm", "Voting opens soon. I'm hoping for a new map. What are you all picking?", 6 * HOUR],
        ["mossy", "Co-op mode, no question.", 5 * HOUR],
        ["lagslayer", "New map for me too. We've played the current ones to death.", 4 * HOUR],
      ],
    },
    {
      key: "crash",
      title: "Crashing on the loading screen",
      category: "bug",
      messages: [
        ["lagslayer", "Anyone else crashing on the loading screen since the update? It happens about half the time for me.", 1 * DAY + 2 * HOUR],
        ["pixelpanda", "Same here. Restarting fixed it for me, and the devs said a hotfix is coming this week.", 1 * DAY],
      ],
    },
    {
      key: "tips",
      title: "Tips for new players?",
      category: "help",
      messages: [
        ["mossy", `Just picked up ${game}. What do you wish you knew when you started?`, 3 * DAY],
        ["nightowl_22", "Check the controls in settings first. The defaults aren't great.", 3 * DAY - 2 * HOUR],
        ["ravenclaw88", "Play with friends early on. It's way easier to learn when someone can explain things.", 2 * DAY + 20 * HOUR],
      ],
    },
  ];
}

function seedThreads(gameId: string): ForumThread[] {
  const now = Date.now();
  const game = getGameName(gameId);
  const templates = GAME_SEEDS[game.toLowerCase()] ?? genericSeeds(game);

  return templates.map((t) => ({
    id: `${gameId}-${t.key}`,
    title: t.title,
    category: t.category,
    messages: t.messages.map(([author, text, ago], i) => ({
      id: `${gameId}-${t.key}-${i}`,
      author,
      text,
      createdAt: now - ago,
    })),
  }));
}

/*  Store  */

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

/* Helpers */

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