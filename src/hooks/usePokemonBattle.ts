import { useAtom } from "jotai";
import { Pokemon, Move } from "../types/pokemon";
import {
  battleLogAtom,
  currentRoundAtom,
  enemyTeamAtom,
  gameOverAtom,
  inBattleAtom,
  isExecutingTurnAtom,
  isLoadingAtom,
  playerAtom,
  storeAtom,
  winnerAtom,
} from "../atoms/atoms";
import { generateTeam } from "../lib/utils";
import { useStore } from "./useStore";

const TURN_DELAY = 1000; // 1 second delay between each action

export const usePokemonBattle = () => {
  const [player, setPlayer] = useAtom(playerAtom);
  const [enemyTeam, setEnemyTeam] = useAtom(enemyTeamAtom);
  const [store, setStore] = useAtom(storeAtom);
  const [, setIsLoading] = useAtom(isLoadingAtom);
  const [battleLog, setBattleLog] = useAtom(battleLogAtom);
  const [currentRound, setCurrentRound] = useAtom(currentRoundAtom);
  const [gameOver, setGameOver] = useAtom(gameOverAtom);
  const [winner, setWinner] = useAtom(winnerAtom);
  const [isExecutingTurn, setIsExecutingTurn] = useAtom(isExecutingTurnAtom);
  const [inBattle, setInBattle] = useAtom(inBattleAtom);
  const { initializeStore } = useStore();

  const handlePurchase = (pokemon: Pokemon) => {
    if (
      !player ||
      player.points < (pokemon.cost ?? 0) ||
      player.inventory.length >= 12
    )
      return;

    setPlayer({
      ...player,
      points: player.points - (pokemon.cost ?? 0),
      inventory: [...player.inventory, { ...pokemon }],
    });

    setStore({
      pokemon: store.pokemon.filter((p) => p.id !== pokemon.id),
    });
  };

  const performMove = (attacker: Pokemon, defender: Pokemon, move: Move) => {
    switch (move.type) {
      case "attack": {
        const damage = Math.floor(
          (move.power * attacker.attack) / defender.defense
        );
        defender.currentHP = Math.max(0, defender.currentHP - damage);
        defender.isKnockedOut = defender.currentHP === 0;
        return `${attacker.name} used ${move.name} on ${defender.name} for ${damage} damage!`;
      }
      case "boost-defense":
        attacker.defense += move.power;
        return `${attacker.name} used ${move.name} and increased its defense by ${move.power}!`;
      case "boost-attack":
        attacker.attack += move.power;
        return `${attacker.name} used ${move.name} and increased its attack by ${move.power}!`;
      case "boost-speed":
        attacker.speed += move.power;
        return `${attacker.name} used ${move.name} and increased its speed by ${move.power}!`;
      case "healing": {
        const healed = Math.min(
          move.power,
          attacker.maxHP - attacker.currentHP
        );
        attacker.currentHP += healed;
        return `${attacker.name} used ${move.name} and healed ${healed} HP!`;
      }
      default:
        return `${attacker.name} used ${move.name} but nothing happened.`;
    }
  };

  const startBattle = async () => {
    if (!player || player.activeTeam.length === 0) {
      // Optional: Add a log or alert that the player needs a team
      setBattleLog((prev) => [
        "You need to set up your active team before starting a battle!",
        ...prev,
      ]);
      return; // Don't start battle without an active team
    }
    if (inBattle) return; // Don't restart if already in battle
    setIsLoading(true);
    const newEnemyTeam = await generateTeam();
    setEnemyTeam(newEnemyTeam);
    setBattleLog(["Battle starts!"]);
    setCurrentRound(1);
    setGameOver(false);
    setWinner(null);
    setInBattle(true);
    setIsLoading(false);
  };

  const executeTurn = async () => {
    if (!player || gameOver || isExecutingTurn) return;
    setIsExecutingTurn(true);
    setInBattle(true);

    const allPokemon = [...player.activeTeam, ...enemyTeam]
      .filter((p) => !p.isKnockedOut)
      .sort((a, b) => b.speed - a.speed);

    for (const pokemon of allPokemon) {
      if (pokemon.isKnockedOut) continue;

      const isPlayerPokemon = player.activeTeam.includes(pokemon);
      const opposingTeam = isPlayerPokemon ? enemyTeam : player.activeTeam;
      const availableTargets = opposingTeam.filter((p) => !p.isKnockedOut);

      if (availableTargets.length === 0) continue;

      const move =
        pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)];
      const target =
        availableTargets[Math.floor(Math.random() * availableTargets.length)];

      const result = performMove(pokemon, target, move);

      // Update the teams to trigger re-render
      if (isPlayerPokemon) {
        setPlayer({
          ...player,
          activeTeam: [...player.activeTeam],
        });
      }
      setEnemyTeam([...enemyTeam]);

      // Add the new log entry at the beginning
      setBattleLog((prev) => [result, ...prev]);

      // Wait for the configured delay
      await new Promise((resolve) => setTimeout(resolve, TURN_DELAY));
    }

    const playerAlive = player.activeTeam.some((p) => !p.isKnockedOut);
    const enemyAlive = enemyTeam.some((p) => !p.isKnockedOut);

    if (!playerAlive || !enemyAlive) {
      // End the battle
      setGameOver(true);
      setWinner(!playerAlive ? "enemy" : "player");
      setInBattle(false);
      // Heal all Pokémon after the battle
      player.activeTeam.forEach((p) => {
        p.currentHP = p.maxHP;
        p.isKnockedOut = false;
      });
      setPlayer((prevPlayer) =>
        prevPlayer ? { ...prevPlayer, losses: prevPlayer.losses + 1 } : null
      ); // Increment losses
      if (!playerAlive) {
        setBattleLog((prev) => ["Enemy wins the battle!", ...prev]);
      } else {
        const pointsWon = 500;
        setBattleLog((prev) => [
          `${player.name} wins the battle and earns ${pointsWon} points!`,
          ...prev,
        ]);
        setPlayer({
          ...player, // Spread player first
          points: player.points + pointsWon, // Update points
          wins: player.wins + 1, // Update wins
        });
        await initializeStore(); // Refresh store after battle
      }
    } else {
      setCurrentRound((prev) => prev + 1);
    }

    setIsExecutingTurn(false);
  };

  return {
    player,
    enemyTeam,
    store,
    battleLog,
    currentRound,
    gameOver,
    winner,
    executeTurn,
    isExecutingTurn,
    handlePurchase,
    inBattle,
    startBattle,
  };
};
