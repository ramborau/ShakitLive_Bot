import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error("[Prisma] DATABASE_URL environment variable is not set!");
    throw new Error("DATABASE_URL environment variable is required");
  }

  console.log("[Prisma] Creating Prisma client");
  console.log("[Prisma] NODE_ENV:", process.env.NODE_ENV);
  console.log("[Prisma] DATABASE_URL present:", !!process.env.DATABASE_URL);
  console.log("[Prisma] DATABASE_URL starts with:", process.env.DATABASE_URL.substring(0, 20));

  // Use standard Prisma client for all environments
  // Prisma Postgres (Neon) works fine with the standard client
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
