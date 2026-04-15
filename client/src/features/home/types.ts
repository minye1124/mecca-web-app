export type ProductTeaser = {
  id: string;
  brand: string;
  name: string;
  price: string;
  gradient: string;
};

export type CategoryTeaser = {
  title: string;
  sub: string;
  gradient: string;
};

export type CuratedProduct = ProductTeaser & {
  rating: number;
  reviews: number;
  badge: string | null;
};

export type ArticleTeaser = {
  tag: string;
  title: string;
  date: string;
  read: string;
  gradient: string;
  href: string;
};

export type FeaturedArticle = {
  date: string;
  read: string;
  title: string;
  mainGradient: string;
  sideGradient: string;
};

export type Banner = {
  title: string;
  href: string;
  linkLabel: string;
  gradient: string;
};

export type TrustItemIconKey = "chat" | "shipping" | "rewards" | "reviews";

export type TrustItem = {
  label: string;
  href: string;
  iconKey: TrustItemIconKey;
};
