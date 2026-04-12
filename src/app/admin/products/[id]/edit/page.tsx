import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { brand: true },
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {product.id}
          </p>
        </div>
        <Link
          href="/admin/products"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Link>
      </div>
      <ProductForm
        brandSuggestions={brands.map((b) => b.name)}
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          brandName: product.brand.name,
          category: product.category,
          priceMrp: product.priceMrp,
          priceSale: product.priceSale,
          stock: product.stock,
          description: product.description,
          imageUrl: product.imageUrl,
          isBestseller: product.isBestseller,
          isSellingFast: product.isSellingFast,
          rating: product.rating,
          reviewCount: product.reviewCount,
          proteinPerServing: product.proteinPerServing,
          servingsPerContainer: product.servingsPerContainer,
          dosePerServing: product.dosePerServing,
          capsules: product.capsules,
          tablets: product.tablets,
          caloriesPerServing: product.caloriesPerServing,
        }}
      />
    </div>
  );
}
