import { Link, useParams } from "react-router";
import { ArrowLeft, ChevronRight, Vote } from "lucide-react";
import { getGameName } from "../forumStore";
import { getVotesForGame } from "../votingStore";
import "../voting.css";

function VotingPage() {
  const { gameId = "" } = useParams();
  const gameName = getGameName(gameId);
  const votes = getVotesForGame(gameId);

  return (
    <div className="voting-page">
      <Link to={`/games/${gameId}`} className="back-button voting-back">
        <ArrowLeft size={20} />
        <span>{gameName}</span>
      </Link>

      <header className="voting-header">
        <p className="eyebrow">{gameName.toUpperCase()} COMMUNITY</p>
        <h1>Voting</h1>
        <p>Help decide which features should be added next.</p>
      </header>

      {votes.length === 0 ? (
        <div className="vote-empty">
          <Vote size={32} />
          <h2>No votes are open right now.</h2>
          <p>Check back later for the next community feature vote.</p>
        </div>
      ) : (
        <ul className="vote-list">
          {votes.map((vote) => (
            <li key={vote.id}>
              <Link
                to={`/games/${gameId}/voting/${vote.id}`}
                className="vote-list-card"
              >
                <div className="vote-list-card-body">
                  <span
                    className={`vote-status vote-status--${vote.status.toLowerCase()}`}
                  >
                    {vote.status}
                  </span>

                  <h2>{vote.title}</h2>
                  <p>{vote.description}</p>

                  <div className="vote-list-meta">
                    <span>{vote.options.length} choices</span>
                    <span>{vote.endsAt}</span>
                  </div>
                </div>

                <ChevronRight size={20} className="vote-chevron" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VotingPage;