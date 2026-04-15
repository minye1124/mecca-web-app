import type { CategoryTeaser } from "../types";
import styles from "./CategoryCard.module.css";

export interface CategoryCardProps {
  category: CategoryTeaser;
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <a href="/shop" className={styles.card}>
      <div className={styles.image} style={{ background: category.gradient }} />
      <div className={styles.body}>
        <p className={styles.title}>{category.title}</p>
        <p className={styles.subtitle}>{category.sub}</p>
      </div>
    </a>
  );
}

export default CategoryCard;