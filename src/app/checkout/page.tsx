"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, X, Loader2, QrCode } from "lucide-react";
import { useCart, cartSubtotal } from "@/lib/cart-store";
import { formatPriceINR, cn } from "@/lib/utils";

type TrainerValidation =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "valid"; trainerName: string; code: string }
  | { state: "invalid"; message: string };

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clear);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [pincode, setPincode] = useState("");

  const [trainerCode, setTrainerCode] = useState("");
  const [trainerStatus, setTrainerStatus] = useState<TrainerValidation>({
    state: "idle",
  });

  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "UPI">("CASH");
  const [paymentRef, setPaymentRef] = useState("");

  const subtotal = cartSubtotal(items);
  const discountAmount =
    trainerStatus.state === "valid" ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discountAmount;

  async function validateTrainerCode() {
    if (!trainerCode.trim()) {
      setTrainerStatus({ state: "idle" });
      return;
    }
    setTrainerStatus({ state: "checking" });
    try {
      const res = await fetch(
        `/api/trainer-code/${encodeURIComponent(trainerCode.trim())}`
      );
      const data = await res.json();
      if (data.valid) {
        setTrainerStatus({
          state: "valid",
          trainerName: data.trainer.name,
          code: data.trainer.code,
        });
      } else {
        setTrainerStatus({ state: "invalid", message: data.message });
      }
    } catch {
      setTrainerStatus({
        state: "invalid",
        message: "Could not validate code",
      });
    }
  }

  function placeOrder() {
    setError(null);
    if (
      !customerName ||
      !customerPhone ||
      !addressLine ||
      !pincode ||
      items.length === 0
    ) {
      setError("Please fill in all required fields");
      return;
    }
    if (paymentMethod === "UPI" && !paymentRef.trim()) {
      setError("Please enter your UPI transaction / UTR reference");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName,
            customerPhone,
            addressLine,
            city: "Indore",
            pincode,
            trainerCode:
              trainerStatus.state === "valid" ? trainerStatus.code : null,
            paymentMethod,
            paymentRef: paymentMethod === "UPI" ? paymentRef : null,
            items: items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
            })),
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Failed to place order");
          return;
        }
        clearCart();
        router.push(`/order/success/${data.orderId}`);
      } catch {
        setError("Network error — please try again");
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">Your cart is empty</h1>
        <Link
          href="/products"
          className="inline-flex items-center mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Customer details */}
          <section className="bg-white border border-border rounded-2xl p-6">
            <h2 className="font-bold text-foreground mb-4">Delivery Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                value={customerName}
                onChange={setCustomerName}
              />
              <Input
                label="Phone *"
                value={customerPhone}
                onChange={setCustomerPhone}
                type="tel"
              />
              <div className="md:col-span-2">
                <Input
                  label="Address *"
                  value={addressLine}
                  onChange={setAddressLine}
                />
              </div>
              <Input label="City" value="Indore" onChange={() => {}} disabled />
              <Input
                label="Pincode *"
                value={pincode}
                onChange={setPincode}
              />
            </div>
          </section>

          {/* Trainer code */}
          <section className="bg-white border border-border rounded-2xl p-6">
            <h2 className="font-bold text-foreground">Trainer Discount Code</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Have a trainer&apos;s code? Get 10% off your order.
            </p>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={trainerCode}
                onChange={(e) => {
                  setTrainerCode(e.target.value.toUpperCase());
                  setTrainerStatus({ state: "idle" });
                }}
                placeholder="e.g. TRN-XXXXXX"
                className="flex-1 px-3 py-2 border border-border rounded-lg uppercase font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={validateTrainerCode}
                disabled={
                  !trainerCode.trim() || trainerStatus.state === "checking"
                }
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg text-sm"
              >
                {trainerStatus.state === "checking" ? "Checking…" : "Apply"}
              </button>
            </div>
            {trainerStatus.state === "valid" && (
              <div className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-700 font-semibold">
                <Check className="w-4 h-4" />
                10% off applied — recommended by {trainerStatus.trainerName}
              </div>
            )}
            {trainerStatus.state === "invalid" && (
              <div className="mt-3 inline-flex items-center gap-2 text-sm text-destructive font-semibold">
                <X className="w-4 h-4" />
                {trainerStatus.message}
              </div>
            )}
          </section>

          {/* Payment */}
          <section className="bg-white border border-border rounded-2xl p-6">
            <h2 className="font-bold text-foreground mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              <PaymentOption
                label="Cash on Delivery"
                description="Pay when your order arrives"
                selected={paymentMethod === "CASH"}
                onClick={() => setPaymentMethod("CASH")}
              />
              <PaymentOption
                label="UPI"
                description="Pay via QR / UPI ID"
                selected={paymentMethod === "UPI"}
                onClick={() => setPaymentMethod("UPI")}
              />
            </div>
            {paymentMethod === "UPI" && (
              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-white border border-border rounded-lg flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-16 h-16 text-emerald-700" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-foreground">
                      Pay to: marketplacefitness@upi
                    </div>
                    <div className="text-muted-foreground mt-1">
                      Amount: <strong>{formatPriceINR(total)}</strong>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      After paying, enter the UTR / transaction reference below
                      to confirm your order.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    UTR / Transaction Ref *
                  </label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="e.g. 123456789012"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-4">
          <div className="bg-white border border-border rounded-2xl p-6 sticky top-24">
            <h2 className="font-bold text-foreground text-lg mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3 text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="line-clamp-2 text-foreground">
                      {item.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="font-semibold whitespace-nowrap">
                    {formatPriceINR(item.priceSale * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-semibold">
                  {formatPriceINR(subtotal)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Trainer discount (10%)</span>
                  <span>−{formatPriceINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className="text-emerald-700 font-semibold">FREE</span>
              </div>
            </div>
            <div className="border-t border-border my-4" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPriceINR(total)}</span>
            </div>
            {error && (
              <div className="mt-4 text-sm text-destructive">{error}</div>
            )}
            <button
              onClick={placeOrder}
              disabled={isPending}
              className={cn(
                "w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2",
                isPending && "opacity-70"
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Placing order…
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-foreground mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-muted-foreground"
      />
    </div>
  );
}

function PaymentOption({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border-2 rounded-xl p-4 text-left transition-colors",
        selected
          ? "border-emerald-600 bg-emerald-50"
          : "border-border hover:border-emerald-300"
      )}
    >
      <div className="font-semibold text-foreground">{label}</div>
      <div className="text-xs text-muted-foreground mt-1">{description}</div>
    </button>
  );
}
