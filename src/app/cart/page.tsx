"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, cartSubtotal } from "@/lib/cart-store";
import { formatPriceINR } from "@/lib/utils";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = cartSubtotal(items);

  // Skeleton until the persisted store is hydrated on the client. Avoids
  // flashing "Your cart is empty" for users who actually have items.
  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-9 w-40 bg-slate-200 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="bg-white border border-border rounded-xl p-4 flex gap-4"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <aside className="lg:col-span-4">
            <div className="bg-white border border-border rounded-2xl p-6 h-64 animate-pulse" />
          </aside>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">
          Add some products to get started.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg"
        >
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white border border-border rounded-xl p-4 flex gap-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-50 to-emerald-200 rounded-lg flex items-center justify-center text-emerald-700/40 text-2xl font-black flex-shrink-0">
                {item.brandName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">
                  {item.brandName}
                </div>
                <Link
                  href={`/products/${item.slug}`}
                  className="font-semibold text-foreground hover:text-emerald-700 line-clamp-2"
                >
                  {item.name}
                </Link>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="px-2 py-1 hover:bg-slate-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.stock}
                      className="px-2 py-1 hover:bg-slate-50 disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="font-bold text-foreground">
                    {formatPriceINR(item.priceSale * item.quantity)}
                  </div>
                </div>
                {item.quantity >= item.stock && (
                  <div className="text-xs text-amber-600 mt-1">
                    Max stock reached ({item.stock} available)
                  </div>
                )}
              </div>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-muted-foreground hover:text-destructive p-1 self-start"
                aria-label="Remove from cart"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <aside className="lg:col-span-4">
          <div className="bg-white border border-border rounded-2xl p-6 sticky top-24">
            <h2 className="font-bold text-foreground text-lg mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-semibold">
                  {formatPriceINR(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className="text-emerald-700 font-semibold">FREE</span>
              </div>
            </div>
            <div className="border-t border-border my-4" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPriceINR(subtotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Trainer discount can be applied at checkout.
            </p>
            <Link
              href="/checkout"
              className="block text-center w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
