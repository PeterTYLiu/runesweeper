import { useState, useEffect } from "react";
import { defaultSettings, SettingsContext, type Settings } from "./hooks/useSettingsContext";
import { GameStateContext, type GameState } from "./hooks/useGameStateContext";
import styles from "./App.module.scss";
import generateTiles from "./utils/generateTiles";
import Tile from "./components/tile/Tile";
import PregameTile from "./components/tile/PregameTile";
import Header from "./components/header/Header";

function App() {
  const settingsOnLoad: Settings = { ...defaultSettings };
  Object.keys(defaultSettings).forEach((key) => {
    // @ts-ignore
    if (localStorage.getItem(key)) settingsOnLoad[key] = JSON.parse(localStorage.getItem(key));
  });

  const [settings, setSettings] = useState<Settings>(settingsOnLoad);
  const [gameState, setGameState] = useState<GameState>({
    tiles: generateTiles(settings.numOfColumns, settings.numOfRows, settings.mineRatio, settings.isLandscape),
    status: "pre",
    triggeredMinesIds: [],
  });

  // Update board when settings change
  useEffect(() => {
    setGameState({
      tiles: generateTiles(settings.numOfColumns, settings.numOfRows, settings.mineRatio, settings.isLandscape),
      status: "pre",
      triggeredMinesIds: [],
    });
  }, [settings]);

  // Checks if you've done something to win or lose, if you haven't already won or lost
  useEffect(() => {
    if (gameState.status !== "during") return;
    const numOfSweptNonMines = gameState.tiles.filter((t) => t.swept && !t.isMine).length;
    const numOfNonMines = gameState.tiles.filter((t) => !t.isMine).length;
    if (numOfNonMines === numOfSweptNonMines) setGameState({ ...gameState, status: "won" });
    if (gameState.tiles.find((t) => t.isMine && t.swept)) setGameState({ ...gameState, status: "lost" });
  }, [gameState]);

  // The depending on which pre-game tile the user clicks, we generate a board such that
  // the tile they clicked triggers a cascade.
  const pregameTiles = gameState.tiles
    .filter((t) => t.c === 1)
    .map((_tile, index) => {
      return (
        <div key={index} className={styles.row}>
          {gameState.tiles
            .filter((t) => t.r === index + 1)
            .map((innerTile) => (
              <PregameTile id={innerTile.id} key={innerTile.id} />
            ))}
        </div>
      );
    });

  const gameTiles = gameState.tiles
    .filter((t) => t.c === 1)
    .map((_tile, index) => {
      return (
        <div key={index} className={styles.row}>
          {gameState.tiles
            .filter((t) => t.r === index + 1)
            .map((innerTile) => (
              <Tile tile={innerTile} key={innerTile.id} />
            ))}
        </div>
      );
    });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      <GameStateContext.Provider value={{ gameState, setGameState }}>
        <main className={styles.main}>
          <Header />
          <div className={styles.board}>{gameState.status === "pre" ? pregameTiles : gameTiles}</div>
        </main>
      </GameStateContext.Provider>
    </SettingsContext.Provider>
  );
}

export default App;
