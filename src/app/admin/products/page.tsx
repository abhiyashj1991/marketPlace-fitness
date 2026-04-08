import { prisma } from "@/lib/db";
import { categoryLabel } from "@/lib/categories";
import { formatPriceINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { brand: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Products</h1>

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
