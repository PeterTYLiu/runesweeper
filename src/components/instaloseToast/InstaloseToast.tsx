import styles from "./InstaloseToast.module.scss";

export default function InstaloseToast({ open }: { open: boolean }) {
  return (
    <dialog className={styles.dialog} open={open}>
      Out of time!
    </dialog>
  );
}
