import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { SortSelect } from "@/components/SortSelect";
import { MobileFilterDrawer } from "@/components/MobileFilterDrawer";
import {
  buildProductWhere,
  buildProductOrderBy,
  type ProductSearchParams,
} from "@/lib/product-queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Products — Marketplace Fitness",
  description:
    "Browse trainer-recommended whey protein, creatine, fat burners, mass gainers and multivitamins.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<ProductSearchParams>;
}) {
  const params = await searchParams;

  const where = buildProductWhere(params);
  const orderBy = buildProductOrderBy(params.sort);

  const [products, brands] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { brand: true },
      orderBy,
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  const isSearch = Boolean(params.q?.trim());

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        {isSearch ? (
          <>
            <h1 className="text-3xl font-bold text-foreground">
              Search results for &ldquo;{params.q}&rdquo;
            </h1>
            <p className="text-muted-foreground mt-1">
              {products.length} {products.length === 1 ? "match" : "matches"}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-foreground">All Products</h1>
            <p className="text-muted-foreground mt-1">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="bg-white border border-border rounded-2xl p-5 sticky top-24">
            <ProductFilters
              brands={brands.map((b) => b.name)}
              showCategoryFilter
            />
          </div>
        </aside>

        <div className="lg:col-span-9">
          <div className="flex items-center justify-between gap-2 mb-4">
            <MobileFilterDrawer
              brands={brands.map((b) => b.name)}
              showCategoryFilter
            />
            <SortSelect />
          </div>

          {products.length === 0 ? (
            <div className="bg-white border border-border rounded-2xl p-12 text-center">
              <p className="text-muted-foreground">
                No products match your filters.
              </p>
              <Link
                href="/products"
                className="inline-block mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
