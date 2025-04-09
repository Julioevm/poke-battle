import React from "react";
import { PokemonCard } from "./PokemonCard";
import { Loader2, Play, Swords } from "lucide-react";
import { usePokemonBattle } from "../hooks/usePokemonBattle";
import { Pokemon } from "../lib/pokemonClass";

const Battle: React.FC = () => {
  const {
    player,
    enemyTeam,
    inBattle,
    isExecutingTurn,
    gameOver,
    executeTurn,
    battleLog,
    startBattle,
    winner,
  } = usePokemonBattle();
  if (!player) return null;

  if (inBattle) {
    return (
      <div className="space-y-8">
        {!gameOver && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Enemy Team</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {enemyTeam.map((pokemon: Pokemon, index: number) => (
                    <PokemonCard
                      key={`${index}-${pokemon.id}`}
                      pokemon={pokemon}
                      isEnemy
                    />
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Your Team</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {player.activeTeam.map((pokemon: Pokemon, index: number) => (
                    <PokemonCard
                      key={`${index}-${pokemon.id}`}
                      pokemon={pokemon}
                    />
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
  } else {
    return (
      <div className="space-y-8 flex flex-col items-center">
        <h2 className="text-3xl font-bold">Battle Lobby</h2>
        <div className="bg-white rounded-lg p-6 shadow-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Battle Record</h3>
          <p className="text-lg">
            Wins:{" "}
            <span className="font-bold text-green-600">{player.wins}</span>
          </p>
          <p className="text-lg">
            Losses:{" "}
            <span className="font-bold text-red-600">{player.losses}</span>
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-4 text-center">
            Your Current Team
          </h3>
          {player.activeTeam.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {player.activeTeam.map((pokemon: Pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Your active team is empty. Go to the 'Team' section to add
              Pokémon.
            </p>
          )}
        </div>
        <button
          onClick={startBattle}
          disabled={player.activeTeam.length === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-colors text-xl ${
            player.activeTeam.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          <Swords size={24} />
          Look for Opponent
        </button>
      </div>
    );
  }
};

export default Battle;
