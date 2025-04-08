import React from "react";
import { useAtom } from "jotai";
import { PokemonCard } from "./PokemonCard";
import { usePokemonBattle } from "../hooks/usePokemonBattle";
import { playerAtom } from "../atoms/atoms";
import { useStore } from "../hooks/useStore";

export const PokemonStore: React.FC = () => {
  // Access state using Jotai atoms
  const { store } = useStore();
  const [player] = useAtom(playerAtom);
  // Get the purchase action from the custom hook
  const { handlePurchase } = usePokemonBattle();

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pokémon Store</h2>
        <div className="text-lg font-semibold">
          Points: <span className="text-blue-600">{player?.points}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {store.pokemon.map((pokemon, index) => (
          <div key={`${index}-${pokemon.id}`} className="relative">
            <PokemonCard pokemon={pokemon} />
            <div className="mt-2 text-center">
              <p className="text-lg font-semibold text-green-600">
                {pokemon.cost} points
              </p>
              <button
                onClick={() => handlePurchase(pokemon)}
                disabled={
                  !player ||
                  player.points < (pokemon.cost ?? 0) ||
                  player.inventory.length >= 12
                }
                className={`mt-2 px-4 py-2 rounded-lg w-full ${
                  player &&
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
