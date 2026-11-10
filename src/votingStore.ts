export type VoteStatus = "Open" | "Closed" | "Implemented";

export type VoteOption = {
  id: string;
  title: string;
  description: string;
  icon: "palette" | "users" | "map" | "tree" | "sword" | "laser";
  percent: number;
};

export type CommunityVote = {
  id: string;
  gameId: string;
  title: string;
  description: string;
  status: VoteStatus;
  endsAt: string;
  options: VoteOption[];
};

export const communityVotes: CommunityVote[] = [
  {
    id: "vote-1",
    gameId: "minecraft",
    title: "Choose the next feature",
    description: "Help decide what feature will be added to Minecraft next.",
    status: "Open",
    endsAt: "3 days remaining",
    options: [
      {
        id: "customization",
        title: "Character Customization",
        description: "New outfits, colors, and emotes.",
        icon: "palette",
        percent: 31,
      },
      {
        id: "coop",
        title: "Co-op Mode",
        description: "Play the game with your friends in Bedrock and Java.",
        icon: "users",
        percent: 48,
      },
      {
        id: "biomes",
        title: "New Biomes",
        description: "New areas, creatures, and resources.",
        icon: "map",
        percent: 21,
      },
    ],
  },
  {
    id: "vote-2",
    gameId: "minecraft",
    title: "Choose the next Biome",
    description: "Help decide what biome will be added to Minecraft next.",
    status: "Implemented",
    endsAt: "Implemented 2 months ago",
    options: [
        {
            id:"forest",
            title: "Dappled forest",
            description: "A forest with autumn landscapes and soft warm-gray wood.",
            icon: "tree",
            percent: 67,
        },
        {
            id: "mountains",
            title: "Medieval mountains",
            description: "A mountain range with castles, villages, and (nicer)dragons.",
            icon: "sword",
            percent: 25,
        },
        {
            id: "swamp",
            title: "Witch's swamp",
            description: "A swamp with witches, cauldrons, and spooky trees.",
            icon: "laser",
            percent: 8,

        },
    ],
  },
];

export function getVotesForGame(gameId: string) {
  return communityVotes.filter((vote) => vote.gameId === gameId);
}

export function getVote(voteId: string) {
  return communityVotes.find((vote) => vote.id === voteId);
}