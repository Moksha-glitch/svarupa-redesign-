import { execSync } from "node:child_process";

process.env.DATABASE_URL = "file:./dev.db";
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit", env: process.env });
execSync("npx tsx prisma/seed.ts", { stdio: "inherit", env: process.env });
