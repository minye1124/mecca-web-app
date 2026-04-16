import type { HeroSection as HeroSectionContent } from "../types";
import styles from "./HeroSection.module.css";

export interface HeroSectionProps {
  section: HeroSectionContent;
}

function HeroSection({ section }: HeroSectionProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <p className={styles.heroEyebrow}>{section.eyebrow}</p>
        <h1 className={styles.heroHeadline}>
          {section.headline}
        </h1>
        <p className={styles.heroSub}>{section.description}</p>
        <div className={styles.heroCtas}>
          <a href={section.primaryCta.href} className={styles.btnPrimary}>
            {section.primaryCta.label}
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
