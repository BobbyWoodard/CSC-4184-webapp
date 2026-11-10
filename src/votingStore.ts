export type VoteStatus = "Open" | "Closed" | "Implemented";

export type VoteOption = {
  id: string;
  title: string;
  description: string;
  icon: "palette" | "users" | "map";
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
];

export function getVotesForGame(gameId: string) {
  return communityVotes.filter((vote) => vote.gameId === gameId);
}

export function getVote(voteId: string) {
  return communityVotes.find((vote) => vote.id === voteId);
}