import type { RefObject } from "react";
import { type Settings, useSettingsContext } from "../../hooks/useSettingsContext";
import { controlsDict, difficultiesDict, sizesDict } from "../../utils/settings";
import styles from "./SettingsModal.module.css";

export default function SettingsModal({ settingsModalRef }: { settingsModalRef: RefObject<HTMLDialogElement | null> }) {
  const { settings, setSettings } = useSettingsContext();

  const { numOfColumns, numOfRows } = settings;
  const numOfTiles = numOfColumns * numOfRows;

  function handleChangeSize(w: number, h: number) {
    localStorage.setItem("numOfColumns", `${w}`);
    localStorage.setItem("numOfRows", `${h}`);
    setSettings({ ...settings, numOfColumns: w, numOfRows: h });
  }

  function handleChangeDifficulty(mineRatio: number) {
    localStorage.setItem("mineRatio", `${mineRatio}`);
    setSettings({ ...settings, mineRatio });
  }

  function handleChangeOrientation(isLandscape: boolean) {
    localStorage.setItem("isLandscape", JSON.stringify(isLandscape));
    setSettings({ ...settings, isLandscape });
  }

  return (
    // @ts-ignore since closedby is not recognized by TS yet
    <dialog ref={settingsModalRef} className={styles.dialog} closedBy="any">
      <header>
        <h1>Settings</h1>
        <button onClick={() => settingsModalRef.current?.close()} className="icon">
          <img src="./images/close.png" />
        </button>
      </header>
      <section>
        <h2>Size & Orientation</h2>
        <div className={styles["button-group"]}>
          {Object.values(sizesDict).map(({ w, h, label }) => (
            <button key={label} className={numOfTiles === w * h ? styles.selected : ""} onClick={() => handleChangeSize(w, h)}>
              {label}
              <br />
              <span>
                {w} x {h}
              </span>
            </button>
          ))}
        </div>
        <div className={styles["button-group"]}>
          <button className={settings.isLandscape ? styles.selected : ""} onClick={() => handleChangeOrientation(true)}>
            Landscape
          </button>
          <button className={!settings.isLandscape ? styles.selected : ""} onClick={() => handleChangeOrientation(false)}>
            Portrait
          </button>
        </div>
      </section>
      <section>
        <h2>Difficulty</h2>
        <div className={styles["button-group"]}>
          {Object.values(difficultiesDict).map(({ label, mineRatio }) => (
            <button
              key={label}
              className={mineRatio === settings.mineRatio ? styles.selected : ""}
              onClick={() => handleChangeDifficulty(mineRatio)}
            >
              {label}
              <br />
              <span>{mineRatio * 100}% mines</span>
            </button>
          ))}
        </div>
      </section>
      <section>
        <h2>Controls</h2>
        {Object.entries(controlsDict).map(([key, entry]) => {
          return (
            <div key={key} className={styles.toggle}>
              <span>{entry.label}</span>
              <div className={styles["button-group"]}>
                <button
                  className={settings[key as keyof Settings] ? styles.selected : ""}
                  onClick={() => {
                    localStorage.setItem(key, "true");
                    setSettings({ ...settings, [key]: true });
                  }}
                >
                  On
                </button>
                <button
                  className={!settings[key as keyof Settings] ? styles.selected : ""}
                  onClick={() => {
                    localStorage.setItem(key, "false");
                    setSettings({ ...settings, [key]: false });
                  }}
                >
                  Off
                </button>
              </div>
            </div>
          );
        })}
      </section>
      <section>
        <h2>HCIM Mode</h2>
        <p>HCIM mode causes the game to instantly end if you do not beat your best time</p>
        <div className={styles["button-group"]}>
          <button
            className={settings.instalose ? styles.selected : ""}
            onClick={() => {
              localStorage.setItem("instalose", "true");
              setSettings({ ...settings, instalose: true });
            }}
          >
            Enabled
          </button>
          <button
            className={!settings.instalose ? styles.selected : ""}
            onClick={() => {
              localStorage.setItem("instalose", "false");
              setSettings({ ...settings, instalose: false });
            }}
          >
            Disabled
          </button>
        </div>
      </section>
    </dialog>
  );
}
