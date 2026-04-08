import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");

  const adapter = new PrismaPg({ connectionString: databaseUrl });
  const prisma = new PrismaClient({ adapter });

  const products = await prisma.product.findMany({
    take: 3,
    select: { id: true, name: true, stock: true, priceSale: true },
  });
  console.log("PRODUCTS:");
  console.log(JSON.stringify(products, null, 2));

  const trainers = await prisma.trainer.findMany({
    select: { uniqueCode: true, name: true },
  });
  console.log("TRAINERS:");
  console.log(JSON.stringify(trainers, null, 2));

  await prisma.$disconnect();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
