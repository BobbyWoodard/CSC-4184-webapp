export type VoteStatus = "Open" | "Closed" | "Implemented";

export type VoteOption = {
  id: string;
  title: string;
  description: string;
  icon: "palette" | "users" | "map" | "tree" | "sword" | "laser";
  votes: number;
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
        votes: 31,
      },
      {
        id: "coop",
        title: "Co-op Mode",
        description: "Play the game with your friends in Bedrock and Java.",
        icon: "users",
        votes: 47,
      },
      {
        id: "biomes",
        title: "New Biomes",
        description: "New areas, creatures, and resources.",
        icon: "map",
        votes: 21,
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
            votes: 67,
        },
        {
            id: "mountains",
            title: "Medieval mountains",
            description: "A mountain range with castles, villages, and (nicer)dragons.",
            icon: "sword",
            votes: 25,
        },
        {
            id: "swamp",
            title: "Witch's swamp",
            description: "A swamp with witches, cauldrons, and spooky trees.",
            icon: "laser",
            votes: 8,

        },
    ],
  },
  {
    id: "vote-3", 
    gameId: "fortnite",
    title: "Choose the next Battle Pass theme",
    description: "Help decide what theme will be added to Fortnite next.",
    status: "Open",
    endsAt: "2 days remaining",
    options: [
      {
        id: "space",
        title: "Space Odyssey",
        description: "A space-themed battle pass with futuristic skins and weapons.",
        icon: "laser",
        votes: 45,
      },
      {
        id: "pirates",
        title: "Pirate Adventure",
        description: "A pirate-themed battle pass with ships, treasure, and swashbuckling skins.",
        icon: "sword",
        votes: 30,
      },
      {
        id: "wildwest",
        title: "Wild West",
        description: "A western-themed battle pass with cowboy skins and duels.",
        icon: "map",
        votes: 25,
      }
    ]
  }
];

export function getVotesForGame(gameId: string) {
  return communityVotes.filter((vote) => vote.gameId === gameId);
}

export function getVote(voteId: string) {
  return communityVotes.find((vote) => vote.id === voteId);
}