"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MapPin } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { SearchBar } from "@/components/SearchBar";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="md:hidden p-2 hover:bg-emerald-50 rounded-lg"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="font-bold text-emerald-700">Marketplace Fitness</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-3 border-b border-border">
              <SearchBar variant="inline" />
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-3">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-emerald-50 text-foreground font-medium"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-emerald-50 text-foreground font-medium"
              >
                All Products
              </Link>
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-emerald-50 text-foreground font-medium"
              >
                About Us
              </Link>

              <div className="mt-4 px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
                Categories
              </div>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products/category/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-emerald-50 text-foreground text-sm"
                >
                  {c.label}
                </Link>
              ))}
            </nav>

            <div className="px-4 py-3 border-t border-border bg-emerald-50 text-xs text-emerald-900 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              Delivering in <strong>Indore</strong>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
