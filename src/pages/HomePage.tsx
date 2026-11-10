import { useState } from "react";
import { Link } from "react-router";
import { Plus, Gamepad2, X } from "lucide-react";

interface Game {
id: string;
name: string;
}

const defaultGames: Game[] = [
{ id: "minecraft", name: "Minecraft" },
{ id: "fortnite", name: "Fortnite" },
{ id: "deadlock", name: "Deadlock" },
];

function HomePage() {
    const [games, setGames] = useState<Game[]>(() => {
        const saved = localStorage.getItem("myGames");
        return saved ? JSON.parse(saved) : defaultGames;
    });

    const [showAddGame, setShowAddGame] = useState(false);
    const [newGame, setNewGame] = useState("");

    const addGame = (e: React.FormEvent) => {
        e.preventDefault();

        const name = newGame.trim();

        if (!name) return;

        const id = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

        if (games.some((game) => game.id === id)) {
            alert("This game has already been added.");
            return;
        }

        const updatedGames = [...games, { id, name }];

        setGames(updatedGames);
        localStorage.setItem("myGames", JSON.stringify(updatedGames));

        setNewGame("");
        setShowAddGame(false);
    };

    return (
        <div className="home-page">
            <header className="home-header">
                <div>
                    <p className="eyebrow">YOUR COMMUNITY</p>
                    <h1>My Games</h1>
                    <p className="home-subtitle">
                        Select a game to explore its community.
                    </p>
                </div>

                <div className="game-count">
                    {games.length}
                    <span>Games</span>
                </div>
            </header>

            <div className="games-grid">
                {games.map((game) => (
                    <Link
                        to={`/games/${game.id}`}
                        className="game-card"
                        key={game.id}
                    >
                        <div
                        className={`game-card-art game-art--${defaultGames.some(
                            (g) => g.id === game.id
                        ) ? game.id : "default"}`}
                        >
                        <Gamepad2 size={38} />
                        <span>EXPLORE COMMUNITY</span>
                        </div>

                        <div className="game-card-info">
                        <h2>{game.name}</h2>
                        <span>View community →</span>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="add-game-container">
                <button
                    className="add-game-button"
                    onClick={() => setShowAddGame(true)}
                >
                    <div className="add-game-icon">
                        <Plus size={60} />
                    </div>
                    
                    <h2>Add Game</h2>
                    
                </button>
            </div>

            {showAddGame && (
                <div className="modal-overlay">
                    <form className="add-game-modal" onSubmit={addGame}>
                        <button
                            type="button"
                            className="modal-close"
                            onClick={() => setShowAddGame(false)}
                        >
                            <X size={22} />
                        </button>

                        <h2>Add a Game</h2>
                        <p>Add another game to your communities.</p>

                        <input
                            autoFocus
                            type="text"
                            placeholder="Enter game name"
                            value={newGame}
                            onChange={(e) => setNewGame(e.target.value)}
                            required
                        />

                        <button type="submit" className="primary-button">
                            Add Game
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default HomePage;