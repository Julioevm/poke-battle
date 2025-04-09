import { type Move } from "../types/pokemon";
import { Pokemon as ApiPokemon, PokemonClient } from "pokenode-ts";
import { Pokemon } from "./pokemonClass";

const MAX_POKEMON = 151; // Gen 1 Pokémon
const TEAM_SIZE = 6;

console.log("Initializing Pokémon API clients...");
const api = new PokemonClient();

// Get two random moves
const attackMove = (data: ApiPokemon) => {
  return {
    name: data.moves[Math.floor(Math.random() * data.moves.length)].move.name,
    power: Math.floor(Math.random() * 50) + 30,
    type: "attack" as const,
    effect: "Deals damage",
  };
};

const boostDefenseMove = (data: ApiPokemon): Move => {
  return {
    name: data.moves[Math.floor(Math.random() * data.moves.length)].move.name,
    power: Math.floor(Math.random() * 20) + 10,
    type: "boost-defense" as const,
    effect: "Increases defense",
  };
};

const boostAttackMove = (data: ApiPokemon): Move => {
  return {
    name: data.moves[Math.floor(Math.random() * data.moves.length)].move.name,
    power: Math.floor(Math.random() * 20) + 10,
    type: "boost-attack" as const,
    effect: "Increases attack",
  };
};

const boostSpeedMove = (data: ApiPokemon): Move => {
  return {
    name: data.moves[Math.floor(Math.random() * data.moves.length)].move.name,
    power: Math.floor(Math.random() * 20) + 10,
    type: "boost-speed" as const,
    effect: "Increases speed",
  };
};

const healingMove = (data: ApiPokemon): Move => {
  return {
    name: data.moves[Math.floor(Math.random() * data.moves.length)].move.name,
    power: Math.floor(Math.random() * 20) + 10,
    type: "healing" as const,
    effect: "Heals HP",
  };
};

const getRandomPokemonMove = (pokemon: ApiPokemon) => {
  const moves = [
    boostDefenseMove(pokemon),
    boostAttackMove(pokemon),
    boostSpeedMove(pokemon),
    healingMove(pokemon),
  ];
  return moves[Math.floor(Math.random() * moves.length)];
};

export const getRandomPokemon = async (): Promise<Pokemon> => {
  const id = Math.floor(Math.random() * MAX_POKEMON) + 1;
  const data = await api.getPokemonById(id);

  const moves = [attackMove(data), getRandomPokemonMove(data)];
  return new Pokemon(data, moves);
};

export const generateTeam = async (size: number = TEAM_SIZE) => {
  const team: Pokemon[] = [];
  for (let i = 0; i < size; i++) {
    team.push(await getRandomPokemon());
  }
  return team;
};
