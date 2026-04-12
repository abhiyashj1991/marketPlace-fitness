import type { Prisma } from "@/generated/prisma/client";
import { PRICE_TIERS } from "@/lib/price-tiers";

export type ProductSearchParams = {
  q?: string; // free-text search across product name + brand name
  category?: string; // comma-separated category keys
  brand?: string;
  priceTier?: string; // comma-separated price tier keys
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  bestseller?: string;
  sellingFast?: string;
  sort?: string;
};

export function buildProductWhere(
  params: ProductSearchParams,
  fixedCategoryKey?: string
): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};
  const andClauses: Prisma.ProductWhereInput[] = [];

  if (fixedCategoryKey) {
    where.category = fixedCategoryKey;
  } else if (params.category) {
    const cats = params.category.split(",").filter(Boolean);
    if (cats.length === 1) {
      where.category = cats[0];
    } else if (cats.length > 1) {
      where.category = { in: cats };
    }
  }

  if (params.brand) {
    const brandNames = params.brand.split(",").filter(Boolean);
    if (brandNames.length > 0) {
      where.brand = { name: { in: brandNames } };
    }
  }

  // Price tier: each selected tier becomes one OR'd priceSale range
  if (params.priceTier) {
    const tierKeys = params.priceTier.split(",").filter(Boolean);
    const tiers = tierKeys
      .map((k) => PRICE_TIERS.find((t) => t.key === k))
      .filter((t): t is (typeof PRICE_TIERS)[number] => Boolean(t));

    if (tiers.length > 0) {
      andClauses.push({
        OR: tiers.map((t) => ({
          priceSale:
            t.max >= Number.MAX_SAFE_INTEGER
              ? { gte: t.min }
              : { gte: t.min, lte: t.max },
        })),
      });
    }
  }

  // Free-text search: matches product name OR brand name (case-insensitive)
  if (params.q) {
    const q = params.q.trim();
    if (q) {
      andClauses.push({
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { brand: { name: { contains: q, mode: "insensitive" } } },
        ],
      });
    }
  }

  if (params.minPrice || params.maxPrice) {
    where.priceSale = {};
    if (params.minPrice) {
      const min = parseInt(params.minPrice, 10);
      if (!Number.isNaN(min)) where.priceSale.gte = min;
    }
    if (params.maxPrice) {
      const max = parseInt(params.maxPrice, 10);
      if (!Number.isNaN(max)) where.priceSale.lte = max;
    }
  }

  if (params.rating) {
    const r = parseFloat(params.rating);
    if (!Number.isNaN(r)) where.rating = { gte: r };
  }

  if (params.bestseller === "1") {
    where.isBestseller = true;
  }

  if (params.sellingFast === "1") {
    where.isSellingFast = true;
  }

  if (andClauses.length > 0) {
    where.AND = andClauses;
  }

  return where;
}

export function buildProductOrderBy(
  sort: string | undefined
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { priceSale: "asc" };
    case "price-desc":
      return { priceSale: "desc" };
    case "rating":
      return { rating: "desc" };
    default:
      return { reviewCount: "desc" };
  }
}
