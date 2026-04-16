import ProductCard from "../components/ProductCard";
import type {
  RecommendedProductsSection as RecommendedProductsSectionContent,
} from "../types";
import SectionShell from "./SectionShell";

import styles from "./RecommendedProductsSection.module.css";

export interface RecommendedProductsSectionProps {
  section: RecommendedProductsSectionContent;
}

function RecommendedProductsSection({
  section,
}: RecommendedProductsSectionProps) {
  return (
    <SectionShell title={section.title}>
      <div className={styles.grid}>
        {section.products.map((product) => (
          <ProductCard key={product.id} product={product} variant="detailed" />
        ))}
      </div>
    </SectionShell>
  );
}

export default RecommendedProductsSection;
