import { copyFile, readFile, writeFile } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { get, put } from "@vercel/blob";

const BLOB_PATH = "svarupa/database.db";
const WRITE_OPS = new Set([
  "create",
  "update",
  "delete",
  "upsert",
  "createMany",
  "updateMany",
  "deleteMany",
]);

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  dbFile?: string;
};

function bundledDatabase() {
  return path.join(process.cwd(), "prisma", "dev.db");
}

async function loadPersistedDatabase(dest: string) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return;
  try {
    const existing = await get(BLOB_PATH, { access: "private", token, useCache: false });
    if (!existing || existing.statusCode !== 200 || !existing.stream) return;
    const bytes = await new Response(existing.stream).arrayBuffer();
    await writeFile(dest, Buffer.from(bytes));
  } catch {
    // First boot: the bundled seed database is the store.
  }
}

async function persistDatabase() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const file = globalForPrisma.dbFile;
  if (!token || !file) return;
  await put(BLOB_PATH, await readFile(file), {
    access: "private",
    allowOverwrite: true,
    token,
  });
}

export async function prepareDatabase() {
  if (globalForPrisma.prisma) return;
  const log = process.env.NODE_ENV === "development" ? (["error", "warn"] as const) : (["error"] as const);

  if (process.env.VERCEL) {
    const dest = "/tmp/svarupa.db";
    await copyFile(bundledDatabase(), dest);
    await loadPersistedDatabase(dest);
    process.env.DATABASE_URL = `file:${dest}`;
    globalForPrisma.dbFile = dest;
  }

  const base = new PrismaClient({ log: [...log] });
  const client = globalForPrisma.dbFile
    ? base.$extends({
        query: {
          $allModels: {
            async $allOperations({ operation, args, query }) {
              const result = await query(args);
              if (WRITE_OPS.has(operation)) await persistDatabase();
              return result;
            },
          },
        },
      })
    : base;

  globalForPrisma.prisma = client as unknown as PrismaClient;
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = globalForPrisma.prisma;
    if (!client) {
      throw new Error("Database is not ready.");
    }
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
