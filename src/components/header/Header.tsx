import { useEffect, useRef } from "react";
import { useGameStateContext } from "../../hooks/useGameStateContext";
import { useSettingsContext } from "../../hooks/useSettingsContext";
import generateTiles from "../../utils/generateTiles";
import AboutModal from "../aboutModal/AboutModal";
import MineCounter from "../mineCounter/MineCounter";
import SettingsModal from "../settingsModal/SettingsModal";
import Timer from "../timer/Timer";
import styles from "./Header.module.css";

export default function Header() {
  const aboutModalRef = useRef<HTMLDialogElement>(null);
  const settingsModalRef = useRef<HTMLDialogElement>(null);

  const { gameState, setGameState } = useGameStateContext();
  const { settings } = useSettingsContext();

  const { status } = gameState;

  useEffect(() => {
    const hasSeenAbout = localStorage.getItem("showAboutModal");
    if (!hasSeenAbout) aboutModalRef.current?.showModal();
  }, []);

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
            <button onClick={() => aboutModalRef.current?.showModal()}>
              <img src="./images/info.png" />
            </button>
            <button onClick={() => settingsModalRef.current?.showModal()}>
              <img src="./images/settings.png" />
            </button>
          </>
        )}
      </div>
      <SettingsModal settingsModalRef={settingsModalRef} />
      <AboutModal aboutModalRef={aboutModalRef} />
    </header>
  );
}
