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
  const [gameState, setGameState] = useState<GameState>({ tiles: [], status: "pre", triggeredMinesIds: [] });

  const { numOfColumns, numOfRows, mineRatio, isLandscape } = settings;
  const { tiles, status } = gameState;

  // Update board when certain settings change
  useEffect(() => {
    setGameState({
      tiles: generateTiles(numOfColumns, numOfRows, mineRatio, isLandscape),
      status: "pre",
      triggeredMinesIds: [],
    });
  }, [numOfColumns, numOfRows, isLandscape]);

  // Checks if you've done something to win, if you haven't already won or lost.
  // Losing is triggered elsewhere.
  useEffect(() => {
    if (status !== "during") return;
    const numOfSweptNonMines = tiles.filter((t) => t.swept && !t.isMine).length;
    const numOfNonMines = tiles.filter((t) => !t.isMine).length;
    if (numOfNonMines === numOfSweptNonMines) setGameState({ ...gameState, status: "won" });
  }, [gameState]);

  // The depending on which pre-game tile the user clicks, we generate a board such that
  // the tile they clicked triggers a cascade.
  const pregameTiles = tiles
    .filter((t) => t.c === 1)
    .map((_tile, index) => {
      return (
        <div key={index} className={styles.row}>
          {tiles
            .filter((t) => t.r === index + 1)
            .map((innerTile) => (
              <PregameTile id={innerTile.id} key={innerTile.id} />
            ))}
        </div>
      );
    });

  const gameTiles = tiles
    .filter((t) => t.c === 1)
    .map((_tile, index) => {
      return (
        <div key={index} className={styles.row}>
          {tiles
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
          <div className={styles.board}>{status === "pre" ? pregameTiles : gameTiles}</div>
          <p className={styles.credits}>
            Made by Peter Liu&nbsp;&nbsp;|&nbsp;&nbsp;v1.0.1&nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="https://github.com/PeterTYLiu/runesweeper" target="_blank">
              Github
            </a>
          </p>
        </main>
      </GameStateContext.Provider>
    </SettingsContext.Provider>
  );
}

export default App;
