import { useSwipeable } from "react-swipeable";
import { useGameStateContext } from "../../hooks/useGameStateContext";
import { useSettingsContext } from "../../hooks/useSettingsContext";
import styles from "./Tile.module.scss";
import chord from "../../utils/chord";
import floodFill from "../../utils/floodFill";

export interface TileType {
  isMine: boolean;
  minesAround: number;
  swept: boolean;
  id: number;
  c: number;
  r: number;
  flagStatus: "flagged" | "maybe" | "unflagged";
}

interface TileProps {
  tile: TileType;
}

const maybe = <img src="./images/maybe.png" />;
const flagged = <img className={styles.flag} src="./images/flag.png" />;
const falseFlagged = <img src="./images/falseFlag.png" />;
const mine = <img src="./images/mine.png" />;
const clearedMine = <img src="./images/clearedMine.png" />;

export default function Tile({ tile }: TileProps) {
  const { swept, isMine, minesAround, flagStatus, id, c, r } = tile;

  // Hooks
  const { gameState, setGameState } = useGameStateContext();
  const { settings } = useSettingsContext();
  const swipeHandler = useSwipeable({
    onSwiped: () => {
      if (settings.swipeToChord && swept && !isMine && minesAround) setGameState(chord(tile, gameState));
      else if (settings.swipeToFlag && !swept) {
        const newTiles = [...gameState.tiles];
        newTiles[id - 1].flagStatus = flagStatus === "flagged" ? "unflagged" : "flagged";
        setGameState({ ...gameState, tiles: newTiles });
      }
    },
  });

  const { status, tiles, triggeredMinesIds } = gameState;

  // Event handlers

  const handleContextMenu = (e: any) => {
    if (!swept && e.button === 2) {
      const newTiles = [...tiles];
      newTiles[id - 1].flagStatus =
        flagStatus === "unflagged" ? (settings.allowMaybe ? "maybe" : "flagged") : flagStatus === "maybe" ? "flagged" : "unflagged";
      return setGameState({ ...gameState, tiles: newTiles });
    }
    if (swept && !isMine && minesAround) setGameState(chord(tile, gameState));
  };

  const handleDoubleClick = () => {
    if (swept && !isMine && minesAround) setGameState(chord(tile, gameState));
  };

  const handleClick = () => {
    const newTiles = [...tiles];
    newTiles[id - 1].swept = true;
    if ((flagStatus === "unflagged" || flagStatus === "maybe") && isMine) {
      return setGameState({ tiles: newTiles, status: "lost", triggeredMinesIds: [id] });
    }
    if (flagStatus === "unflagged" && !swept) {
      if (minesAround === 0 && !isMine) floodFill(newTiles[id - 1], newTiles);
      setGameState({ ...gameState, tiles: newTiles });
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    if (!e.target) return;
    highlightTilesToChord();
    if (swept) return;
    const flagThisTile = setTimeout(() => {
      const newTiles = [...tiles];
      newTiles[id - 1].flagStatus = flagStatus === "unflagged" ? (settings.allowMaybe ? "maybe" : "flagged") : "unflagged";
      return setGameState({ ...gameState, tiles: newTiles });
    }, 800);
    e.target.addEventListener("touchend", () => {
      clearTimeout(flagThisTile);
    });
  };

  const highlightTilesToChord = () => {
    if (swept && minesAround) {
      const chordableTilesIds = [
        tiles.find((tile) => tile.r === r && tile.c === c + 1),
        tiles.find((tile) => tile.r === r && tile.c === c - 1),
        tiles.find((tile) => tile.r === r + 1 && tile.c === c),
        tiles.find((tile) => tile.r === r - 1 && tile.c === c),
        tiles.find((tile) => tile.r === r + 1 && tile.c === c + 1),
        tiles.find((tile) => tile.r === r - 1 && tile.c === c - 1),
        tiles.find((tile) => tile.r === r + 1 && tile.c === c - 1),
        tiles.find((tile) => tile.r === r - 1 && tile.c === c + 1),
      ]
        .filter((tile) => !tile?.swept && tile?.flagStatus !== "flagged")
        .map((tile) => tile?.id);
      chordableTilesIds.forEach((id) => {
        document.querySelector(`.id-${id}`)?.classList.add(styles.hightlight);
      });
    }
  };

  const unhighlightTilesToChord = () => {
    if (swept && minesAround && !isMine) {
      const highlightedTiles = document.querySelectorAll(`.${styles.hightlight}`);
      highlightedTiles.forEach((tile) => tile.classList.remove(styles.hightlight));
    }
  };

  const TileContents = (
    <>
      {(status === "during" || isMine) && flagStatus === "flagged" ? flagged : null}
      {status !== "during" && !isMine && flagStatus === "flagged" ? falseFlagged : null}
      {!swept && flagStatus === "maybe" && status === "during" ? maybe : null}
      {status === "during" ? (
        !isMine && minesAround && swept ? (
          <p>{minesAround}</p>
        ) : null
      ) : isMine ? (
        flagStatus !== "flagged" ? (
          status === "won" ? (
            clearedMine
          ) : (
            mine
          )
        ) : status === "won" && flagStatus !== "flagged" ? (
          clearedMine
        ) : null
      ) : minesAround && swept ? (
        <p>{minesAround}</p>
      ) : null}
    </>
  );

  return (
    <button
      onMouseDown={highlightTilesToChord}
      onTouchStart={handleTouchStart}
      onMouseUp={unhighlightTilesToChord}
      onTouchEnd={unhighlightTilesToChord}
      onMouseLeave={unhighlightTilesToChord}
      onDoubleClick={handleDoubleClick}
      {...swipeHandler}
      className={`${styles.tile} ${isMine ? styles.mine : ""} ${swept ? styles.swept : ""} ${styles[`is-${minesAround}`]} ${
        triggeredMinesIds.includes(id) ? styles.trigger : ""
      } id-${id}`}
      onContextMenu={(e) => {
        e.preventDefault();
        handleContextMenu(e);
      }}
      onClick={handleClick}
      style={status !== "during" ? { pointerEvents: "none" } : {}}
    >
      {TileContents}
    </button>
  );
}
