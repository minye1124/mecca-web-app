export type LinkRef = {
  label: string;
  href: string;
};

export type Money = {
  amount: number;
  currency: "AUD";
};

export type MediaSurface = {
  kind: "gradient";
  value: string;
};

export type ProductSummary = {
  id: string;
  brand: string;
  name: string;
  price: Money;
  media: MediaSurface;
};

export type ProductSocialProof = {
  rating: number;
  reviewCount: number;
};

export type ProductBadge = {
  label: string;
};

export type HeroSection = {
  eyebrow: string;
  headline: string;
  description: string;
  primaryCta: LinkRef;
};

export type FeaturedProductsSection = {
  eyebrow: string;
  title: string;
  description: string;
  cta: LinkRef;
  products: ProductSummary[];
};

export type CategorySummary = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  media: MediaSurface;
};

export type CategoriesSection = {
  title: string;
  items: CategorySummary[];
};

export type RecommendedProduct = ProductSummary & {
  socialProof: ProductSocialProof;
  badge?: ProductBadge;
};

export type RecommendedProductsSection = {
  title: string;
  products: RecommendedProduct[];
};

export type ArticleSummary = {
  id: string;
  tag: string;
  title: string;
  publishedAt: string;
  readTimeMinutes: number;
  href: string;
  media: MediaSurface;
};

export type FeaturedArticle = {
  id: string;
  title: string;
  publishedAt: string;
  readTimeMinutes: number;
  href: string;
  primaryMedia: MediaSurface;
  secondaryMedia: MediaSurface;
};

export type PromoCard = {
  id: string;
  title: string;
  cta: LinkRef;
  media: MediaSurface;
};

export type DiscoverySection = {
  title: string;
  featured: FeaturedArticle;
  articles: ArticleSummary[];
  promos: PromoCard[];
};

export type TrustItemIconKey = "chat" | "shipping" | "rewards" | "reviews";

export type TrustItem = {
  id: string;
  label: string;
  href: string;
  iconKey: TrustItemIconKey;
};

export type ServicesSection = {
  title: string;
  items: TrustItem[];
};

export type HomePageContent = {
  hero: HeroSection;
  featuredProducts: FeaturedProductsSection;
  categories: CategoriesSection;
  recommendedProducts: RecommendedProductsSection;
  discovery: DiscoverySection;
  services: ServicesSection;
};
