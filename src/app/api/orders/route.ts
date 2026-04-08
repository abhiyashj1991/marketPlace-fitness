import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const OrderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

const CreateOrderSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(7),
  addressLine: z.string().min(1),
  city: z.string().default("Indore"),
  pincode: z.string().min(4),
  trainerCode: z.string().optional().nullable(),
  paymentMethod: z.enum(["CASH", "UPI"]),
  paymentRef: z.string().optional().nullable(),
  items: z.array(OrderItemSchema).min(1),
});

export async function POST(req: Request) {
  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateOrderSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Validate UPI requires payment ref
  if (data.paymentMethod === "UPI" && !data.paymentRef) {
    return NextResponse.json(
      { error: "UTR / payment reference required for UPI orders" },
      { status: 400 }
    );
  }

  // Load products to validate stock and snapshot prices
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

  // Stock check
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

  // Compute totals
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

  // Validate trainer code (if provided)
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

  // Create order + decrement stock atomically
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
