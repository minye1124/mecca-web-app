import ArticleCard from "../components/ArticleCard";
import type { FeaturedArticle, ArticleTeaser, Banner } from "../types";

import styles from "./DiscoverySection.module.css";

export interface DiscoverySectionProps {
  title: string;
  featuredArticle: FeaturedArticle;
  articles: ArticleTeaser[];
  banners: Banner[];
}

function DiscoverySection({
  title,
  featuredArticle,
  articles,
  banners,
}: DiscoverySectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.headline}>{title}</h2>

      <div className={styles.featured}>
        <div
          className={styles.featuredMain}
          style={{ background: featuredArticle.mainGradient }}
        />
        <div className={styles.featuredSide}>
          <div
            className={styles.featuredSideImage}
            style={{ background: featuredArticle.sideGradient }}
          />
          <div className={styles.featuredSideText}>
            <p className={styles.meta}>
              {featuredArticle.date} · {featuredArticle.read}
            </p>
            <h3 className={styles.title}>{featuredArticle.title}</h3>
          </div>
        </div>
      </div>

      <div className={styles.articleRow}>
        {articles.map((article) => (
          <ArticleCard key={article.title} article={article} />
        ))}
      </div>

      <div className={styles.banners}>
        {banners.map((banner) => (
          <div
            key={banner.title}
            className={styles.banner}
            style={{ background: banner.gradient }}
          >
            <div className={styles.bannerText}>
              <p className={styles.bannerTitle}>{banner.title}</p>
              <a href={banner.href} className={styles.bannerLink}>
                {banner.linkLabel}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DiscoverySection;
