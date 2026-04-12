"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/categories";
import { PRICE_TIERS } from "@/lib/price-tiers";

type Props = {
  brands: string[];
  /** Show the 5-category filter section. Disable on /products/category/[slug] */
  showCategoryFilter?: boolean;
};

export function ProductFilters({ brands, showCategoryFilter = false }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    params.get("category")?.split(",").filter(Boolean) ?? []
  );
  const [selectedTiers, setSelectedTiers] = useState<string[]>(
    params.get("priceTier")?.split(",").filter(Boolean) ?? []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    params.get("brand")?.split(",").filter(Boolean) ?? []
  );
  const [minPrice, setMinPrice] = useState(params.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") ?? "");
  const [rating, setRating] = useState(params.get("rating") ?? "");
  const [bestseller, setBestseller] = useState(
    params.get("bestseller") === "1"
  );
  const [sellingFast, setSellingFast] = useState(
    params.get("sellingFast") === "1"
  );

  function toggleCategory(key: string) {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  }

  function toggleTier(key: string) {
    setSelectedTiers((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  }

  function toggleBrand(name: string) {
    setSelectedBrands((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]
    );
  }

  function apply() {
    const next = new URLSearchParams();
    const sort = params.get("sort");
    if (sort) next.set("sort", sort);
    if (showCategoryFilter && selectedCategories.length) {
      next.set("category", selectedCategories.join(","));
    }
    if (selectedTiers.length) next.set("priceTier", selectedTiers.join(","));
    if (selectedBrands.length) next.set("brand", selectedBrands.join(","));
    if (minPrice) next.set("minPrice", minPrice);
    if (maxPrice) next.set("maxPrice", maxPrice);
    if (rating) next.set("rating", rating);
    if (bestseller) next.set("bestseller", "1");
    if (sellingFast) next.set("sellingFast", "1");
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`);
    });
  }

  function reset() {
    setSelectedCategories([]);
    setSelectedTiers([]);
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setBestseller(false);
    setSellingFast(false);
    startTransition(() => {
      router.push(pathname);
    });
  }

  const hasActive =
    selectedCategories.length > 0 ||
    selectedTiers.length > 0 ||
    selectedBrands.length > 0 ||
    minPrice ||
    maxPrice ||
    rating ||
    bestseller ||
    sellingFast;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-foreground">Filters</h2>
        {hasActive && (
          <button
            onClick={reset}
            className="text-xs text-emerald-700 font-semibold hover:text-emerald-800 inline-flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Category */}
      {showCategoryFilter && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Category
          </h3>
          <div className="space-y-2">
            {CATEGORIES.map((c) => (
              <label
                key={c.key}
                className="flex items-center gap-2 text-sm text-foreground cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(c.key)}
                  onChange={() => toggleCategory(c.key)}
                  className="w-4 h-4 accent-emerald-600"
                />
                {c.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Range (price tier) */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Range</h3>
        <div className="space-y-2">
          {PRICE_TIERS.map((t) => (
            <label
              key={t.key}
              className="flex items-start gap-2 text-sm text-foreground cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedTiers.includes(t.key)}
                onChange={() => toggleTier(t.key)}
                className="w-4 h-4 accent-emerald-600 mt-0.5"
              />
              <div className="leading-tight">
                <div>{t.label}</div>
                <div className="text-xs text-muted-foreground">
                  {t.description}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Quick toggles */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Quick Filters
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={bestseller}
              onChange={(e) => setBestseller(e.target.checked)}
              className="w-4 h-4 accent-emerald-600"
            />
            Bestsellers only
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={sellingFast}
              onChange={(e) => setSellingFast(e.target.checked)}
              className="w-4 h-4 accent-emerald-600"
            />
            Selling fast
          </label>
        </div>
      </div>

      {/* Custom price */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Custom Price (₹)
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Brand</h3>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {brands.map((b) => (
            <label
              key={b}
              className="flex items-center gap-2 text-sm text-foreground cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(b)}
                onChange={() => toggleBrand(b)}
                className="w-4 h-4 accent-emerald-600"
              />
              {b}
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Rating</h3>
        <div className="space-y-2">
          {[
            { value: "4", label: "4+ stars" },
            { value: "3", label: "3+ stars" },
            { value: "", label: "All ratings" },
          ].map((r) => (
            <label
              key={r.value}
              className="flex items-center gap-2 text-sm text-foreground cursor-pointer"
            >
              <input
                type="radio"
                name="rating"
                checked={rating === r.value}
                onChange={() => setRating(r.value)}
                className="w-4 h-4 accent-emerald-600"
              />
              {r.value && (
                <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              )}
              {r.label}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={apply}
        disabled={isPending}
        className={cn(
          "w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors",
          isPending && "opacity-70"
        )}
      >
        {isPending ? "Applying…" : "Apply Filters"}
      </button>
    </div>
  );
}
