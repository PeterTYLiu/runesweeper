import type { RefObject } from "react";
import styles from "./AboutModal.module.css";

export default function AboutModal({ aboutModalRef }: { aboutModalRef: RefObject<HTMLDialogElement | null> }) {
  const indicateAboutModalHasBeenSeen = () => {
    localStorage.setItem("showAboutModal", "false");
  };

  return (
    // @ts-ignore since closedby is not recognized by TS yet
    <dialog ref={aboutModalRef} className={styles.dialog} closedby="any" onClose={indicateAboutModalHasBeenSeen}>
      <header>
        <p>Welcome to</p>
        <h1>RuneSweeper</h1>
      </header>
      <section>
        <video src="./videos/flag.mp4" autoPlay disablePictureInPicture loop muted />
        <h2>Right-click on a tile to flag it or mark it as "maybe"</h2>
      </section>
      <section>
        <video src="./videos/chord.mp4" autoPlay disablePictureInPicture loop muted />
        <h2>
          Right-click or double-click on a number tile to{" "}
          <a href="https://en.wikipedia.org/wiki/Chording#Minesweeper_tactic" target="_blank">
            chord
          </a>{" "}
          it
        </h2>
      </section>
      <section>
        <h2>On mobile, you can long-press or swipe instead of double-clicking or right-clicking.</h2>
      </section>
      <button
        className={styles.start}
        onClick={() => {
          indicateAboutModalHasBeenSeen();
          aboutModalRef.current?.close();
        }}
      >
        Play
      </button>
    </dialog>
  );
}
