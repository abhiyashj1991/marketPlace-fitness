import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { checkRequestOrigin } from "@/lib/security";
import {
  phoneSchema,
  pincodeSchema,
  ORDER_MAX_ITEMS,
  ORDER_MAX_QTY_PER_ITEM,
} from "@/lib/validation";

export const dynamic = "force-dynamic";

const OrderItemSchema = z.object({
  productId: z.string().min(1).max(64),
  quantity: z
    .number()
    .int()
    .positive()
    .max(ORDER_MAX_QTY_PER_ITEM, `Maximum ${ORDER_MAX_QTY_PER_ITEM} per item`),
});

const CreateOrderSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  customerPhone: phoneSchema,
  addressLine: z.string().trim().min(5).max(300),
  city: z.string().trim().min(1).max(60).default("Indore"),
  pincode: pincodeSchema,
  trainerCode: z.string().trim().max(20).optional().nullable(),
  paymentMethod: z.enum(["CASH", "UPI"]),
  paymentRef: z.string().trim().max(60).optional().nullable(),
  items: z
    .array(OrderItemSchema)
    .min(1, "Cart is empty")
    .max(ORDER_MAX_ITEMS, `Maximum ${ORDER_MAX_ITEMS} items per order`),
});

export async function POST(req: Request) {
  if (!checkRequestOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateOrderSchema.safeParse(payload);
  if (!parsed.success) {
    // Surface a single user-friendly message instead of leaking the schema.
    const firstIssue = parsed.error.issues[0];
    const message = firstIssue?.message ?? "Invalid input";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  const data = parsed.data;

  if (data.paymentMethod === "UPI" && !data.paymentRef) {
    return NextResponse.json(
      { error: "UTR / payment reference required for UPI orders" },
      { status: 400 }
    );
  }

  // Load products to validate stock and snapshot prices.
  const productIds = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  if (products.length !== productIds.length) {
    return NextResponse.json(
      { error: "One or more products no longer exist" },
      { status: 400 }
    );
  }

  // Stock check before any DB writes.
  for (const item of data.items) {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.stock < item.quantity) {
      return NextResponse.json(
        {
          error: `Not enough stock for ${product.name} (${product.stock} available)`,
        },
        { status: 400 }
      );
    }
  }

  // Compute totals from server-side prices (never trust client prices).
  let subtotal = 0;
  const orderItems = data.items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const lineTotal = product.priceSale * item.quantity;
    subtotal += lineTotal;
    return {
      productId: product.id,
      productNameSnapshot: product.name,
      quantity: item.quantity,
      priceSnapshot: product.priceSale,
    };
  });

  // Validate trainer code (optional). Invalid codes are silently ignored
  // (no discount), so a typo doesn't block the order.
  let validatedTrainerCode: string | null = null;
  let discountAmount = 0;
  if (data.trainerCode) {
    const trainer = await prisma.trainer.findUnique({
      where: { uniqueCode: data.trainerCode.toUpperCase() },
    });
    if (trainer && trainer.isActive) {
      validatedTrainerCode = trainer.uniqueCode;
      discountAmount = Math.round(subtotal * 0.1);
    }
  }
  const total = subtotal - discountAmount;

  // Atomic create + decrement stock.
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        addressLine: data.addressLine,
        city: data.city,
        pincode: data.pincode,
        subtotal,
        discountAmount,
        total,
        trainerCodeUsed: validatedTrainerCode,
        paymentMethod: data.paymentMethod,
        paymentRef: data.paymentRef ?? null,
        status: "PENDING",
        items: { create: orderItems },
      },
    });

    for (const item of data.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  return NextResponse.json({ orderId: order.id });
}
