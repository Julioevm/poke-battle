import { Move, IPokemon } from "../types/pokemon";
import { Pokemon as ApiPokemon } from "pokenode-ts";

export class Pokemon implements IPokemon {
  id: number;
  name: string;
  sprites: { front_default: string | null };
  stats: { base_stat: number; stat: { name: string } }[];
  moves: Move[];
  currentHP: number;
  maxHP: number;
  speed: number;
  speedBoost: number = 0;
  attack: number;
  attackBoost: number = 0;
  defense: number;
  defenseBoost: number = 0;
  isKnockedOut: boolean = false;
  cost?: number;

  constructor(data: ApiPokemon, moves: Move[]) {
    this.id = data.id;
    this.name = data.name;
    this.sprites = data.sprites;
    this.stats = data.stats;
    this.moves = moves;
    this.currentHP = data.stats[0].base_stat;
    this.maxHP = data.stats[0].base_stat;
    this.speed = data.stats[5].base_stat;
    this.attack = data.stats[1].base_stat;
    this.defense = data.stats[2].base_stat;
    this.cost = data.stats.reduce(
      (sum: number, stat: { base_stat: number }) => sum + stat.base_stat,
      0
    );
  }

  getEffectiveAttack(): number {
    return this.attack + this.attackBoost;
  }

  getEffectiveDefense(): number {
    return this.defense + this.defenseBoost;
  }

  getEffectiveSpeed(): number {
    return this.speed + this.speedBoost;
  }

  takeDamage(damage: number): void {
    this.currentHP = Math.max(0, this.currentHP - damage);
    if (this.currentHP === 0) {
      this.isKnockedOut = true;
    }
  }

  heal(amount: number): number {
    const previousHP = this.currentHP;
    this.currentHP = Math.min(this.maxHP, this.currentHP + amount);
    return this.currentHP - previousHP;
  }

  boostAttack(amount: number): void {
    this.attackBoost += amount;
  }

  boostDefense(amount: number): void {
    this.defenseBoost += amount;
  }

  boostSpeed(amount: number): void {
    this.speedBoost += amount;
  }

  resetBoosts(): void {
    this.attackBoost = 0;
    this.defenseBoost = 0;
    this.speedBoost = 0;
  }

  revive(): void {
    this.currentHP = Math.floor(this.maxHP / 2);
    this.isKnockedOut = false;
  }

  fullHeal(): void {
    this.currentHP = this.maxHP;
    this.isKnockedOut = false;
  }
}
