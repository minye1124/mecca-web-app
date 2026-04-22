import type { PaymentPageContent } from "./types";

export const paymentPageContent: PaymentPageContent = {
  title: "Checkout",
  orderSummary: {
    title: "Order Summary",
    items: [
      {
        id: "line-dr-jart-mask-pack",
        productId: "dr-jart-hydrating-and-soothing-mask-pack",
        brand: "Dr. Jart+",
        name: "Hydrating And Soothing Mask Pack",
        sku: "I-077310",
        quantity: 1,
        lineTotal: {
          amount: 48,
          currency: "AUD",
        },
        image: {
          src: "/images/products/dr-jart-mask-pack.jpg",
          alt: "Dr. Jart+ Hydrating And Soothing Mask Pack",
        },
      },
    ],
    pricingLines: [
      {
        id: "subtotal",
        label: "Subtotal (GST incl.)",
        money: {
          amount: 48,
          currency: "AUD",
        },
      },
      {
        id: "standard-shipping",
        label: "Standard Shipping",
        money: {
          amount: 5,
          currency: "AUD",
        },
      },
      {
        id: "discount",
        label: "Discount",
        money: {
          amount: -5,
          currency: "AUD",
        },
        tone: "muted",
      },
      {
        id: "gst",
        label: "GST",
        money: {
          amount: 4.36,
          currency: "AUD",
        },
      },
      {
        id: "total",
        label: "Total",
        money: {
          amount: 48,
          currency: "AUD",
        },
        tone: "total",
      },
    ],
    beautyLoopPreview: {
      title: "Beauty Loop",
      points: 48,
      description: "Points are awarded after the order is confirmed.",
    },
  },
};
