import { useState } from "react";
import { PlayerSetup } from "./components/PlayerSetup";
import { PokemonStore } from "./components/PokemonStore";
import { TeamManager } from "./components/TeamManager";
import { Swords, Users, Store } from "lucide-react";
import Battle from "./components/Battle";
import { inBattleAtom, isLoadingAtom, playerAtom } from "./atoms/atoms";
import { useAtom } from "jotai";
import { Player } from "./types/pokemon";
import { useStore } from "./hooks/useStore";

type Section = "battle" | "team" | "store";

function App() {
  const [activeSection, setActiveSection] = useState<Section>("store");
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [player, setPlayer] = useAtom(playerAtom);
  const [inBattle] = useAtom(inBattleAtom);
  const { initializeStore } = useStore();

  const handlePlayerSetup = async (newPlayer: Player) => {
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

  if (!player) {
    return <PlayerSetup onComplete={handlePlayerSetup} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  const handleSectionChange = (section: Section) => {
    if (inBattle && section !== "battle") {
      return; // Prevent section change during battle
    }
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold">Pokémon Battle</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleSectionChange("battle")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeSection === "battle"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  } ${
                    inBattle && activeSection !== "battle"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <Swords size={20} />
                  Battle
                </button>
                <button
                  onClick={() => handleSectionChange("team")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeSection === "team"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  } ${inBattle ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={inBattle}
                >
                  <Users size={20} />
                  Team
                </button>
                <button
                  onClick={() => handleSectionChange("store")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeSection === "store"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  } ${inBattle ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={inBattle}
                >
                  <Store size={20} />
                  Poké Center
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-lg">Trainer: {player.name}</span>
              <span className="text-lg">Points: {player.points}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {activeSection === "battle" && <Battle />}
        {activeSection === "team" && <TeamManager />}
        {activeSection === "store" && <PokemonStore />}
      </main>
    </div>
  );
}

export default App;
