import { useRef, useEffect, type Dispatch } from "react";
import styles from "./AboutModal.module.scss";

export default function AboutModal({ shown, setShown }: { shown: boolean; setShown: Dispatch<boolean> }) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (shown) {
      dialogRef.current?.removeAttribute("open");
      dialogRef.current?.showModal();
    } else dialogRef.current?.close();
  }, [shown]);

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <header>
        <p>Welcome to</p>
        <h1>RuneSweeper</h1>
      </header>
      <button
        onClick={() => {
          localStorage.setItem("showAboutModal", "false");
          setShown(false);
        }}
      >
        Play
      </button>
      <p>Github repo</p>
    </dialog>
  );
}
