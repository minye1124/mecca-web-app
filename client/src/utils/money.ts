import type { Money } from "../types/money";

export function formatMoney(money: Money, locale = "en-AU") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency,
    minimumFractionDigits: 2,
  }).format(money.amount);
}
