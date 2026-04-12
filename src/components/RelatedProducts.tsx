import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { categoryLabel } from "@/lib/categories";

type Props = {
  categoryKey: string;
  excludeProductId: string;
};

export async function RelatedProducts({ categoryKey, excludeProductId }: Props) {
  const related = await prisma.product.findMany({
    where: {
      category: categoryKey,
      id: { not: excludeProductId },
    },
    include: { brand: true },
    orderBy: [{ isBestseller: "desc" }, { rating: "desc" }],
    take: 4,
  });

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        More from {categoryLabel(categoryKey)}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
