import { Pokemon } from "../types/pokemon";
const MAX_POKEMON = 151; // Gen 1 Pokémon
const TEAM_SIZE = 6;

export const getRandomPokemon = async (): Promise<Pokemon> => {
  const id = Math.floor(Math.random() * MAX_POKEMON) + 1;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();

  // Get two random moves
  const attackMove = {
    name: data.moves[Math.floor(Math.random() * data.moves.length)].move.name,
    power: Math.floor(Math.random() * 50) + 30,
    type: "attack" as const,
    effect: "Deals damage",
  };

  const supportMove = {
    name: data.moves[Math.floor(Math.random() * data.moves.length)].move.name,
    power: Math.floor(Math.random() * 20) + 10,
    type: "support" as const,
    effect: "Increases defense",
  };

  const pokemon: Pokemon = {
    id: data.id,
    name: data.name,
    sprites: data.sprites,
    stats: data.stats,
    moves: [attackMove, supportMove],
    currentHP: data.stats[0].base_stat,
    maxHP: data.stats[0].base_stat,
    speed: data.stats[5].base_stat,
    attack: data.stats[1].base_stat,
    defense: data.stats[2].base_stat,
    isKnockedOut: false,
    cost: data.stats.reduce(
      (sum: number, stat: { base_stat: number }) => sum + stat.base_stat,
      0
    ),
  };

  return pokemon;
};

export const generateTeam = async (size: number = TEAM_SIZE) => {
  const team: Pokemon[] = [];
  for (let i = 0; i < size; i++) {
    team.push(await getRandomPokemon());
  }
  return team;
};
