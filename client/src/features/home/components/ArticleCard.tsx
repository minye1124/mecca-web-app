import styles from "./ArticleCard.module.css";
import type { ArticleTeaser } from "../types";

export interface ArticleCardProps {
  article: ArticleTeaser;
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <a href={article.href} className={styles.card}>
      <div className={styles.image} style={{ background: article.gradient }} />
      <p className={styles.tag}>{article.tag}</p>
      <p className={styles.title}>{article.title}</p>
      <p className={styles.meta}>
        {article.date} · {article.read}
      </p>
    </a>
  );
}

export default ArticleCard;
