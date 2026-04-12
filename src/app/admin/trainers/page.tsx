import Link from "next/link";
import { Plus, Copy } from "lucide-react";
import { prisma } from "@/lib/db";
import { TrainerActiveToggle } from "@/components/admin/TrainerActiveToggle";

export const dynamic = "force-dynamic";

export default async function AdminTrainersPage() {
  const trainers = await prisma.trainer.findMany({
    include: {
      _count: { select: { orders: true } },
      orders: { select: { total: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trainers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {trainers.length} trainers · share their referral link to give
            customers automatic 10% off
          </p>
        </div>
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
              <th className="px-4 py-3 font-semibold text-foreground">Code</th>
              <th className="px-4 py-3 font-semibold text-foreground">Phone</th>
              <th className="px-4 py-3 font-semibold text-foreground">Email</th>
              <th className="px-4 py-3 font-semibold text-foreground text-right">
                Orders
              </th>
              <th className="px-4 py-3 font-semibold text-foreground text-right">
                Revenue
              </th>
              <th className="px-4 py-3 font-semibold text-foreground">Status</th>
              <th className="px-4 py-3 font-semibold text-foreground">
                Referral Link
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {trainers.map((t) => {
              const revenue = t.orders.reduce((s, o) => s + o.total, 0);
              return (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {t.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{t.uniqueCode}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {t.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {t.email ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {t._count.orders}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-700 font-semibold">
                    ₹{revenue.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <TrainerActiveToggle
                      trainerId={t.id}
                      initialActive={t.isActive}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ReferralLink code={t.uniqueCode} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {trainers.length === 0 && (
        <div className="bg-white border border-border rounded-2xl p-12 text-center mt-4">
          <p className="text-muted-foreground">
            No trainers yet.{" "}
            <Link
              href="/admin/trainers/new"
              className="text-emerald-700 hover:text-emerald-800 font-semibold"
            >
              Add your first trainer →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

function ReferralLink({ code }: { code: string }) {
  const url = `https://fitnessmarketplace.vercel.app/?ref=${code}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-mono"
      title={url}
    >
      <Copy className="w-3 h-3" />
      ?ref={code}
    </a>
  );
}
