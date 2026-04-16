import ProductCard from "../components/ProductCard";
import type { FeaturedProductsSection as FeaturedProductsSectionContent } from "../types";

import styles from "./FeaturedProductsSection.module.css";

export interface FeaturedProductsSectionProps {
  section: FeaturedProductsSectionContent;
}

function FeaturedProductsSection({ section }: FeaturedProductsSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.left}>
        <p className={styles.eyebrow}>{section.eyebrow}</p>
        <h2 className={styles.title}>{section.title}</h2>
        <p className={styles.subtitle}>{section.description}</p>
        <a href={section.cta.href} className={styles.link}>
          {section.cta.label}
        </a>
      </div>

      <div className={styles.right}>
        <div className={styles.productScroll}>
          {section.products.map((product) => (
            <ProductCard key={product.id} product={product} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProductsSection;
