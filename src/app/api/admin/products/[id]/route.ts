import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { checkRequestOrigin } from "@/lib/security";
import { CATEGORIES } from "@/lib/categories";

export const dynamic = "force-dynamic";

const ALLOWED_CATEGORIES = CATEGORIES.map((c) => c.key) as [string, ...string[]];

const PatchProductSchema = z
  .object({
    name: z.string().trim().min(2).max(200).optional(),
    brandName: z.string().trim().min(1).max(100).optional(),
    category: z.enum(ALLOWED_CATEGORIES).optional(),
    priceMrp: z.coerce.number().int().positive().max(1_000_000).optional(),
    priceSale: z.coerce.number().int().positive().max(1_000_000).optional(),
    stock: z.coerce.number().int().nonnegative().max(100_000).optional(),
    description: z.string().trim().min(10).max(2_000).optional(),
    imageUrl: z.string().trim().url().max(2_000).optional().or(z.literal("")),
    isBestseller: z.coerce.boolean().optional(),
    isSellingFast: z.coerce.boolean().optional(),
    rating: z.coerce.number().min(0).max(5).optional(),
    reviewCount: z.coerce.number().int().nonnegative().optional(),
    proteinPerServing: z.string().trim().max(50).optional().or(z.literal("")),
    servingsPerContainer: z.coerce.number().int().positive().optional().nullable(),
    dosePerServing: z.string().trim().max(50).optional().or(z.literal("")),
    capsules: z.coerce.number().int().positive().optional().nullable(),
    tablets: z.coerce.number().int().positive().optional().nullable(),
    caloriesPerServing: z.coerce.number().int().positive().optional().nullable(),
  })
  .strict();

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkRequestOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PatchProductSchema.safeParse(payload);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Validation failed" },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (
    data.priceSale !== undefined &&
    data.priceMrp !== undefined &&
    data.priceSale > data.priceMrp
  ) {
    return NextResponse.json(
      { error: "Sale price cannot be higher than MRP" },
      { status: 400 }
    );
  }

  let brandId: string | undefined;
  if (data.brandName) {
    const allBrands = await prisma.brand.findMany();
    const matchingBrand = allBrands.find(
      (b) => b.name.toLowerCase() === data.brandName!.toLowerCase()
    );
    const brand =
      matchingBrand ??
      (await prisma.brand.create({ data: { name: data.brandName } }));
    brandId = brand.id;
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(brandId !== undefined && { brandId }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.priceMrp !== undefined && { priceMrp: data.priceMrp }),
      ...(data.priceSale !== undefined && { priceSale: data.priceSale }),
      ...(data.stock !== undefined && { stock: data.stock }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.imageUrl !== undefined && {
        imageUrl: data.imageUrl.length ? data.imageUrl : null,
      }),
      ...(data.isBestseller !== undefined && {
        isBestseller: Boolean(data.isBestseller),
      }),
      ...(data.isSellingFast !== undefined && {
        isSellingFast: Boolean(data.isSellingFast),
      }),
      ...(data.rating !== undefined && { rating: data.rating }),
      ...(data.reviewCount !== undefined && { reviewCount: data.reviewCount }),
      ...(data.proteinPerServing !== undefined && {
        proteinPerServing: data.proteinPerServing || null,
      }),
      ...(data.servingsPerContainer !== undefined && {
        servingsPerContainer: data.servingsPerContainer,
      }),
      ...(data.dosePerServing !== undefined && {
        dosePerServing: data.dosePerServing || null,
      }),
      ...(data.capsules !== undefined && { capsules: data.capsules }),
      ...(data.tablets !== undefined && { tablets: data.tablets }),
      ...(data.caloriesPerServing !== undefined && {
        caloriesPerServing: data.caloriesPerServing,
      }),
    },
    include: { brand: true },
  });

  return NextResponse.json({ product: updated });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkRequestOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;

  // Check if any orders reference this product. If so, refuse to delete to
  // preserve referential integrity (OrderItem.productId is a non-cascade FK).
  const referenced = await prisma.orderItem.findFirst({ where: { productId: id } });
  if (referenced) {
    return NextResponse.json(
      {
        error:
          "Cannot delete: this product appears in past orders. Set stock to 0 to hide it from the store instead.",
      },
      { status: 409 }
    );
  }

  await prisma.review.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
