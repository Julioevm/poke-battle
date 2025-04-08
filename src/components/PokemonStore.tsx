import React from "react";
import { Pokemon, Player } from "../types/pokemon";
import { PokemonCard } from "./PokemonCard";

interface PokemonStoreProps {
  storePokemon: Pokemon[];
  player: Player;
  onPurchase: (pokemon: Pokemon) => void;
}

export const PokemonStore: React.FC<PokemonStoreProps> = ({
  storePokemon,
  player,
  onPurchase,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pokémon Store</h2>
        <div className="text-lg font-semibold">
          Points: <span className="text-blue-600">{player.points}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {storePokemon.map((pokemon) => (
          <div key={pokemon.id} className="relative">
            <PokemonCard pokemon={pokemon} />
            <div className="mt-2 text-center">
              <p className="text-lg font-semibold text-green-600">
                {pokemon.cost} points
              </p>
              <button
                onClick={() => onPurchase(pokemon)}
                disabled={
                  player.points < (pokemon.cost ?? 0) ||
                  player.inventory.length >= 12
                }
                className={`mt-2 px-4 py-2 rounded-lg w-full ${
                  player.points >= (pokemon.cost ?? 0) &&
                  player.inventory.length < 12
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-300 cursor-not-allowed text-gray-600"
                }`}
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
