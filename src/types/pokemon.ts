import { Pokemon } from "../lib/pokemonClass";

export interface IPokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  moves: Move[];
  currentHP: number;
  maxHP: number;
  speed: number;
  speedBoost?: number;
  attack: number;
  attackBoost?: number;
  defense: number;
  defenseBoost?: number;
  isKnockedOut: boolean;
  cost?: number;
}

export interface Move {
  name: string;
  power: number;
  type: "attack" | "boost-defense" | "boost-attack" | "boost-speed" | "healing";
  effect: string;
}

export interface Player {
  name: string;
  points: number;
  activeTeam: Pokemon[];
  inventory: Pokemon[];
  wins: number;
  losses: number;
}

export interface Store {
  pokemon: Pokemon[];
}
