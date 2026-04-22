import type { CategorySummary } from "../types";
import styles from "./CategoryCard.module.css";

export interface CategoryCardProps {
  category: CategorySummary;
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <a href={category.href} className={styles.card}>
      <div className={styles.image} style={{ background: category.media.value }} />
      <div className={styles.body}>
        <p className={styles.title}>{category.title}</p>
        <p className={styles.subtitle}>{category.subtitle}</p>
      </div>
    </a>
  );
}

export default CategoryCard;
