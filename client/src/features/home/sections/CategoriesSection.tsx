import CategoryCard from "../components/CategoryCard";
import type { CategoriesSection as CategoriesSectionContent } from "../types";
import SectionShell from "./SectionShell";

import styles from "./CategoriesSection.module.css";

export interface CategoriesSectionProps {
  section: CategoriesSectionContent;
}

function CategoriesSection({ section }: CategoriesSectionProps) {
  return (
    <SectionShell title={section.title}>
      <div className={styles.grid}>
        {section.items.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </SectionShell>
  );
}

export default CategoriesSection;
