import DiscoverySection from "./sections/DiscoverySection";
import HeroSection from "./sections/HeroSection";
import FeaturedProductsSection from "./sections/FeaturedProductsSection";
import CategoriesSection from "./sections/CategoriesSection";
import RecommendedProductsSection from "./sections/RecommendedProductsSection";
import ServicesSection from "./sections/ServicesSection";

import { homePageContent } from "./content";

import styles from "./HomePage.module.css";

function HomePage() {
  return (
    <main className={styles.main}>

      {/* 1. Hero Banner */}
      <HeroSection section={homePageContent.hero} />

      {/* 2. Featured Products */}
      <FeaturedProductsSection section={homePageContent.featuredProducts} />

      {/* 3. Shop by Category */}
      <CategoriesSection section={homePageContent.categories} />

      {/* 4. Recommended Products */}
      <RecommendedProductsSection
        section={homePageContent.recommendedProducts}
      />

      {/* 5. Discovery Section (events, edits, etc.) */}
      <DiscoverySection section={homePageContent.discovery} />

      {/* 6. Services */}
      <ServicesSection section={homePageContent.services} />

    </main>
  );
}

export default HomePage;
