import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const url = process.env.DATABASE_URL ?? "";
  const log = process.env.NODE_ENV === "development" ? (["error", "warn"] as const) : (["error"] as const);
  const remote = url.startsWith("libsql:") || url.startsWith("https:");
  if (!remote) {
    return new PrismaClient({ log: [...log] });
  }
  const adapter = new PrismaLibSQL({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return new PrismaClient({ adapter, log: [...log] });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
