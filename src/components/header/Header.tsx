import { useState } from "react";
import styles from "./Header.module.css";
import { useGameStateContext } from "../../hooks/useGameStateContext";
import { useSettingsContext } from "../../hooks/useSettingsContext";
import SettingsModal from "../settingsModal/SettingsModal";
import AboutModal from "../aboutModal/AboutModal";
import Timer from "../timer/Timer";
import MineCounter from "../mineCounter/MineCounter";
import generateTiles from "../../utils/generateTiles";

export default function Header() {
  const [settingsModalShown, setSettingsModalShown] = useState(false);
  const [aboutModalShown, setAboutModalShown] = useState(localStorage.getItem("showAboutModal") ? false : true);
  const { gameState, setGameState } = useGameStateContext();
  const { settings } = useSettingsContext();

  const { status } = gameState;

  // Reset to pre-game state
  function reset() {
    setGameState({
      tiles: generateTiles(settings.numOfColumns, settings.numOfRows, settings.mineRatio, settings.isLandscape),
      status: "pre",
    });
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Timer />
      </div>
      {(status === "won" || status === "lost") && (
        <button className={styles.main} onClick={reset}>
          <img src="./images/hometele.webp" />
        </button>
      )}
      <div className={styles.right}>
        {status === "during" ? (
          <MineCounter />
        ) : (
          <>
            <button onClick={() => setAboutModalShown(true)}>
              <img src="./images/info.png" />
            </button>
            <button onClick={() => setSettingsModalShown(true)}>
              <img src="./images/settings.png" />
            </button>
          </>
        )}
      </div>
      <SettingsModal shown={settingsModalShown} setShown={setSettingsModalShown} />
      <AboutModal shown={aboutModalShown} setShown={setAboutModalShown} />
    </header>
  );
}
