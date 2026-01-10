import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

let prisma: any = null;

export async function getPrisma() {
  if (!prisma) {
    const connectionString = process.env.DATABASE_URL!;
    const adapter = new PrismaPg({ connectionString });
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}
