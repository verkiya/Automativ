import { PrismaClient } from "@/generated/prisma/client";

// Next.js can re-evaluate modules repeatedly during development. Keeping the
// client on globalThis prevents each hot reload from opening another pool.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
