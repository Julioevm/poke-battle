import { useState } from "react";
import { usePokemonBattle } from "./hooks/usePokemonBattle";
import { PokemonCard } from "./components/PokemonCard";
import { PlayerSetup } from "./components/PlayerSetup";
import { PokemonStore } from "./components/PokemonStore";
import { TeamManager } from "./components/TeamManager";
import { Play, Loader2, Swords, Users, Store } from "lucide-react";

type Section = "battle" | "team" | "store";

function App() {
  const [activeSection, setActiveSection] = useState<Section>("store");
  const {
    player,
    enemyTeam,
    store,
    isLoading,
    battleLog,
    currentRound,
    gameOver,
    winner,
    executeTurn,
    isExecutingTurn,
    handlePlayerSetup,
    handlePurchase,
    updatePlayerTeam,
    inBattle,
    startBattle, // Add startBattle here
  } = usePokemonBattle();

  if (!player) {
    return <PlayerSetup onComplete={handlePlayerSetup} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  const handleSectionChange = (section: Section) => {
    if (inBattle && section !== "battle") {
      return; // Prevent section change during battle
    }
    if (section === "battle" && !inBattle) {
      startBattle(); // Call startBattle when navigating to battle for the first time
    }
    setActiveSection(section);
  };

  const renderBattleSection = () => (
    <div className="space-y-8">
      {!gameOver && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Enemy Team</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {enemyTeam.map((pokemon) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} isEnemy />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Your Team</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {player.activeTeam.map((pokemon) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Battle Log</h2>
              <div className="space-x-4 flex items-center">
                {inBattle && (
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Withdraw
                  </button>
                )}
                <button
                  onClick={executeTurn}
                  disabled={isExecutingTurn || player.activeTeam.length === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isExecutingTurn || player.activeTeam.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {isExecutingTurn ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Play size={20} />
                  )}
                  {isExecutingTurn ? "Executing Turn..." : "Next Turn"}
                </button>
              </div>
            </div>

            <div className="h-[600px] overflow-y-auto space-y-2">
              {battleLog.map((log, index) => (
                <p
                  key={index}
                  className={`p-2 rounded ${
                    index === 0 ? "bg-blue-100" : "bg-gray-50"
                  }`}
                >
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">
            Game Over -{" "}
            {winner === "player" ? `${player.name} Won!` : "Enemy Won!"}
          </h3>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold">Pokémon Battle</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleSectionChange("battle")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeSection === "battle"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  } ${
                    inBattle && activeSection !== "battle"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <Swords size={20} />
                  Battle
                </button>
                <button
                  onClick={() => handleSectionChange("team")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeSection === "team"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  } ${inBattle ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={inBattle}
                >
                  <Users size={20} />
                  Team
                </button>
                <button
                  onClick={() => handleSectionChange("store")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeSection === "store"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  } ${inBattle ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={inBattle}
                >
                  <Store size={20} />
                  Poké Center
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-lg">Trainer: {player.name}</span>
              <span className="text-lg">Points: {player.points}</span>
              {inBattle && (
                <span className="text-lg">Round {currentRound}</span>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {activeSection === "battle" && renderBattleSection()}
        {activeSection === "team" && (
          <TeamManager player={player} onUpdateTeam={updatePlayerTeam} />
        )}
        {activeSection === "store" && (
          <PokemonStore
            storePokemon={store.pokemon}
            player={player}
            onPurchase={handlePurchase}
          />
        )}
      </main>
    </div>
  );
}

export default App;
