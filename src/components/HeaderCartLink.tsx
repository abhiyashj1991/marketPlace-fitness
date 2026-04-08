"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart, cartCount } from "@/lib/cart-store";

export function HeaderCartLink() {
  const items = useCart((s) => s.items);
  const count = cartCount(items);

  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className="relative p-2 hover:bg-emerald-50 rounded-lg transition-colors"
    >
      <ShoppingCart className="w-5 h-5 text-foreground" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
