/**
 * Price tier buckets shown as checkboxes in the product filter sidebar.
 * Multi-select: selecting Premium AND Mid means "show products in either tier".
 * Composes with the manual min/max price inputs via AND.
 */
export const PRICE_TIERS = [
  {
    key: "LOW",
    label: "Low Range",
    description: "Under ₹1,000",
    min: 0,
    max: 999,
  },
  {
    key: "MID",
    label: "Mid Range",
    description: "₹1,000 – ₹1,999",
    min: 1000,
    max: 1999,
  },
  {
    key: "HIGH",
    label: "High Range",
    description: "₹2,000 – ₹3,499",
    min: 2000,
    max: 3499,
  },
  {
    key: "PREMIUM",
    label: "Premium",
    description: "₹3,500 & above",
    min: 3500,
    // Open-ended upper bound — encoded as a sentinel the query builder treats as no upper limit.
    max: Number.MAX_SAFE_INTEGER,
  },
] as const;

export type PriceTierKey = (typeof PRICE_TIERS)[number]["key"];

export function priceTierLabel(key: string): string {
  return PRICE_TIERS.find((t) => t.key === key)?.label ?? key;
}

export function priceTierForAmount(amount: number): PriceTierKey {
  for (const t of PRICE_TIERS) {
    if (amount >= t.min && amount <= t.max) return t.key;
  }
  return "PREMIUM";
}
