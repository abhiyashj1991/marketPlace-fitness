export const CATEGORIES = [
  {
    key: "WHEY_PROTEIN",
    slug: "whey-protein",
    label: "Whey Protein",
    description: "Build lean muscle",
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80",
  },
  {
    key: "CREATINE",
    slug: "creatine",
    label: "Creatine",
    description: "Boost strength & power",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
  },
  {
    key: "FAT_BURNER",
    slug: "fat-burner",
    label: "Fat Burner",
    description: "Cut & shred",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  },
  {
    key: "MASS_GAINER",
    slug: "mass-gainer",
    label: "Mass Gainer",
    description: "Bulk up fast",
    image:
      "https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=600&q=80",
  },
  {
    key: "MULTIVITAMIN",
    slug: "multivitamin",
    label: "Multivitamin",
    description: "Daily essentials",
    image:
      "https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&q=80",
  },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export function categoryLabel(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

export function categorySlug(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.slug ?? key.toLowerCase();
}

export function categoryFromSlug(slug: string): string | null {
  return CATEGORIES.find((c) => c.slug === slug)?.key ?? null;
}
