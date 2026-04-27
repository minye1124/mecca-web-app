import type { HomePageContent } from "./types";

export const homePageContent: HomePageContent = {
  hero: {
    eyebrow: "New perfume",
    headline: "The Future of Fragrance",
    description: "Description",
    primaryCta: {
      label: "Shop",
      href: "/shop",
    },
  },

  featuredProducts: {
    eyebrow: "File Under:",
    title: "Need to Know",
    description: "The beauty products we tell all our friends about.",
    cta: {
      label: "Shop now",
      href: "/shop",
    },
    products: [
      {
        id: "korres-greek-yoghurt-probiotic-superdose-face-mask",
        brand: "Korres",
        name: "Greek Yoghurt Probiotic Superdose Face Mask",
        price: {
          amountInCents: 6200,
          currency: "AUD",
        },
        media: {
          kind: "gradient",
          value: "linear-gradient(160deg, #e8eef0 0%, #c8d8dc 100%)",
        },
      },
      {
        id: "phlur-vanilla-skin-body-oil",
        brand: "PHLUR",
        name: "Vanilla Skin Body Oil",
        price: {
          amountInCents: 9800,
          currency: "AUD",
        },
        media: {
          kind: "gradient",
          value: "linear-gradient(160deg, #f5e8c0 0%, #e0c878 100%)",
        },
      },
    ],
  },

  categories: {
    title: "Shop by Category",
    items: [
      {
        id: "new-pillow-talk",
        title: "New Pillow Talk",
        subtitle: "The new shade everyone's after",
        href: "/shop",
        media: {
          kind: "gradient",
          value: "linear-gradient(160deg, #f2d8cc 0%, #d4a898 100%)",
        },
      },
    ],
  },

  recommendedProducts: {
    title: "Curated for you",
    products: [
      {
        id: "summer-fridays-lip-butter-balm",
        brand: "Summer Fridays",
        name: "Lip Butter Balm",
        price: {
          amountInCents: 4100,
          currency: "AUD",
        },
        socialProof: {
          rating: 4.8,
          reviewCount: 3260,
        },
        media: {
          kind: "gradient",
          value: "linear-gradient(160deg, #fce0e4 0%, #f0b8c0 100%)",
        },
      },
      {
        id: "rhode-glazing-milk-ceramide-facial-essence",
        brand: "rhode",
        name: "Glazing Milk Ceramide Facial Essence",
        price: {
          amountInCents: 5500,
          currency: "AUD",
        },
        socialProof: {
          rating: 4.7,
          reviewCount: 280,
        },
        badge: {
          label: "TRENDING NOW",
        },
        media: {
          kind: "gradient",
          value: "linear-gradient(160deg, #e8e8ec 0%, #c8c8d4 100%)",
        },
      },
    ],
  },

  discovery: {
    title: "MECCA Memo",
    featured: {
      id: "mecca-most-loved-fragrances",
      title: "Get to Know the Icons: Meet MECCA's Most-Loved Fragrances",
      publishedAt: "2026-03-31",
      readTimeMinutes: 4,
      href: "/articles/mecca-most-loved-fragrances",
      primaryMedia: {
        kind: "gradient",
        value: "linear-gradient(160deg, #6b2020 0%, #4a1818 60%, #2e1010 100%)",
      },
      secondaryMedia: {
        kind: "gradient",
        value: "linear-gradient(160deg, #f0e8e0 0%, #d8c8b8 100%)",
      },
    },
    articles: [
      {
        id: "face-off-mecca-hq-tries-every-single-nars-foundation",
        tag: "MAKEUP",
        title: "Face Off: MECCA HQ Tries Every Single NARS Foundation",
        publishedAt: "2026-02-27",
        readTimeMinutes: 3,
        href: "/articles/face-off-mecca-hq-tries-every-single-nars-foundation",
        media: {
          kind: "gradient",
          value: "linear-gradient(160deg, #e8d4c0 0%, #c8a888 100%)",
        },
      },
    ],
    promos: [
      {
        id: "explore-meccaversity",
        title: "Explore MECCAVERSITY",
        cta: {
          label: "Take me there",
          href: "/meccaversity",
        },
        media: {
          kind: "gradient",
          value: "linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 100%)",
        },
      },
    ],
  },

  services: {
    title: "From us to you",
    items: [
      {
        id: "chat-live",
        label: "Chat live with our team",
        href: "/contact",
        iconKey: "chat",
      },
    ],
  },
};