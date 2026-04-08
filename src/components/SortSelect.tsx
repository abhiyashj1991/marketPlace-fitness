"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("sort") ?? "popularity";

  function onChange(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "popularity") {
      next.delete("sort");
    } else {
      next.set("sort", value);
    }
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-muted-foreground">Sort by:</label>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm border border-border rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
