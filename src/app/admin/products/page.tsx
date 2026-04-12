import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { categoryLabel } from "@/lib/categories";
import { formatPriceINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { brand: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {products.length} in catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-foreground">Product</th>
              <th className="px-4 py-3 font-semibold text-foreground">Category</th>
              <th className="px-4 py-3 font-semibold text-foreground">Brand</th>
              <th className="px-4 py-3 font-semibold text-foreground text-right">
                Price
              </th>
              <th className="px-4 py-3 font-semibold text-foreground text-right">
                Stock
              </th>
              <th className="px-4 py-3 font-semibold text-foreground">Tags</th>
              <th className="px-4 py-3 font-semibold text-foreground"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 max-w-xs">
                  <div className="font-semibold text-foreground line-clamp-1">
                    {p.name}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {p.slug}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {categoryLabel(p.category)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.brand.name}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="font-semibold text-foreground">
                    {formatPriceINR(p.priceSale)}
                  </div>
                  {p.priceMrp > p.priceSale && (
                    <div className="text-xs text-muted-foreground line-through">
                      {formatPriceINR(p.priceMrp)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={
                      p.stock <= 0
                        ? "text-destructive font-semibold"
                        : p.stock < 10
                          ? "text-amber-600 font-semibold"
                          : "text-foreground"
                    }
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.isBestseller && (
                      <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        Bestseller
                      </span>
                    )}
                    {p.isSellingFast && (
                      <span className="inline-block bg-rose-100 text-rose-800 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        Selling Fast
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold text-xs"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
