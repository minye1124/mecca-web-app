import styles from "./TrustBar.module.css";
import type { TrustItem } from "../types";

export interface TrustBarProps {
  items: TrustItem[];
}

function TrustBar({ items }: TrustBarProps) {
  return (
    <section className={styles.trustBar}>
      <p className={styles.trustLabel}>From us to you</p>
      <div className={styles.trustItems}>
        {items.map((item) => (
          <a key={item.label} href={item.href} className={styles.trustItem}>
            <span className={styles.trustIcon}>{item.icon}</span>
            <span className={styles.trustText}>{item.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default TrustBar;
