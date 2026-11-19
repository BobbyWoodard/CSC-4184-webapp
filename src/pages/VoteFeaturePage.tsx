import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Map, Palette, Users, TreeDeciduous, Swords, Laser} from "lucide-react";
import { CURRENT_USER, getGameName } from "../forumStore";
import { getVote } from "../votingStore";
import type { VoteOption } from "../votingStore";
import "../voting.css";

function VoteFeaturePage() {
  const { gameId = "", voteId = "" } = useParams();
  const gameName = getGameName(gameId);
  const vote = getVote(voteId);
  const storageKey = `community-vote:${CURRENT_USER}:${voteId}`;

  const [savedVote] = useState<SavedVote | null>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? (JSON.parse(saved) as SavedVote) : null;
    } catch {
      return null;
    }
  });

  const [options, setOptions] = useState<VoteOption[]>(
    () => savedVote?.options ?? vote?.options ?? []
  );

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    () => savedVote?.selectedOptionId ?? null
  );

  type SavedVote = { 
    selectedOptionId: string | null;
    options: VoteOption[];
  };

  if (!vote) {
    return (
      <div className="voting-page vote-not-found">
        <h1>Vote not found</h1>
        <Link to={`/games/${gameId}/voting`} className="primary-button">
          Back to voting
        </Link>
      </div>
    );
  }

  useEffect(() => {
    localStorage.setItem(
      storageKey, JSON.stringify({
        selectedOptionId,
        options,
      })
    );
  }, [storageKey, selectedOptionId, options]);

  const isOpen = vote.status === "Open";
  const winner =[...options].sort((a, b) => b.votes - a.votes)[0];

  const handleVote = (optionId: string) => {
    if(vote.status !== "Open" || optionId === selectedOptionId) return;
    setOptions((currentOptions) =>
    currentOptions.map((option) => {
      if (option.id === optionId) {
        return { ...option, votes: option.votes + 1 };
      }
      if (option.id === selectedOptionId) {
        return { ...option, votes: Math.max(0, option.votes -1) };
      }
      return option;
    }));
    setSelectedOptionId(optionId);
  };
  
  const totalVotes = options.reduce((total, option) => total + option.votes, 0);

  const getIcon = (icon: string) => {
    if (icon === "palette") return <Palette size={34} />;
    if (icon === "users") return <Users size={34} />;
    if (icon === "tree") return <TreeDeciduous size={34} />;
    if (icon === "sword") return <Swords size={34} />;
    if (icon === "laser") return <Laser size={34} />;
    return <Map size={34} />;
  };

  return (
    <div className="voting-page">
      <Link to={`/games/${gameId}/voting`} className="back-button voting-back">
        <ArrowLeft size={20} />
        <span>Voting</span>
      </Link>

      <header className="voting-header">
        <p className="eyebrow">{gameName.toUpperCase()} COMMUNITY</p>
        <h1>{vote.title}</h1>
        <p>{vote.description}</p>
        <span className="vote-deadline">{vote.endsAt}</span>
      </header>

      {!isOpen && (
        <div className = {`vote-status-message vote-status-message--${vote.status.toLowerCase()}`}>
          {vote.status === "Closed" ? (
            <>
            <strong> Voting has closed. You can no longer vote.</strong>
            <span>
              The community chose {winner.title}. This feature will be implemented in a future update.
            </span>
            </>
          ) : (
            <>
            <strong> This feature has been implemented!</strong>
            <span>
              {winner.title} won this community vote and is now available in the game.
            </span>
            </>
          )}
          </div>
          )}

      <section className="vote-options" aria-label="Feature options">
        {options.map((option) => {
          const selected = selectedOptionId === option.id;
          const percentage = Math.round((option.votes / totalVotes) * 100);

          return (
            <article
              key={option.id}
              className={`vote-option${selected ? " selected" : ""}`}
            >
              <div className="vote-option-icon">{getIcon(option.icon)}</div>

              <h2>{option.title}</h2>
              <p>{option.description}</p>

              <div className="vote-bar" aria-label={`${percentage}% of votes`}>
                <span style={{ height: `${percentage}%` }} />
              </div>

              <strong className="vote-percent">{percentage}%</strong>

              <button
                type="button"
                className="vote-select-button"
                onClick={() => handleVote(option.id)}
                disabled={!isOpen}
              >
                {selected ? "Your vote" : isOpen ? "Vote for this" : "Voting Closed"}
              </button>
            </article>
          );
        })}
      </section>

      {selectedOptionId && (
        <p className="vote-confirmation">
          Your vote has been recorded. You can change it while voting is open.
        </p>
      )}
    </div>
  );
}

export default VoteFeaturePage;