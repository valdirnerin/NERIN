import { spawnSync } from "node:child_process";

const enabled = (process.env.DB_ENABLED || "").toLowerCase() === "true";
const url = (process.env.DATABASE_URL || "").trim();

if (!enabled) {
  console.log("[build] DB disabled; skipping prisma db push");
  process.exit(0);
}
if (!url) {
  console.warn(
    "[build] DB_ENABLED=true but DATABASE_URL missing; skipping prisma db push"
  );
  process.exit(0);
}

const result = spawnSync("npx", ["prisma", "db", "push"], {
  stdio: "inherit",
  shell: true,
});
process.exit(result.status ?? 1);
