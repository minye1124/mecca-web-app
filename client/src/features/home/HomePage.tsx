import styles from "./HomePage.module.css";

import SectionShell from "./sections/SectionShell";
import DiscoverySection from "./sections/DiscoverySection";
import HomeHero from "./sections/HomeHero";
import NeedToKnowRail from "./sections/NeedToKnowRail";
import TrustBar from "./sections/TrustBar";

import {
  categories,
  curatedProducts,
  featuredArticle,
  articles,
  banners,
  needToKnowProducts,
  trustItems,
} from "./content";

import ProductCard from "./components/ProductCard";
import CategoryCard from "./components/CategoryCard";

function HomePage() {
  return (
    <main className={styles.main}>

      {/* 1. Hero Banner */}
      <HomeHero />

      {/* 2. Need to Know */}
      <NeedToKnowRail products={needToKnowProducts} />

      {/* 3. Shop by Category */}
      <SectionShell title="Shop by Category">
        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <CategoryCard key={cat.title} category={cat} />
          ))}
        </div>
      </SectionShell>

      {/* 4. Curated for You */}
      <SectionShell title="Curated for you">
        <div className={styles.curatedGrid}>
          {curatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} variant="detailed" />
          ))}
        </div>
      </SectionShell>

      {/* 5. MECCA Memo */}
      <DiscoverySection
        title="MECCA Memo"
        featuredArticle={featuredArticle}
        articles={articles}
        banners={banners}
      />

      {/* 6. From us to you */}
      <TrustBar items={trustItems} />

    </main>
  );
}

export default HomePage;
