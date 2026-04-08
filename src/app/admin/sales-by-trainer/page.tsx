import { prisma } from "@/lib/db";
import { formatPriceINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

type TrainerSalesRow = {
  trainerId: string;
  trainerName: string;
  uniqueCode: string;
  orderCount: number;
  unitsSold: number;
  totalRevenue: number;
  topProductName: string | null;
};

export default async function SalesByTrainerPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const sp = await searchParams;

  const dateFilter: { gte?: Date; lte?: Date } = {};
  if (sp.from) {
    const d = new Date(sp.from);
    if (!Number.isNaN(d.getTime())) dateFilter.gte = d;
  }
  if (sp.to) {
    const d = new Date(sp.to);
    if (!Number.isNaN(d.getTime())) {
      // Make 'to' inclusive of the end of day
      d.setHours(23, 59, 59, 999);
      dateFilter.lte = d;
    }
  }

  const trainers = await prisma.trainer.findMany({
    orderBy: { name: "asc" },
    include: {
      orders: {
        where: {
          createdAt:
            dateFilter.gte || dateFilter.lte ? dateFilter : undefined,
        },
        include: { items: true },
      },
    },
  });

  const rows: TrainerSalesRow[] = trainers
    .map((t) => {
      const orders = t.orders;
      const orderCount = orders.length;
      const unitsSold = orders.reduce(
        (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
        0
      );
      const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

      // Top product across this trainer's orders
      const productCounts = new Map<string, number>();
      for (const o of orders) {
        for (const i of o.items) {
          productCounts.set(
            i.productNameSnapshot,
            (productCounts.get(i.productNameSnapshot) ?? 0) + i.quantity
          );
        }
      }
      let topProductName: string | null = null;
      let topQty = 0;
      for (const [name, qty] of productCounts) {
        if (qty > topQty) {
          topProductName = name;
          topQty = qty;
        }
      }

      return {
        trainerId: t.id,
        trainerName: t.name,
        uniqueCode: t.uniqueCode,
        orderCount,
        unitsSold,
        totalRevenue,
        topProductName,
      };
    })
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  // Build CSV download URL (server-side compose)
  const csvHeader = [
    "Trainer",
    "Code",
    "Orders",
    "Units Sold",
    "Total Revenue",
    "Top Product",
  ].join(",");
  const csvRows = rows.map((r) =>
    [
      `"${r.trainerName.replace(/"/g, '""')}"`,
      r.uniqueCode,
      r.orderCount,
      r.unitsSold,
      r.totalRevenue,
      `"${(r.topProductName ?? "").replace(/"/g, '""')}"`,
    ].join(",")
  );
  const csvData = encodeURIComponent([csvHeader, ...csvRows].join("\n"));
  const csvHref = `data:text/csv;charset=utf-8,${csvData}`;

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Sales by Trainer
      </h1>
      <p className="text-muted-foreground text-sm mb-6">
        Per-trainer breakdown driven by the unique discount codes used at
        checkout.
      </p>

      <form
        method="GET"
        className="bg-white border border-border rounded-2xl p-4 mb-6 flex flex-wrap items-end gap-3"
      >
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            From
          </label>
          <input
            type="date"
            name="from"
            defaultValue={sp.from ?? ""}
            className="px-3 py-2 border border-border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            To
          </label>
          <input
            type="date"
            name="to"
            defaultValue={sp.to ?? ""}
            className="px-3 py-2 border border-border rounded-lg text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
        >
          Apply
        </button>
        <a
          href={csvHref}
          download="sales-by-trainer.csv"
          className="ml-auto text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Download CSV ↓
        </a>
      </form>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-foreground">Trainer</th>
              <th className="px-4 py-3 font-semibold text-foreground">Code</th>
              <th className="px-4 py-3 font-semibold text-foreground text-right">
                Orders
              </th>
              <th className="px-4 py-3 font-semibold text-foreground text-right">
                Units Sold
              </th>
              <th className="px-4 py-3 font-semibold text-foreground text-right">
                Revenue
              </th>
              <th className="px-4 py-3 font-semibold text-foreground">
                Top Product
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.trainerId} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-foreground">
                  {r.trainerName}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {r.uniqueCode}
                </td>
                <td className="px-4 py-3 text-right">{r.orderCount}</td>
                <td className="px-4 py-3 text-right">{r.unitsSold}</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-700">
                  {formatPriceINR(r.totalRevenue)}
                </td>
                <td className="px-4 py-3 text-muted-foreground line-clamp-1 max-w-xs">
                  {r.topProductName ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
