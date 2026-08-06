import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const from = join(root, "src", "styles", "globals.css");
const toDir = join(dist, "styles");
const to = join(toDir, "globals.css");

mkdirSync(toDir, { recursive: true });
cpSync(from, to);
console.error(`copied ${from} → ${to}`);

/** Prepend "use client" so Next.js App Router treats UI components as a client boundary.
 *  Do not prefix `cn.*` — that entry must stay server-safe. */
const CLIENT_BANNER = '"use client";\n';
for (const file of ["index.js", "index.cjs"]) {
  const path = join(dist, file);
  const source = readFileSync(path, "utf8");
  if (source.startsWith('"use client"') || source.startsWith("'use client'")) {
    continue;
  }
  writeFileSync(path, CLIENT_BANNER + source);
  console.error(`prefixed ${file} with "use client"`);
}
