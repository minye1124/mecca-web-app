import type { ArticleSummary } from "../types";
import { formatPublishedDate, formatReadTime } from "../formatters";
import styles from "./ArticleCard.module.css";

export interface ArticleCardProps {
  article: ArticleSummary;
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <a href={article.href} className={styles.card}>
      <div className={styles.image} style={{ background: article.media.value }} />
      <p className={styles.tag}>{article.tag}</p>
      <p className={styles.title}>{article.title}</p>
      <p className={styles.meta}>
        {formatPublishedDate(article.publishedAt)} · {formatReadTime(article.readTimeMinutes)}
      </p>
    </a>
  );
}

export default ArticleCard;
