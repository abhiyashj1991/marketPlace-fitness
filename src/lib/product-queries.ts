import type { Prisma } from "@/generated/prisma/client";

export type ProductSearchParams = {
  category?: string; // comma-separated category keys (e.g. "WHEY_PROTEIN,CREATINE")
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  bestseller?: string;
  sellingFast?: string;
  sort?: string;
};

/**
 * Build a Prisma where clause from URL search params.
 *
 * @param params  Parsed search params from the request URL.
 * @param fixedCategoryKey  Optional. When set (e.g. on /products/category/[slug])
 *                          this overrides any user-supplied `category` param.
 */
export function buildProductWhere(
  params: ProductSearchParams,
  fixedCategoryKey?: string
): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

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
