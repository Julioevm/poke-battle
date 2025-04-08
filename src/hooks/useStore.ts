import { useAtom } from "jotai";
import { storeAtom } from "../atoms/atoms";
import { generateTeam } from "../lib/utils";
const STORE_SIZE = 24;

export const useStore = () => {
  const [store, setStore] = useAtom(storeAtom);

  const initializeStore = async () => {
    const storePokemon = await generateTeam(STORE_SIZE);
    setStore({ pokemon: storePokemon });
  };
  return { store, initializeStore };
};
