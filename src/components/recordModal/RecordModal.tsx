import { useRef, useEffect, type Dispatch } from "react";
import styles from "./RecordModal.module.scss";
import { useSettingsContext } from "../../hooks/useSettingsContext";
import { difficultiesDict, sizesDict } from "../../utils/settings";

export default function RecordModal({
  shown,
  setShown,
  record,
  oldRecord,
}: {
  shown: boolean;
  setShown: Dispatch<boolean>;
  record: number | null;
  oldRecord?: number | null;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const { settings } = useSettingsContext();

  const { numOfColumns, mineRatio } = settings;

  const difficulty = Object.values(difficultiesDict).find((d) => d.mineRatio === mineRatio)!;
  const size = Object.values(sizesDict).find((s) => s.w === numOfColumns)!;

  useEffect(() => {
    if (shown) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [shown]);

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <header>
        <img src="./images/phat-green.png" />
        <h2>New record!</h2>
        <img src="./images/phat-purple.png" />
      </header>
      <p>
        Best time for {size?.w}x{size?.h} at {difficulty?.label} difficulty
      </p>
      <h1>{record}s</h1>
      {typeof oldRecord === "number" && (
        <p>
          Previous record: <strong>{oldRecord}s</strong>
        </p>
      )}
      <button className={styles.done} onClick={() => setShown(false)}>
        Wonderful!
      </button>
    </dialog>
  );
}
