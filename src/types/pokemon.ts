export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
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
  attack: number;
  defense: number;
  isKnockedOut: boolean;
  cost?: number;
}

export interface Move {
  name: string;
  power: number;
  type: "attack" | "support";
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
