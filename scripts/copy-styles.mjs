import { cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const from = join(root, "src", "styles", "globals.css");
const toDir = join(root, "dist", "styles");
const to = join(toDir, "globals.css");

mkdirSync(toDir, { recursive: true });
cpSync(from, to);
console.error(`copied ${from} → ${to}`);
