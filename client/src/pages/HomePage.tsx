import styles from "./HomePage.module.css";

import SectionShell from "../features/home/sections/SectionShell";
import DiscoverySection from "../features/home/sections/DiscoverySection";
import HomeHero from "../features/home/sections/HomeHero";
import NeedToKnowRail from "../features/home/sections/NeedToKnowRail";
import TrustBar from "../features/home/sections/TrustBar";

import {
  categories,
  curatedProducts,
  featuredArticle,
  articles,
  banners,
  needToKnowProducts,
  trustItems,
} from "../features/home/content";

import ProductCard from "../features/home/components/ProductCard";
import CategoryCard from "../features/home/components/CategoryCard";

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
