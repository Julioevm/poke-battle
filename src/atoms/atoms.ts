import { atom } from "jotai";
import { Player, Pokemon, Store } from "../types/pokemon";

export const playerAtom = atom<Player | null>(null);
export const enemyTeamAtom = atom<Pokemon[]>([]);
export const storeAtom = atom<Store>({ pokemon: [] });
export const isLoadingAtom = atom(true);
export const battleLogAtom = atom<string[]>([]);
export const currentRoundAtom = atom(1);
export const gameOverAtom = atom(false);
export const winnerAtom = atom<"player" | "enemy" | null>(null);
export const isExecutingTurnAtom = atom(false);
export const inBattleAtom = atom(false);
