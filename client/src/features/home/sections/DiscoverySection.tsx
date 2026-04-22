import ArticleCard from "../components/ArticleCard";
import { formatPublishedDate, formatReadTime } from "../formatters";
import type { DiscoverySection as DiscoverySectionContent } from "../types";

import styles from "./DiscoverySection.module.css";

export interface DiscoverySectionProps {
  section: DiscoverySectionContent;
}

function DiscoverySection({ section }: DiscoverySectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.headline}>{section.title}</h2>

      <div className={styles.featured}>
        <div
          className={styles.featuredMain}
          style={{ background: section.featured.primaryMedia.value }}
        />
        <div className={styles.featuredSide}>
          <div
            className={styles.featuredSideImage}
            style={{ background: section.featured.secondaryMedia.value }}
          />
          <div className={styles.featuredSideText}>
            <p className={styles.meta}>
              {formatPublishedDate(section.featured.publishedAt)} · {formatReadTime(section.featured.readTimeMinutes)}
            </p>
            <h3 className={styles.title}>{section.featured.title}</h3>
          </div>
        </div>
      </div>

      <div className={styles.articleRow}>
        {section.articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className={styles.banners}>
        {section.promos.map((promo) => (
          <div
            key={promo.id}
            className={styles.banner}
            style={{ background: promo.media.value }}
          >
            <div className={styles.bannerText}>
              <p className={styles.bannerTitle}>{promo.title}</p>
              <a href={promo.cta.href} className={styles.bannerLink}>
                {promo.cta.label}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DiscoverySection;
