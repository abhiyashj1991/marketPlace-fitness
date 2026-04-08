import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { checkRequestOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";

const NewTrainerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(20).optional().nullable(),
  email: z.string().trim().email().max(120).optional().nullable().or(z.literal("")),
});

function generateTrainerCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "TRN-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

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

  const parsed = NewTrainerSchema.safeParse(payload);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Validation failed" },
      { status: 400 }
    );
  }

  // Retry on collision (very unlikely with 32^6 ≈ 1B space).
  let trainer;
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateTrainerCode();
    const existing = await prisma.trainer.findUnique({
      where: { uniqueCode: code },
    });
    if (existing) continue;
    trainer = await prisma.trainer.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        email: parsed.data.email || null,
        uniqueCode: code,
      },
    });
    break;
  }

  if (!trainer) {
    return NextResponse.json(
      { error: "Could not generate unique code" },
      { status: 500 }
    );
  }

  return NextResponse.json({ trainer });
}
