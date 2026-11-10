import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Map, Palette, Users, TreeDeciduous, Swords, Laser} from "lucide-react";
import { getGameName } from "../forumStore";
import { getVote } from "../votingStore";
import "../voting.css";

function VoteFeaturePage() {
  const { gameId = "", voteId = "" } = useParams();
  const gameName = getGameName(gameId);
  const vote = getVote(voteId);

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

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

      <section className="vote-options" aria-label="Feature options">
        {vote.options.map((option) => {
          const selected = selectedOptionId === option.id;

          return (
            <article
              key={option.id}
              className={`vote-option${selected ? " selected" : ""}`}
            >
              <div className="vote-option-icon">{getIcon(option.icon)}</div>

              <h2>{option.title}</h2>
              <p>{option.description}</p>

              <div className="vote-bar" aria-label={`${option.percent}% of votes`}>
                <span style={{ height: `${option.percent}%` }} />
              </div>

              <strong className="vote-percent">{option.percent}%</strong>

              <button
                type="button"
                className="vote-select-button"
                onClick={() => setSelectedOptionId(option.id)}
                disabled={vote.status !== "Open"}
              >
                {selected ? "Your vote" : "Vote for this"}
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