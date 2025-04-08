import { useState } from "react";
import { Pokemon, Move, Player, Store } from "../types/pokemon";

const MAX_POKEMON = 151; // Gen 1 Pokémon
const TEAM_SIZE = 6;
const STORE_SIZE = 24;
const TURN_DELAY = 1000; // 1 second delay between each action

const getRandomPokemon = async (): Promise<Pokemon> => {
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

const generateTeam = async (size: number = TEAM_SIZE) => {
  const team: Pokemon[] = [];
  for (let i = 0; i < size; i++) {
    team.push(await getRandomPokemon());
  }
  return team;
};

export const usePokemonBattle = () => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [enemyTeam, setEnemyTeam] = useState<Pokemon[]>([]);
  const [store, setStore] = useState<Store>({ pokemon: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<"player" | "enemy" | null>(null);
  const [isExecutingTurn, setIsExecutingTurn] = useState(false);
  const [inBattle, setInBattle] = useState(false);

  const initializeStore = async () => {
    const storePokemon = await generateTeam(STORE_SIZE);
    setStore({ pokemon: storePokemon });
  };

  const handlePlayerSetup = async (newPlayer: Player) => {
    // Player starts with no active team
    setPlayer({
      ...newPlayer,
      activeTeam: [], // Start with an empty team
      inventory: [],
      wins: 0,
      losses: 0,
    });
    await initializeStore();
    setIsLoading(false);
  };

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

  const updatePlayerTeam = (activeTeam: Pokemon[], inventory: Pokemon[]) => {
    if (!player) return;
    setPlayer({
      ...player,
      activeTeam,
      inventory,
    });
  };

  const performMove = (attacker: Pokemon, defender: Pokemon, move: Move) => {
    if (move.type === "attack") {
      const damage = Math.floor(
        (move.power * attacker.attack) / defender.defense
      );
      defender.currentHP = Math.max(0, defender.currentHP - damage);
      defender.isKnockedOut = defender.currentHP === 0;
      return `${attacker.name} used ${move.name} on ${defender.name} for ${damage} damage!`;
    } else {
      attacker.defense += move.power;
      return `${attacker.name} used ${move.name} and increased its defense!`;
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
    isLoading,
    battleLog,
    currentRound,
    gameOver,
    winner,
    executeTurn,
    isExecutingTurn,
    handlePlayerSetup,
    handlePurchase,
    updatePlayerTeam,
    inBattle,
    startBattle,
  };
};
