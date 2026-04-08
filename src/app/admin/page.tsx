import Link from "next/link";
import { Package, Users, ShoppingBag, IndianRupee } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPriceINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, trainerCount, orderCount, totals, topTrainer, topProduct] =
    await Promise.all([
      prisma.product.count(),
      prisma.trainer.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.groupBy({
        by: ["trainerCodeUsed"],
        where: { trainerCodeUsed: { not: null } },
        _sum: { total: true },
        _count: { id: true },
        orderBy: { _sum: { total: "desc" } },
        take: 1,
      }),
      prisma.orderItem.groupBy({
        by: ["productId", "productNameSnapshot"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 1,
      }),
    ]);

  const totalRevenue = totals._sum.total ?? 0;

  let topTrainerName = "—";
  if (topTrainer.length > 0 && topTrainer[0].trainerCodeUsed) {
    const t = await prisma.trainer.findUnique({
      where: { uniqueCode: topTrainer[0].trainerCodeUsed },
    });
    if (t) topTrainerName = `${t.name} (${formatPriceINR(topTrainer[0]._sum.total ?? 0)})`;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Revenue"
          value={formatPriceINR(totalRevenue)}
          icon={IndianRupee}
        />
        <StatCard
          label="Orders"
          value={orderCount.toString()}
          icon={ShoppingBag}
        />
        <StatCard label="Products" value={productCount.toString()} icon={Package} />
        <StatCard label="Trainers" value={trainerCount.toString()} icon={Users} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-border rounded-2xl p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Top Trainer
          </div>
          <div className="text-xl font-bold text-foreground mt-2">
            {topTrainerName}
          </div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Top Product (units sold)
          </div>
          <div className="text-xl font-bold text-foreground mt-2 line-clamp-2">
            {topProduct.length > 0
              ? `${topProduct[0].productNameSnapshot} · ${topProduct[0]._sum.quantity ?? 0}`
              : "—"}
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 mt-6">
        <h2 className="font-bold text-foreground mb-3">Quick Links</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/sales-by-trainer"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            View sales by trainer →
          </Link>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            View all orders →
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          {label}
        </div>
        <Icon className="w-4 h-4 text-emerald-600" />
      </div>
      <div className="text-2xl font-bold text-foreground mt-2">{value}</div>
    </div>
  );
}
