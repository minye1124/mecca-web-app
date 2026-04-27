import type { CheckoutPricingSummary, PricingLine } from "../types";

export function buildPricingLines(pricing: CheckoutPricingSummary): PricingLine[] {
    return [
        {
            id: "subtotal",
            label: "Subtotal (GST incl.)",
            money: pricing.subtotal,
        },
        {
            id: "standard-shipping",
            label: "Standard Shipping",
            money: pricing.shipping,
        },
        {
            id: "discount",
            label: "Discount",
            money: pricing.discount,
            tone: "muted",
        },
        {
            id: "gst",
            label: "GST",
            money: pricing.gst,
        },
        {
            id: "total",
            label: "Total",
            money: pricing.total,
            tone: "total",
        },
    ]
}