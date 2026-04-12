import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Add Product</h1>
        <Link
          href="/admin/products"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Link>
      </div>
      <ProductForm brandSuggestions={brands.map((b) => b.name)} />
    </div>
  );
}
