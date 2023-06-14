import { useEffect, useState } from "react";
import { useGameStateContext } from "../../hooks/useGameStateContext";
import { useSettingsContext } from "../../hooks/useSettingsContext";
import { difficultiesDict, sizesDict } from "../../utils/settings";
import styles from "../../styles/counter.module.scss";

export default function Timer() {
  const { gameState, setGameState } = useGameStateContext();
  const { settings } = useSettingsContext();
  const [timeElapsed, setTimeElapsed] = useState(0);

  const { status } = gameState;
  const { numOfColumns, numOfRows, mineRatio } = settings;

  const currentFormatKey = `${numOfColumns * numOfRows}tiles${mineRatio}mineRatio`;
  const recordTime = localStorage.getItem(currentFormatKey);

  useEffect(() => {
    // Ironman/instalose mode
    if (status === "during" && recordTime && settings.instalose && timeElapsed > Number(recordTime)) {
      alert("Out of time!");
      return setGameState({ ...gameState, status: "lost" });
    }
    if (status === "during") {
      const timer = setInterval(() => {
        setTimeElapsed(Number((timeElapsed + 0.1).toFixed(1)));
      }, 100);
      return () => clearInterval(timer);
    }

    // Code for setting records
    if (status === "won") {
      if (!recordTime || timeElapsed < Number(recordTime)) {
        const { label } = Object.values(difficultiesDict).find((d) => d.mineRatio === mineRatio)!;
        const { w, h } = Object.values(sizesDict).find((s) => s.w === numOfColumns)!;

        alert(`New record!
        ${w}x${h} at ${label} difficulty
        ${recordTime ? `Prev record: ${recordTime}s` : ""}
        `);

        localStorage.setItem(currentFormatKey, timeElapsed.toString());
        // setOldAndNewRecords({
        //   old: prevRecordTime ? Number(prevRecordTime) : undefined,
        //   new: timeElapsed,
        // });
        // setNewRecordOpen(true);
        // setCurrentRecord(timeElapsed);
      }
    }
  }, [status, timeElapsed]);

  // Reset the time between games
  useEffect(() => {
    if (status === "pre") {
      setTimeElapsed(0);
    }
  }, [status]);

  return (
    <div className={styles.counter}>
      {status !== "pre" && <img src="/images/watch.webp" />}
      <span>{status === "pre" ? (recordTime ? `Best: ${recordTime}s` : "No best time") : timeElapsed.toFixed(1) + "s"}</span>
    </div>
  );
}
