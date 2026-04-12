"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductFilters } from "@/components/ProductFilters";

type Props = {
  brands: string[];
  showCategoryFilter?: boolean;
};

export function MobileFilterDrawer({ brands, showCategoryFilter }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-1.5 text-sm font-semibold hover:bg-emerald-50 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-80 max-w-[90vw] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="font-bold">Filters</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close filters"
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <ProductFilters
                brands={brands}
                showCategoryFilter={showCategoryFilter}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
