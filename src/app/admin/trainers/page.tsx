import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminTrainersPage() {
  const trainers = await prisma.trainer.findMany({
    include: {
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Trainers</h1>
        <Link
          href="/admin/trainers/new"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Trainer
        </Link>
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-foreground">Name</th>
              <th className="px-4 py-3 font-semibold text-foreground">
                Unique Code
              </th>
              <th className="px-4 py-3 font-semibold text-foreground">Phone</th>
              <th className="px-4 py-3 font-semibold text-foreground">Email</th>
              <th className="px-4 py-3 font-semibold text-foreground">Orders</th>
              <th className="px-4 py-3 font-semibold text-foreground">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {trainers.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-foreground">{t.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{t.uniqueCode}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {t.phone ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {t.email ?? "—"}
                </td>
                <td className="px-4 py-3 text-foreground">{t._count.orders}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      t.isActive
                        ? "inline-block bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded"
                        : "inline-block bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-1 rounded"
                    }
                  >
                    {t.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
