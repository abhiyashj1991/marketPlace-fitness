import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

async function main() {
  const adapter = new PrismaBetterSqlite3({
    url: path.join(process.cwd(), "dev.db"),
  });
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
