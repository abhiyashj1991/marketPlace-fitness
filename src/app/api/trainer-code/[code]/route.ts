import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const trainer = await prisma.trainer.findUnique({
    where: { uniqueCode: code.toUpperCase() },
  });

  if (!trainer || !trainer.isActive) {
    return NextResponse.json(
      { valid: false, message: "Invalid or inactive trainer code" },
      { status: 200 }
    );
  }

  return NextResponse.json({
    valid: true,
    trainer: { name: trainer.name, code: trainer.uniqueCode },
    discountPercent: 10,
  });
}
