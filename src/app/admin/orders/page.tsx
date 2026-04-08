import { prisma } from "@/lib/db";
import { formatPriceINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      trainer: true,
    },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center text-muted-foreground">
          No orders yet.
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-foreground">Order</th>
                <th className="px-4 py-3 font-semibold text-foreground">Customer</th>
                <th className="px-4 py-3 font-semibold text-foreground">Trainer</th>
                <th className="px-4 py-3 font-semibold text-foreground">Items</th>
                <th className="px-4 py-3 font-semibold text-foreground">Payment</th>
                <th className="px-4 py-3 font-semibold text-foreground text-right">
                  Total
                </th>
                <th className="px-4 py-3 font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 font-semibold text-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {order.id.slice(0, 8)}…
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground">
                      {order.customerName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.customerPhone}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {order.trainer ? (
                      <div>
                        <div className="text-foreground">{order.trainer.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {order.trainerCodeUsed}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)} items
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-1 rounded">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">
                    {formatPriceINR(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {order.createdAt.toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
