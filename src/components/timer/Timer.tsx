import { useEffect, useState } from "react";
import { useGameStateContext } from "../../hooks/useGameStateContext";
import { useSettingsContext } from "../../hooks/useSettingsContext";
import RecordModal from "../recordModal/RecordModal";
import styles from "../../styles/counter.module.scss";

export default function Timer() {
  const { gameState, setGameState } = useGameStateContext();
  const { settings } = useSettingsContext();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [recordModalShown, setRecordModalShown] = useState(false);
  const [record, setRecord] = useState<number | null>(null);
  const [prevRecord, setPrevRecord] = useState<number | null>(null);

  const { status } = gameState;
  const { numOfColumns, numOfRows, mineRatio } = settings;

  useEffect(() => {
    const preRecordString = localStorage.getItem(`${numOfColumns * numOfRows}tiles${mineRatio}mineRatio`);
    setRecord(preRecordString ? Number(preRecordString) : null);
  }, [mineRatio, numOfColumns, numOfRows]);

  useEffect(() => {
    // Ironman/instalose mode
    if (status === "during" && record && settings.instalose && timeElapsed > record) {
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
    if (status === "won" && (!record || timeElapsed < record)) {
      setPrevRecord(record);
      setRecord(timeElapsed);
      setRecordModalShown(true);
      localStorage.setItem(`${numOfColumns * numOfRows}tiles${mineRatio}mineRatio`, timeElapsed.toString());
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
      <RecordModal shown={recordModalShown} setShown={setRecordModalShown} record={record} oldRecord={prevRecord} />
      {status !== "pre" && <img src="./images/watch.webp" />}
      <span>{status === "pre" ? (record ? `Best: ${record}s` : "No best time") : timeElapsed.toFixed(1) + "s"}</span>
    </div>
  );
}
