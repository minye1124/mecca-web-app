import type {
  CategoryTeaser,
  CuratedProduct,
  FeaturedArticle,
  ArticleTeaser,
  Banner,
  ProductTeaser,
  TrustItem,
} from "./types";

export const needToKnowProducts: ProductTeaser[] = [
  {
    id: "korres-greek-yoghurt-probiotic-superdose-face-mask",
    brand: "Korres",
    name: "Greek Yoghurt Probiotic Superdose Face Mask",
    price: "$62.00",
    gradient: "linear-gradient(160deg, #e8eef0 0%, #c8d8dc 100%)",
  },
  {
    id: "phlur-vanilla-skin-body-oil",
    brand: "PHLUR",
    name: "Vanilla Skin Body Oil",
    price: "$98.00",
    gradient: "linear-gradient(160deg, #f5e8c0 0%, #e0c878 100%)",
  },
  {
    id: "too-faced-pillow-balm-hydrating-lip-treatment",
    brand: "Too Faced",
    name: "Pillow Balm Hydrating Lip Treatment",
    price: "$44.00",
    gradient: "linear-gradient(160deg, #fce0e8 0%, #f0b8c8 100%)",
  },
  {
    id: "tsu-lange-yor-by-your-side-eau-de-parfum",
    brand: "Tsu Lange Yor",
    name: "By Your Side Eau de Parfum",
    price: "$285.00",
    gradient: "linear-gradient(160deg, #e8e4f0 0%, #c8c0d8 100%)",
  },
  {
    id: "summer-fridays-lip-butter-balm-need-to-know",
    brand: "Summer Fridays",
    name: "Lip Butter Balm",
    price: "$41.00",
    gradient: "linear-gradient(160deg, #f8dce0 0%, #eeb8c0 100%)",
  },
];

export const categories: CategoryTeaser[] = [
  {
    title: "New Pillow Talk",
    sub: "The new shade everyone's after",
    gradient: "linear-gradient(160deg, #f2d8cc 0%, #d4a898 100%)",
  },
  {
    title: "Smooth Things Over",
    sub: "Glow Recipe's Korean facial in a swipe.",
    gradient: "linear-gradient(160deg, #f0d8e0 0%, #d8b0c0 100%)",
  },
  {
    title: "Glow in Every Drop",
    sub: "Supercharged serums and treatments.",
    gradient: "linear-gradient(160deg, #d4e8e8 0%, #a8c8c8 100%)",
  },
  {
    title: "Fara Homidi",
    sub: "Makeup from a visionary artist.",
    gradient: "linear-gradient(160deg, #d8e0f0 0%, #a8b8d8 100%)",
  },
];

export const curatedProducts: CuratedProduct[] = [
  {
    id: "summer-fridays-lip-butter-balm",
    brand: "Summer Fridays",
    name: "Lip Butter Balm",
    price: "$41.00",
    rating: 4.8,
    reviews: 3260,
    badge: null,
    gradient: "linear-gradient(160deg, #fce0e4 0%, #f0b8c0 100%)",
  },
  {
    id: "rhode-glazing-milk-ceramide-facial-essence",
    brand: "rhode",
    name: "Glazing Milk Ceramide Facial Essence",
    price: "$55.00",
    rating: 4.7,
    reviews: 280,
    badge: "TRENDING NOW",
    gradient: "linear-gradient(160deg, #e8e8ec 0%, #c8c8d4 100%)",
  },
  {
    id: "ilia-beauty-limitless-lash-mascara",
    brand: "ILIA Beauty",
    name: "Limitless Lash Mascara",
    price: "$50.00",
    rating: 4.6,
    reviews: 6863,
    badge: null,
    gradient: "linear-gradient(160deg, #1a1a1a 0%, #2e2e2e 100%)",
  },
  {
    id: "rhode-pocket-blush-buildable-hydrating-cream-blush",
    brand: "rhode",
    name: "Pocket Blush Buildable Hydrating Cream Blush",
    price: "$43.00",
    rating: 4.7,
    reviews: 267,
    badge: null,
    gradient: "linear-gradient(160deg, #c4785c 0%, #a05840 100%)",
  },
  {
    id: "rhode-peptide-lip-tint-nourishing-glaze",
    brand: "rhode",
    name: "Peptide Lip Tint Nourishing Glaze",
    price: "$35.00",
    rating: 4.8,
    reviews: 313,
    badge: "NEW SHADE",
    gradient: "linear-gradient(160deg, #f4d0d8 0%, #e0a8b8 100%)",
  },
];

export const articles: ArticleTeaser[] = [
  {
    tag: "MAKEUP",
    title: "Face Off: MECCA HQ Tries Every Single NARS Foundation",
    date: "February 27",
    read: "3 minute read",
    gradient: "linear-gradient(160deg, #e8d4c0 0%, #c8a888 100%)",
    href: "/articles/face-off-mecca-hq-tries-every-single-nars-foundation",
  },
  {
    tag: "NEW IN",
    title: "It's New. In March. At MECCA",
    date: "February 28",
    read: "6 minute read",
    gradient: "linear-gradient(160deg, #d8c0c0 0%, #c0a0a0 100%)",
    href: "/articles/its-new-in-march-at-mecca",
  },
  {
    tag: "SKINCARE",
    title: "MECCA HQ Tries Out Hailey Bieber's rhode",
    date: "February 12",
    read: "5 minute read",
    gradient: "linear-gradient(160deg, #e0d4c8 0%, #c4b0a0 100%)",
    href: "/articles/mecca-hq-tries-out-hailey-biebers-rhode",
  },
  {
    tag: "SKINCARE",
    title: "Got Milk? It's Skincare's Biggest Trend Right Now",
    date: "February 24",
    read: "4 minute read",
    gradient: "linear-gradient(160deg, #f0e8d8 0%, #d8c8b0 100%)",
    href: "/articles/got-milk-its-skincares-biggest-trend-right-now",
  },
  {
    tag: "WELLNESS",
    title: "How to Get the Best Sleep of Your Life",
    date: "March 2",
    read: "4 minute read",
    gradient: "linear-gradient(160deg, #d4dce8 0%, #b0bcd0 100%)",
    href: "/articles/how-to-get-the-best-sleep-of-your-life",
  },
];

export const featuredArticle: FeaturedArticle = {
  date: "March 31",
  read: "4 minute read",
  title: "Get to Know the Icons: Meet MECCA's Most-Loved Fragrances",
  mainGradient: "linear-gradient(160deg, #6b2020 0%, #4a1818 60%, #2e1010 100%)",
  sideGradient: "linear-gradient(160deg, #f0e8e0 0%, #d8c8b8 100%)",
};

export const banners: Banner[] = [
  {
    title: "Explore MECCAVERSITY",
    href: "/meccaversity",
    linkLabel: "Take me there",
    gradient: "linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 100%)",
  },
  {
    title: "The best beauty experiences",
    href: "/services",
    linkLabel: "Explore MECCA's services and events",
    gradient: "linear-gradient(160deg, #c8a888 0%, #a88868 100%)",
  },
];

export const trustItems: TrustItem[] = [
  {
    label: "Chat live with our team",
    href: "/contact",
    iconKey: "chat",
  },
  {
    label: "Free shipping & returns*",
    href: "/shipping",
    iconKey: "shipping",
  },
  {
    label: "Beauty Loop rewards",
    href: "/beauty-loop",
    iconKey: "rewards",
  },
  {
    label: "250,000+ reviews",
    href: "/reviews",
    iconKey: "reviews",
  },
];