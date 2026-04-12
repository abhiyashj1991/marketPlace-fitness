import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, Award, Flame, ShieldCheck, Truck, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import { categoryLabel, categorySlug, productImageUrl } from "@/lib/categories";
import { formatPriceINR, discountPercent } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";
import { RelatedProducts } from "@/components/RelatedProducts";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { brand: true },
  });
  if (!product) return { title: "Product — Marketplace Fitness" };
  return {
    title: `${product.name} — Marketplace Fitness`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      reviews: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!product) notFound();

  const discount = discountPercent(product.priceMrp, product.priceSale);
  const outOfStock = product.stock <= 0;
  const imageSrc =
    product.imageUrl ?? productImageUrl(product.category, product.name);

  // Sparse spec list — only show fields that have a value
  const specs: Array<[string, string]> = [];
  if (product.proteinPerServing)
    specs.push(["Protein per serving", product.proteinPerServing]);
  if (product.dosePerServing) specs.push(["Dose per serving", product.dosePerServing]);
  if (product.caloriesPerServing)
    specs.push(["Calories per serving", `${product.caloriesPerServing} kcal`]);
  if (product.servingsPerContainer)
    specs.push(["Servings", `${product.servingsPerContainer}`]);
  if (product.capsules) specs.push(["Capsules", `${product.capsules}`]);
  if (product.tablets) specs.push(["Tablets", `${product.tablets}`]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-1">
        <Link href="/" className="hover:text-emerald-700">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-emerald-700">Products</Link>
        <span>/</span>
        <Link
          href={`/products/category/${categorySlug(product.category)}`}
          className="hover:text-emerald-700"
        >
          {categoryLabel(product.category)}
        </Link>
        <span>/</span>
        <span className="text-foreground truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.isBestseller && (
              <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full shadow">
                <Award className="w-3.5 h-3.5" />
                Bestseller
              </span>
            )}
            {product.isSellingFast && (
              <span className="inline-flex items-center gap-1 bg-rose-500 text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full shadow animate-pulse">
                <Flame className="w-3.5 h-3.5" />
                Selling Fast
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            {categoryLabel(product.category)} · {product.brand.name}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-2 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-1 rounded-md text-sm font-semibold">
              {product.rating.toFixed(1)}
              <Star className="w-3.5 h-3.5 fill-emerald-700 text-emerald-700" />
            </div>
            <span className="text-sm text-muted-foreground">
              {product.reviewCount.toLocaleString("en-IN")} reviews
            </span>
          </div>

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              {formatPriceINR(product.priceSale)}
            </span>
            {discount > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPriceINR(product.priceMrp)}
                </span>
                <span className="text-sm font-bold text-emerald-700">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Inclusive of all taxes
          </div>

          {/* Stock */}
          <div className="mt-4">
            {outOfStock ? (
              <span className="text-sm font-semibold text-destructive">
                Out of stock
              </span>
            ) : product.stock < 10 ? (
              <span className="text-sm font-semibold text-amber-600">
                Only {product.stock} left in stock
              </span>
            ) : (
              <span className="text-sm font-semibold text-emerald-700">
                In stock
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <div className="mt-6">
            <AddToCartButton
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                priceSale: product.priceSale,
                stock: product.stock,
                brandName: product.brand.name,
              }}
            />
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              About this product
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specs */}
          {specs.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Key Specs
              </h2>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {specs.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex flex-col bg-slate-50 rounded-lg p-3"
                  >
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="font-semibold text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Trust strip */}
          <div className="mt-8 grid grid-cols-3 gap-2 pt-6 border-t border-border">
            <div className="flex flex-col items-center text-center text-xs text-muted-foreground">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
              100% Authentic
            </div>
            <div className="flex flex-col items-center text-center text-xs text-muted-foreground">
              <Truck className="w-5 h-5 text-emerald-600 mb-1" />
              Local Delivery
            </div>
            <div className="flex flex-col items-center text-center text-xs text-muted-foreground">
              <MapPin className="w-5 h-5 text-emerald-600 mb-1" />
              Indore
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      <RelatedProducts
        categoryKey={product.category}
        excludeProductId={product.id}
      />

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Customer Reviews
          </h2>
          <div className="space-y-4">
            {product.reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-border rounded-xl p-4"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-sm font-semibold">
                    {r.rating}
                    <Star className="w-3 h-3 fill-emerald-700 text-emerald-700" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {r.customerName}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
