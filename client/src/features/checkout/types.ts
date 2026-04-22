import type { Money } from "../../types/money";

export type OrderItemImage = {
  src: string;
  alt: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  brand: string;
  name: string;
  variant?: string;
  sku?: string;
  quantity: number;
  lineTotal: Money;
  image?: OrderItemImage;
};

export type PricingLineTone = "default" | "muted" | "total";

export type PricingLine = {
  id: string;
  label: string;
  money?: Money;
  displayValue?: string;
  tone?: PricingLineTone;
};

export type BeautyLoopPointsPreview = {
  title: string;
  points?: number;
  description: string;
};

export type OrderSummaryContent = {
  title: string;
  items: OrderItem[];
  pricingLines: PricingLine[];
  beautyLoopPreview?: BeautyLoopPointsPreview;
};

export type PaymentPageContent = {
  title: string;
  orderSummary: OrderSummaryContent;
};
