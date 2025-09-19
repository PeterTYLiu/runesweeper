import { type RefObject } from "react";
import { useSettingsContext } from "../../hooks/useSettingsContext";
import { difficultiesDict, sizesDict } from "../../utils/settings";
import styles from "./RecordModal.module.css";

export default function RecordModal({
  ref,
  record,
  oldRecord,
}: {
  ref: RefObject<HTMLDialogElement | null>;
  record: number | null;
  oldRecord?: number | null;
}) {
  const { settings } = useSettingsContext();

  const { numOfColumns, mineRatio } = settings;

  const difficulty = Object.values(difficultiesDict).find((d) => d.mineRatio === mineRatio)!;
  const size = Object.values(sizesDict).find((s) => s.w === numOfColumns)!;

  return (
    // @ts-ignore since closedby is not recognized by TS yet
    <dialog ref={ref} className={styles.dialog} closedby="any">
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
      <button className={styles.done} onClick={() => ref.current?.close()}>
        Wonderful!
      </button>
    </dialog>
  );
}
