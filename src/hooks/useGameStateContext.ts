import { createContext, useContext, type Dispatch } from "react";
import { TileType } from "../components/tile/Tile";

export type Status = "pre" | "during" | "won" | "lost";

export interface GameState {
  tiles: TileType[];
  status: Status;
  triggeredMinesIds: number[];
}

interface GameStateContextType {
  gameState: GameState;
  setGameState: Dispatch<GameState>;
}

const defaultValue: GameStateContextType = {
  gameState: { tiles: [], status: "pre", triggeredMinesIds: [] },
  setGameState: () => {},
};

export const GameStateContext = createContext(defaultValue);

export function useGameStateContext() {
  const { gameState, setGameState } = useContext(GameStateContext);
  return { gameState, setGameState };
}
