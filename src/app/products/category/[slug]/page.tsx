import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { SortSelect } from "@/components/SortSelect";
import {
  buildProductWhere,
  buildProductOrderBy,
  type ProductSearchParams,
} from "@/lib/product-queries";
import { CATEGORIES, categoryFromSlug } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return { title: "Category — Marketplace Fitness" };
  return {
    title: `${cat.label} — Marketplace Fitness`,
    description: `Shop authentic ${cat.label.toLowerCase()} from trainer-vetted brands. ${cat.description}.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ProductSearchParams>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const categoryKey = categoryFromSlug(slug);
  if (!categoryKey) notFound();

  const category = CATEGORIES.find((c) => c.slug === slug)!;

  const where = buildProductWhere(sp, categoryKey);
  const orderBy = buildProductOrderBy(sp.sort);

  const [products, brands] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { brand: true },
      orderBy,
    }),
    // Show only brands that exist in this category (so filter is relevant)
    prisma.brand.findMany({
      where: { products: { some: { category: categoryKey } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
          Category
        </div>
        <h1 className="text-3xl font-bold text-foreground">{category.label}</h1>
        <p className="text-muted-foreground mt-1">
          {category.description} · {products.length}{" "}
          {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <div className="bg-white border border-border rounded-2xl p-5 sticky top-24">
            <ProductFilters brands={brands.map((b) => b.name)} />
          </div>
        </aside>

        <div className="lg:col-span-9">
          <div className="flex items-center justify-end mb-4">
            <SortSelect />
          </div>

          {products.length === 0 ? (
            <div className="bg-white border border-border rounded-2xl p-12 text-center">
              <p className="text-muted-foreground">
                No products match your filters.
              </p>
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
