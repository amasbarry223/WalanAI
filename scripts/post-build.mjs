import { cpSync, existsSync } from "node:fs";
import { join } from "node:path";

const standaloneDir = ".next/standalone";

if (!existsSync(standaloneDir)) {
  console.log("Standalone output not found — skipping asset copy.");
  process.exit(0);
}

cpSync(".next/static", join(standaloneDir, ".next/static"), { recursive: true });
cpSync("public", join(standaloneDir, "public"), { recursive: true });

console.log("Copied static assets into standalone build.");
