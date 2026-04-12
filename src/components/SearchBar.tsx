"use client";

import { useState, useTransition, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "header" | "inline";
};

/**
 * Reads the current `?q=` from window.location on mount (avoids useSearchParams
 * which would force every page using this component into dynamic rendering).
 */
export function SearchBar({ className, variant = "header" }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQ(initial);
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    const next = new URLSearchParams();
    if (trimmed) next.set("q", trimmed);
    startTransition(() => {
      router.push(`/products${next.size ? `?${next.toString()}` : ""}`);
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "relative flex items-center w-full",
        variant === "header" && "max-w-xl",
        className
      )}
    >
      <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search whey, creatine, brands..."
        className="w-full pl-9 pr-20 py-2 text-sm bg-slate-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
      />
      <button
        type="submit"
        disabled={isPending}
        className="absolute right-1 px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Search"}
      </button>
    </form>
  );
}
