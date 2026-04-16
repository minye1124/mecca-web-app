import type { ServicesSection as ServicesSectionContent } from "../types";
import { ChatIcon, ReviewsIcon, RewardsIcon, ShippingIcon } from "../components/TrustIcons";

import styles from "./ServicesSection.module.css";

export interface ServicesSectionProps {
  section: ServicesSectionContent;
}

const iconMap = {
    chat: <ChatIcon />,
    shipping: <ShippingIcon />,
    rewards: <RewardsIcon />,
    reviews: <ReviewsIcon />,
};

function ServicesSection({ section }: ServicesSectionProps) {
  return (
    <section className={styles.trustBar}>
      <p className={styles.trustLabel}>{section.title}</p>
      <div className={styles.trustItems}>
        {section.items.map((item) => (
          <a key={item.id} href={item.href} className={styles.trustItem}>
            <span className={styles.trustIcon}>{iconMap[item.iconKey]}</span>
            <span className={styles.trustText}>{item.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;
