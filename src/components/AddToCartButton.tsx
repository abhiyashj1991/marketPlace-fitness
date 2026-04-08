"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    priceSale: number;
    stock: number;
    brandName: string;
  };
};

export function AddToCartButton({ product }: Props) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brandName: product.brandName,
      priceSale: product.priceSale,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      disabled={outOfStock}
      className={cn(
        "inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-lg font-semibold text-white transition-colors shadow-sm",
        outOfStock
          ? "bg-slate-300 cursor-not-allowed"
          : added
            ? "bg-emerald-700"
            : "bg-emerald-600 hover:bg-emerald-700"
      )}
    >
      {added ? (
        <>
          <Check className="w-4 h-4" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          {outOfStock ? "Sold Out" : "Add to Cart"}
        </>
      )}
    </button>
  );
}
