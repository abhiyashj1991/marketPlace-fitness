"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

export type ProductFormInitial = {
  id?: string;
  name: string;
  slug?: string;
  brandName: string;
  category: string;
  priceMrp: number;
  priceSale: number;
  stock: number;
  description: string;
  imageUrl: string | null;
  isBestseller: boolean;
  isSellingFast: boolean;
  rating: number;
  reviewCount: number;
  proteinPerServing: string | null;
  servingsPerContainer: number | null;
  dosePerServing: string | null;
  capsules: number | null;
  tablets: number | null;
  caloriesPerServing: number | null;
};

type Props = {
  initial?: ProductFormInitial;
  brandSuggestions: string[];
};

export function ProductForm({ initial, brandSuggestions }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [brandName, setBrandName] = useState(initial?.brandName ?? "");
  const [category, setCategory] = useState(
    initial?.category ?? CATEGORIES[0].key
  );
  const [priceMrp, setPriceMrp] = useState(String(initial?.priceMrp ?? ""));
  const [priceSale, setPriceSale] = useState(String(initial?.priceSale ?? ""));
  const [stock, setStock] = useState(String(initial?.stock ?? "0"));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [isBestseller, setIsBestseller] = useState(initial?.isBestseller ?? false);
  const [isSellingFast, setIsSellingFast] = useState(
    initial?.isSellingFast ?? false
  );
  const [rating, setRating] = useState(String(initial?.rating ?? ""));
  const [reviewCount, setReviewCount] = useState(
    String(initial?.reviewCount ?? "")
  );
  const [proteinPerServing, setProteinPerServing] = useState(
    initial?.proteinPerServing ?? ""
  );
  const [servingsPerContainer, setServingsPerContainer] = useState(
    String(initial?.servingsPerContainer ?? "")
  );
  const [dosePerServing, setDosePerServing] = useState(
    initial?.dosePerServing ?? ""
  );
  const [capsules, setCapsules] = useState(String(initial?.capsules ?? ""));
  const [tablets, setTablets] = useState(String(initial?.tablets ?? ""));
  const [caloriesPerServing, setCaloriesPerServing] = useState(
    String(initial?.caloriesPerServing ?? "")
  );

  function intOrUndefined(v: string): number | undefined {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? undefined : n;
  }

  function submit() {
    setError(null);
    const body: Record<string, unknown> = {
      name,
      brandName,
      category,
      priceMrp: parseInt(priceMrp, 10),
      priceSale: parseInt(priceSale, 10),
      stock: parseInt(stock, 10) || 0,
      description,
      imageUrl: imageUrl || undefined,
      isBestseller,
      isSellingFast,
    };
    if (slug) body.slug = slug;
    if (rating) body.rating = parseFloat(rating);
    if (reviewCount) body.reviewCount = parseInt(reviewCount, 10);
    if (proteinPerServing) body.proteinPerServing = proteinPerServing;
    if (servingsPerContainer) body.servingsPerContainer = intOrUndefined(servingsPerContainer);
    if (dosePerServing) body.dosePerServing = dosePerServing;
    if (capsules) body.capsules = intOrUndefined(capsules);
    if (tablets) body.tablets = intOrUndefined(tablets);
    if (caloriesPerServing) body.caloriesPerServing = intOrUndefined(caloriesPerServing);

    startTransition(async () => {
      try {
        const url = isEdit
          ? `/api/admin/products/${initial!.id}`
          : "/api/admin/products";
        const res = await fetch(url, {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Save failed");
          return;
        }
        router.push("/admin/products");
        router.refresh();
      } catch {
        setError("Network error");
      }
    });
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-6 space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Name *" value={name} onChange={setName} />
        <Field
          label="Slug (auto-generated if blank)"
          value={slug}
          onChange={setSlug}
          placeholder="muscleblaze-whey-1kg-chocolate"
          mono
        />
        <div>
          <Label>Brand *</Label>
          <input
            list="brand-suggestions"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="MuscleBlaze, Optimum Nutrition..."
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <datalist id="brand-suggestions">
            {brandSuggestions.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
          <p className="text-xs text-muted-foreground mt-1">
            Pick existing or type a new brand name (will be created automatically)
          </p>
        </div>
        <div>
          <Label>Category *</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <Field
          label="MRP (₹) *"
          value={priceMrp}
          onChange={setPriceMrp}
          type="number"
        />
        <Field
          label="Sale Price (₹) *"
          value={priceSale}
          onChange={setPriceSale}
          type="number"
        />
        <Field label="Stock" value={stock} onChange={setStock} type="number" />
        <Field
          label="Image URL (auto-generated placeholder if blank)"
          value={imageUrl}
          onChange={setImageUrl}
          placeholder="https://..."
        />
      </div>

      <div>
        <Label>Description *</Label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isBestseller}
            onChange={(e) => setIsBestseller(e.target.checked)}
            className="w-4 h-4 accent-emerald-600"
          />
          Bestseller
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isSellingFast}
            onChange={(e) => setIsSellingFast(e.target.checked)}
            className="w-4 h-4 accent-emerald-600"
          />
          Selling Fast
        </label>
      </div>

      <details className="border-t border-border pt-4">
        <summary className="cursor-pointer text-sm font-semibold text-foreground">
          Optional: ratings &amp; specs
        </summary>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field
            label="Rating (0–5)"
            value={rating}
            onChange={setRating}
            type="number"
            placeholder="4.3"
          />
          <Field
            label="Review Count"
            value={reviewCount}
            onChange={setReviewCount}
            type="number"
          />
          <Field
            label="Protein per serving (e.g. 25g)"
            value={proteinPerServing}
            onChange={setProteinPerServing}
          />
          <Field
            label="Servings per container"
            value={servingsPerContainer}
            onChange={setServingsPerContainer}
            type="number"
          />
          <Field
            label="Dose per serving (e.g. 5g)"
            value={dosePerServing}
            onChange={setDosePerServing}
          />
          <Field
            label="Calories per serving"
            value={caloriesPerServing}
            onChange={setCaloriesPerServing}
            type="number"
          />
          <Field
            label="Capsules"
            value={capsules}
            onChange={setCapsules}
            type="number"
          />
          <Field
            label="Tablets"
            value={tablets}
            onChange={setTablets}
            type="number"
          />
        </div>
      </details>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="flex gap-3 pt-4 border-t border-border">
        <button
          onClick={submit}
          disabled={isPending}
          className={cn(
            "bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg",
            isPending && "opacity-70"
          )}
        >
          {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
        </button>
        <button
          onClick={() => router.push("/admin/products")}
          className="text-sm text-muted-foreground hover:text-foreground px-4"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-foreground mb-1">
      {children}
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500",
          mono && "font-mono"
        )}
      />
    </div>
  );
}
