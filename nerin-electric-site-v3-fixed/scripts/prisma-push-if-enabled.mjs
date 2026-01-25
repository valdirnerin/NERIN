import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const dbEnabledEnv = (process.env.DB_ENABLED || "").toLowerCase();
const dbExplicitlyDisabled = dbEnabledEnv === "false";
const storageDir =
  (process.env.STORAGE_DIR || "").trim() || (existsSync("/var/data") ? "/var/data" : "");
const storageDirAvailable = storageDir.length > 0 && existsSync(storageDir);

if (dbExplicitlyDisabled) {
  console.log("[build] DB disabled; skipping prisma db push");
  process.exit(0);
}

if (!(process.env.DATABASE_URL || "").trim()) {
  if (storageDirAvailable) {
    process.env.DATABASE_URL = `file:${storageDir}/nerin.db`;
  } else if (process.env.NODE_ENV === "development") {
    process.env.DATABASE_URL = "file:./dev.db";
  } else {
    process.env.DATABASE_URL = "file:/tmp/nerin.db";
  }
}

const url = (process.env.DATABASE_URL || "").trim();
if (!url) {
  console.warn("[build] DATABASE_URL missing; skipping prisma db push");
  process.exit(0);
}

const result = spawnSync("npx", ["prisma", "db", "push"], {
  stdio: "inherit",
  shell: true,
});
process.exit(result.status ?? 1);
