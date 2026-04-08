import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const NewTrainerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
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
  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = NewTrainerSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  // Retry on collision (very unlikely with 32^6 space)
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
