import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriceINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function discountPercent(mrp: number, sale: number): number {
  if (mrp <= 0 || sale >= mrp) return 0;
  return Math.round(((mrp - sale) / mrp) * 100);
}
