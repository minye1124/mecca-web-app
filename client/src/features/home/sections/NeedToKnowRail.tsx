import ProductCard from "../components/ProductCard";
import type { ProductTeaser } from "../types";

import styles from "./NeedToKnowRail.module.css";

export interface NeedToKnowRailProps {
  products: ProductTeaser[];
}

function NeedToKnowRail({ products }: NeedToKnowRailProps) {
  return (
    <section className={styles.section}>
      <div className={styles.left}>
        <p className={styles.eyebrow}>File Under:</p>
        <h2 className={styles.title}>Need to Know</h2>
        <p className={styles.subtitle}>
          The beauty products we tell all our friends about.
        </p>
        <a href="/shop" className={styles.link}>
          Shop now
        </a>
      </div>

      <div className={styles.right}>
        <div className={styles.productScroll}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NeedToKnowRail;
