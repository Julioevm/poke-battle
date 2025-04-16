import { IPokemon } from "../types/pokemon";

interface PokemonCardProps {
  pokemon: IPokemon;
  isEnemy?: boolean;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const healthPercentage = (pokemon.currentHP / pokemon.maxHP) * 100;
  const healthColor =
    healthPercentage > 50
      ? "bg-green-500"
      : healthPercentage > 20
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div
      className={`relative p-4 rounded-lg ${
        pokemon.isKnockedOut ? "bg-gray-200 opacity-50" : "bg-white"
      } shadow-md`}
    >
      <img
        src={pokemon.sprites.front_default ?? undefined}
        alt={pokemon.name}
        className={`w-24 h-24 mx-auto ${
          pokemon.isKnockedOut ? "grayscale" : ""
        }`}
      />
      <h3 className="text-lg font-semibold capitalize text-center">
        {pokemon.name}
      </h3>

      <div className="mt-2">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${healthColor} transition-all duration-300`}
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
        <p className="text-sm text-center mt-1">
          {pokemon.currentHP} / {pokemon.maxHP} HP
        </p>
      </div>

      <div className="mt-2 text-sm">
        <p>Speed: {pokemon.speed}</p>
        <p>Attack: {pokemon.attack}</p>
        <p>Defense: {pokemon.defense}</p>
      </div>

      {pokemon.isKnockedOut && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
          <span className="text-white font-bold text-xl">KO</span>
        </div>
      )}
    </div>
  );
};
