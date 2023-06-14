import styles from "./Tile.module.scss";
import { useGameStateContext } from "../../hooks/useGameStateContext";
import { useSettingsContext } from "../../hooks/useSettingsContext";
import generateTiles from "../../utils/generateTiles";
import floodFill from "../../utils/floodFill";

export default function PregameTile({ id }: { id: number }) {
  const { setGameState } = useGameStateContext();
  const { settings } = useSettingsContext();
  const { numOfColumns, numOfRows, mineRatio, isLandscape } = settings;

  function startGame() {
    let newTiles = generateTiles(numOfColumns, numOfRows, mineRatio, isLandscape);

    // Ensure the clicked tile is a 0 and not a mine
    while (newTiles[id - 1].isMine || newTiles[id - 1].minesAround !== 0) {
      newTiles = generateTiles(numOfColumns, numOfRows, mineRatio, isLandscape);
    }

    // Sweet and cascade the clicked tile
    newTiles[id - 1].swept = true;
    floodFill(newTiles[id - 1], newTiles);

    setGameState({ tiles: newTiles, status: "during", triggeredMinesIds: [] });
  }

  return <button className={styles.tile} onClick={startGame} />;
}
