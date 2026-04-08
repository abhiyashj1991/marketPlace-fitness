import Link from "next/link";
import { Star, Flame, Award } from "lucide-react";
import { cn, formatPriceINR, discountPercent } from "@/lib/utils";
import { categoryLabel } from "@/lib/categories";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: { name: string };
  priceMrp: number;
  priceSale: number;
  rating: number;
  reviewCount: number;
  stock: number;
  isBestseller: boolean;
  isSellingFast: boolean;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const discount = discountPercent(product.priceMrp, product.priceSale);
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group block bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all",
        outOfStock && "opacity-70"
      )}
    >
      {/* Image area — placeholder gradient since we have no real images */}
      <div className="relative aspect-square bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 flex items-center justify-center">
        <div className="text-emerald-700/30 text-6xl font-black select-none">
          {product.brand.name[0]}
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.isBestseller && (
            <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full shadow-sm">
              <Award className="w-3 h-3" />
              Bestseller
            </span>
          )}
          {product.isSellingFast && (
            <span className="inline-flex items-center gap-1 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full shadow-sm animate-pulse">
              <Flame className="w-3 h-3" />
              Selling Fast
            </span>
          )}
        </div>

        {/* Discount tag */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            {discount}% OFF
          </div>
        )}

        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-foreground text-sm font-bold px-4 py-2 rounded-md">
              Sold out
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
          {categoryLabel(product.category)}
        </div>
        <div className="text-xs text-muted-foreground">
          {product.brand.name}
        </div>
        <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs">
          <div className="flex items-center gap-0.5 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded-md font-semibold">
            {product.rating.toFixed(1)}
            <Star className="w-3 h-3 fill-emerald-700 text-emerald-700" />
          </div>
          <span className="text-muted-foreground">
            ({product.reviewCount.toLocaleString("en-IN")})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-lg font-bold text-foreground">
            {formatPriceINR(product.priceSale)}
          </span>
          {discount > 0 && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPriceINR(product.priceMrp)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
