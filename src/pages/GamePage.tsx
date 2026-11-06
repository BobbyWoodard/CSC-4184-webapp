import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  MessagesSquare,
  Vote,
  Newspaper,
  ChevronRight,
} from "lucide-react";

function GamePage() {
  const { gameId } = useParams();

  const gameName = gameId
    ? gameId
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Game";

  return (
    <div className="game-page">
      <Link to="/" className="back-button">
        <ArrowLeft size={20} />
        <span>My Games</span>
      </Link>

      <header className="game-page-header">
        <p className="eyebrow">GAME COMMUNITY</p>
        <h1>{gameName}</h1>
        <p>Connect, discuss, and shape your community.</p>
      </header>

      <div className="game-actions">
        <Link to={`/games/${gameId}/forum`} className="game-icon-button forum-button">
          <span>Forum</span>
          <MessagesSquare size={88} strokeWidth={1.8} />
        </Link>

        <Link to={`/games/${gameId}/voting`} className="game-icon-button voting-button">
          <span>Voting</span>
          <Vote size={88} strokeWidth={1.8} />
        </Link>
      </div>

      <Link to={`/games/${gameId}/updates`} className="updates-icon-button">
        <span>Updates</span>
        <Newspaper size={88} strokeWidth={1.8} />
      </Link>
    </div>
  );
}

export default GamePage;