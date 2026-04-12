import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { checkRequestOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";

const PatchTrainerSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    phone: z.string().trim().max(20).optional().nullable().or(z.literal("")),
    email: z
      .string()
      .trim()
      .email()
      .max(120)
      .optional()
      .nullable()
      .or(z.literal("")),
    isActive: z.boolean().optional(),
  })
  .strict();

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkRequestOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;

  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = PatchTrainerSchema.safeParse(payload);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Validation failed" },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const existing = await prisma.trainer.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
  }

  const updated = await prisma.trainer.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.phone !== undefined && { phone: data.phone || null }),
      ...(data.email !== undefined && { email: data.email || null }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });

  return NextResponse.json({ trainer: updated });
}
