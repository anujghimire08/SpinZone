import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DIRECT_URL;
if (!connectionString) throw new Error("DIRECT_URL Missing");

const adapter = new PrismaPg({
  connectionString,
});

export const db = new PrismaClient({ adapter });
