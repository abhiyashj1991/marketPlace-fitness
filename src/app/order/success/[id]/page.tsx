import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPriceINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, trainer: true },
  });

  if (!order) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white border border-border rounded-2xl p-8 text-center">
        <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
        <h1 className="text-2xl font-bold text-foreground mt-4">
          Order Placed!
        </h1>
        <p className="text-muted-foreground mt-2">
          Thank you, <strong className="text-foreground">{order.customerName}</strong>.
          Your order has been received and is being processed.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full text-xs font-mono text-muted-foreground">
          Order ID: {order.id}
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 mt-6">
        <h2 className="font-bold text-foreground mb-4">Order Summary</h2>
        <div className="space-y-3 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4">
              <div className="flex-1">
                <div className="text-foreground">{item.productNameSnapshot}</div>
                <div className="text-xs text-muted-foreground">
                  Qty: {item.quantity}
                </div>
              </div>
              <div className="font-semibold whitespace-nowrap">
                {formatPriceINR(item.priceSnapshot * item.quantity)}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border my-4" />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPriceINR(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>
                Trainer discount
                {order.trainer && ` (${order.trainer.name})`}
              </span>
              <span>−{formatPriceINR(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-2">
            <span>Total Paid</span>
            <span>{formatPriceINR(order.total)}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" />
            <span>
              {order.addressLine}
              <br />
              {order.city} – {order.pincode}
            </span>
          </div>
          <div className="mt-2">
            Payment:{" "}
            <strong className="text-foreground">{order.paymentMethod}</strong>
            {order.paymentRef && (
              <span className="font-mono text-xs"> · {order.paymentRef}</span>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <Link
          href="/products"
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Continue Shopping →
        </Link>
      </div>
    </div>
  );
}
