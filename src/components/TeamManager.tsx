import React from 'react';
import { Pokemon, Player } from '../types/pokemon';
import { PokemonCard } from './PokemonCard';

interface TeamManagerProps {
  player: Player;
  onUpdateTeam: (activeTeam: Pokemon[], inventory: Pokemon[]) => void;
}

export const TeamManager: React.FC<TeamManagerProps> = ({ player, onUpdateTeam }) => {
  const handleSwap = (pokemon: Pokemon, isMovingToTeam: boolean) => {
    let newActiveTeam = [...player.activeTeam];
    let newInventory = [...player.inventory];

    if (isMovingToTeam) {
      if (newActiveTeam.length >= 6) return;
      newInventory = newInventory.filter(p => p.id !== pokemon.id);
      newActiveTeam.push(pokemon);
    } else {
      newActiveTeam = newActiveTeam.filter(p => p.id !== pokemon.id);
      newInventory.push(pokemon);
    }

    onUpdateTeam(newActiveTeam, newInventory);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Team Manager</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Active Team ({player.activeTeam.length}/6)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {player.activeTeam.map((pokemon) => (
              <div key={pokemon.id} className="relative">
                <PokemonCard pokemon={pokemon} />
                <button
                  onClick={() => handleSwap(pokemon, false)}
                  className="mt-2 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Move to Inventory
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Inventory ({player.inventory.length}/12)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {player.inventory.map((pokemon) => (
              <div key={pokemon.id} className="relative">
                <PokemonCard pokemon={pokemon} />
                <button
                  onClick={() => handleSwap(pokemon, true)}
                  disabled={player.activeTeam.length >= 6}
                  className={`mt-2 w-full px-4 py-2 rounded-lg ${
                    player.activeTeam.length < 6
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-300 cursor-not-allowed text-gray-600'
                  }`}
                >
                  Add to Team
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};