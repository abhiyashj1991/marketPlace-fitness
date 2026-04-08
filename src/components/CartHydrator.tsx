"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

/**
 * Hydrates the persisted cart on the client. Required because cart-store
 * uses `skipHydration: true` to avoid SSR/hydration mismatches.
 */
export function CartHydrator() {
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);
  return null;
}
