import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { checkRequestOrigin } from "@/lib/security";
import { CATEGORIES, productImageUrl } from "@/lib/categories";

export const dynamic = "force-dynamic";

const ALLOWED_CATEGORIES = CATEGORIES.map((c) => c.key) as [string, ...string[]];

const NewProductSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens only")
    .optional(),
  brandName: z.string().trim().min(1).max(100),
  category: z.enum(ALLOWED_CATEGORIES),
  priceMrp: z.coerce.number().int().positive().max(1_000_000),
  priceSale: z.coerce.number().int().positive().max(1_000_000),
  stock: z.coerce.number().int().nonnegative().max(100_000),
  description: z.string().trim().min(10).max(2_000),
  imageUrl: z.string().trim().url().max(2_000).optional().or(z.literal("")),
  isBestseller: z.coerce.boolean().optional(),
  isSellingFast: z.coerce.boolean().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewCount: z.coerce.number().int().nonnegative().optional(),
  proteinPerServing: z.string().trim().max(50).optional().or(z.literal("")),
  servingsPerContainer: z.coerce.number().int().positive().optional(),
  dosePerServing: z.string().trim().max(50).optional().or(z.literal("")),
  capsules: z.coerce.number().int().positive().optional(),
  tablets: z.coerce.number().int().positive().optional(),
  caloriesPerServing: z.coerce.number().int().positive().optional(),
});

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

export async function POST(req: Request) {
  if (!checkRequestOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = NewProductSchema.safeParse(payload);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Validation failed" },
      { status: 400 }
    );
  }
  const data = parsed.data;

  if (data.priceSale > data.priceMrp) {
    return NextResponse.json(
      { error: "Sale price cannot be higher than MRP" },
      { status: 400 }
    );
  }

  const slug = data.slug?.length ? data.slug : slugify(data.name);

  // Reject duplicate slug early with a friendly message (instead of Prisma's
  // P2002 unique constraint surfacing through to the client).
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(
      { error: `A product with the slug "${slug}" already exists` },
      { status: 409 }
    );
  }

  // Find or create the brand by name (case-insensitive lookup).
  const allBrands = await prisma.brand.findMany();
  const matchingBrand = allBrands.find(
    (b) => b.name.toLowerCase() === data.brandName.toLowerCase()
  );
  const brand =
    matchingBrand ??
    (await prisma.brand.create({ data: { name: data.brandName } }));

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      brandId: brand.id,
      category: data.category,
      priceMrp: data.priceMrp,
      priceSale: data.priceSale,
      stock: data.stock,
      description: data.description,
      imageUrl:
        data.imageUrl && data.imageUrl.length
          ? data.imageUrl
          : productImageUrl(data.category, data.name),
      isBestseller: Boolean(data.isBestseller),
      isSellingFast: Boolean(data.isSellingFast),
      rating: data.rating ?? 0,
      reviewCount: data.reviewCount ?? 0,
      proteinPerServing: data.proteinPerServing || null,
      servingsPerContainer: data.servingsPerContainer ?? null,
      dosePerServing: data.dosePerServing || null,
      capsules: data.capsules ?? null,
      tablets: data.tablets ?? null,
      caloriesPerServing: data.caloriesPerServing ?? null,
    },
    include: { brand: true },
  });

  return NextResponse.json({ product });
}
