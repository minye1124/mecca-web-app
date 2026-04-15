import type { TrustItem } from "../types";
import { ChatIcon, ReviewsIcon, RewardsIcon, ShippingIcon } from "../components/TrustIcons";

import styles from "./TrustBar.module.css";

export interface TrustBarProps {
  items: TrustItem[];
}

const iconMap = {
    chat: <ChatIcon />,
    shipping: <ShippingIcon />,
    rewards: <RewardsIcon />,
    reviews: <ReviewsIcon />,
  }

function TrustBar({ items }: TrustBarProps) {
  return (
    <section className={styles.trustBar}>
      <p className={styles.trustLabel}>From us to you</p>
      <div className={styles.trustItems}>
        {items.map((item) => (
          <a key={item.label} href={item.href} className={styles.trustItem}>
            <span className={styles.trustIcon}>{iconMap[item.iconKey]}</span>
            <span className={styles.trustText}>{item.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default TrustBar;
