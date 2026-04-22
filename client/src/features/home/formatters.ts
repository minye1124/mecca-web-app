import type { Money } from "./types";

export function formatMoney(money: Money) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: money.currency,
    minimumFractionDigits: 2,
  }).format(money.amount);
}

export function formatPublishedDate(publishedAt: string) {
  return new Intl.DateTimeFormat("en-AU", {
    month: "long",
    day: "numeric",
  }).format(new Date(publishedAt));
}

export function formatReadTime(readTimeMinutes: number) {
  return `${readTimeMinutes} minute read`;
}
