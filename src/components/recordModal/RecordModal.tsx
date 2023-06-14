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
      <h1>New record!</h1>
      <p>
        Best time for {size?.w}x{size?.h} at {difficulty?.label} difficulty
      </p>
      <h2>{record}s</h2>
      {!!oldRecord && (
        <p>
          Previous record: <strong>{oldRecord}s</strong>
        </p>
      )}
      <button onClick={() => setShown(false)}>Wonderflu!</button>
    </dialog>
  );
}
