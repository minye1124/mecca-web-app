import type { Money } from "../../../types/money";
import type { CheckoutPricingSummary, CheckoutSummaryResponse, OrderItem } from "../types";

const CURRENCY: Money["currency"] = "AUD";
const STANDARD_SHIPPING_IN_CENTS = 500;
const DEFAULT_DISCOUNT_IN_CENTS = -500;

function toMoney(amountInCents: number): Money {
  return {
    amountInCents,
    currency: CURRENCY,
  };
}

function buildPricingSummary(items: OrderItem[]): CheckoutPricingSummary {
  const visibleItems = items.filter((item) => item.quantity > 0);
  const subtotalInCents = visibleItems.reduce((sum, item) => {
    return sum + item.lineTotal.amountInCents;
  }, 0);
  const shippingInCents = visibleItems.length > 0 ? STANDARD_SHIPPING_IN_CENTS : 0;
  const discountInCents = visibleItems.length > 0 ? DEFAULT_DISCOUNT_IN_CENTS : 0;
  const gstInCents = Math.round(subtotalInCents / 11);
  const totalInCents = subtotalInCents + shippingInCents + discountInCents;

  return {
    subtotal: toMoney(subtotalInCents),
    shipping: toMoney(shippingInCents),
    discount: toMoney(discountInCents),
    gst: toMoney(gstInCents),
    total: toMoney(totalInCents),
  };
}

function buildBeautyLoopPreview(pointsBaseInCents: number, existingPreview?: CheckoutSummaryResponse["beautyLoopPreview"]) {
  if (!existingPreview) {
    return undefined;
  }

  return {
    ...existingPreview,
    points: Math.round(pointsBaseInCents / 100),
  };
}

let mockCheckoutSummary: CheckoutSummaryResponse = {
    title: "Order Summary",
    items: [
        {
            id: "line-dr-jart-mask-pack",
            productId: "dr-jart-hydrating-and-soothing-mask-pack",
            brand: "Dr. Jart+",
            name: "Hydrating And Soothing Mask Pack",
            sku: "I-077310",
            quantity: 1,
            unitPrice: {
                amountInCents: 4800,
                currency: "AUD",
            },
            lineTotal: {
                amountInCents: 4800,
                currency: "AUD",
            },
            image: {
                src: "/images/products/dr-jart-mask-pack.jpg",
                alt: "Dr. Jart+ Hydrating And Soothing Mask Pack",
            },
        },
    ],
    pricing: {
        subtotal: {
            amountInCents: 4800,
            currency: "AUD",
        },
        shipping: {
            amountInCents: 500,
            currency: "AUD",
        },
        discount: {
            amountInCents: -500,
            currency: "AUD",
        },
        gst: {
            amountInCents: 436,
            currency: "AUD",
        },
        total: {
            amountInCents: 4800,
            currency: "AUD",
        },
    },
    beautyLoopPreview: {
        title: "Beauty Loop",
        points: 48,
        description: "Points are awarded after the order is confirmed.",
    },
};

export async function getCheckoutSummary(): Promise<CheckoutSummaryResponse> {
    return mockCheckoutSummary;
}

export async function updateCheckoutItemQuantity( itemId: string, quantity: number ): Promise<CheckoutSummaryResponse> {
    if (quantity < 0) {
        throw new Error("Quantity cannot be negative.");
    }

    const targetItem = mockCheckoutSummary.items.find((item) => item.id === itemId);

    if (!targetItem) {
        throw new Error("Order item not found.");
    }

    const updatedItems =
        quantity === 0
            ? mockCheckoutSummary.items.filter((item) => item.id !== itemId)
            : mockCheckoutSummary.items.map((item) =>
                item.id === itemId
                    ? {
                        ...item,
                        quantity,
                        lineTotal: {
                            amountInCents: item.unitPrice.amountInCents * quantity,
                            currency: item.unitPrice.currency,
                        },
                    }
                    : item
            );

    const updatedPricing = buildPricingSummary(updatedItems);

    mockCheckoutSummary = {
        ...mockCheckoutSummary,
        items: updatedItems,
        pricing: updatedPricing,
        beautyLoopPreview: buildBeautyLoopPreview(
            updatedPricing.subtotal.amountInCents,
            mockCheckoutSummary.beautyLoopPreview
        ),
    };

    return mockCheckoutSummary;
}


