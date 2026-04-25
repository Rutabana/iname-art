import styles from "./Ticker.module.css";

const ITEMS = [
  "Recycled Futures",
  "Open Studio Fridays",
  "Artist Residency 2026",
  "Mixed Media",
  "Sculpture",
  "Painting",
  "Community Space",
  "Kigali Rwanda",
];

function TickerList() {
  return (
    <span className={styles.list} aria-hidden>
      {ITEMS.map((item, i) => (
        <span key={i} className={styles.item}>
          {item}
          <span className={styles.dot}> · </span>
        </span>
      ))}
    </span>
  );
}

export default function Ticker() {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div className={styles.track}>
        <TickerList />
        <TickerList />
      </div>
    </div>
  );
}
