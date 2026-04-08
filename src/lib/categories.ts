export const CATEGORIES = [
  {
    key: "WHEY_PROTEIN",
    slug: "whey-protein",
    label: "Whey Protein",
    description: "Build lean muscle",
    color: "059669", // emerald
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80",
  },
  {
    key: "CREATINE",
    slug: "creatine",
    label: "Creatine",
    description: "Boost strength & power",
    color: "2563eb", // blue
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
  },
  {
    key: "FAT_BURNER",
    slug: "fat-burner",
    label: "Fat Burner",
    description: "Cut & shred",
    color: "dc2626", // red
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  },
  {
    key: "MASS_GAINER",
    slug: "mass-gainer",
    label: "Mass Gainer",
    description: "Bulk up fast",
    color: "ea580c", // orange
    image:
      "https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=600&q=80",
  },
  {
    key: "MULTIVITAMIN",
    slug: "multivitamin",
    label: "Multivitamin",
    description: "Daily essentials",
    color: "9333ea", // purple
    image:
      "https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&q=80",
  },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export function categoryLabel(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

export function categorySlug(key: string): string {
  return CATEGORIES.find((c) => c.slug === key)?.slug ?? key.toLowerCase();
}

export function categoryFromSlug(slug: string): string | null {
  return CATEGORIES.find((c) => c.slug === slug)?.key ?? null;
}

export function categoryColor(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.color ?? "059669";
}

/**
 * Generate a placeholder image URL for a product. Uses placehold.co
 * (returns a colored PNG with the product name as text, no redirects).
 */
export function productImageUrl(
  categoryKey: string,
  productName: string
): string {
  const color = categoryColor(categoryKey);
  // Trim long names so the text fits the 600x600 placeholder.
  const text = productName.length > 30 ? productName.slice(0, 28) + "…" : productName;
  return `https://placehold.co/600x600/${color}/FFFFFF.png?text=${encodeURIComponent(
    text
  )}`;
}
