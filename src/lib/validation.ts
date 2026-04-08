import { z } from "zod";

// Indian mobile: 10 digits, starts with 6-9 (allow optional +91 / 91 / 0 prefix
// stripped on the client before validation).
export const indianMobileRegex = /^[6-9]\d{9}$/;

// Indian PIN code: exactly 6 digits, first digit 1-9.
export const indianPincodeRegex = /^[1-9]\d{5}$/;

export const phoneSchema = z
  .string()
  .trim()
  .regex(indianMobileRegex, "Enter a valid 10-digit Indian mobile number");

export const pincodeSchema = z
  .string()
  .trim()
  .regex(indianPincodeRegex, "Enter a valid 6-digit Indian PIN code");

export function isValidPhone(value: string): boolean {
  return indianMobileRegex.test(value.trim());
}

export function isValidPincode(value: string): boolean {
  return indianPincodeRegex.test(value.trim());
}

// Defensive caps to prevent abuse via the order API.
export const ORDER_MAX_ITEMS = 50;
export const ORDER_MAX_QTY_PER_ITEM = 100;
