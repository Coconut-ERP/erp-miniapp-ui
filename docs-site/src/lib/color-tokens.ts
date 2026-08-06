import fs from "node:fs";
import path from "node:path";
import type { ColorToken } from "./color-token-utils";

export type { ColorToken };

/** Parse every color custom property from `globals.css` `:root` (excludes `--radius`). */
export function readRootColorTokens(): ColorToken[] {
  const cssPath = path.join(process.cwd(), "../src/styles/globals.css");
  const css = fs.readFileSync(cssPath, "utf8");
  const block = css.match(/:root\s*\{([\s\S]*?)\}/)?.[1] ?? "";
  const tokens: ColorToken[] = [];
  const seen = new Set<string>();

  for (const match of block.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    const name = match[1]!;
    const value = match[2]!.trim();
    if (seen.has(name)) continue;
    if (name === "radius" || name.startsWith("font") || name.startsWith("radius-")) continue;
    seen.add(name);
    tokens.push({ name, value });
  }

  return tokens;
}

/** Group tokens for the docs UI. */
export function groupColorTokens(tokens: ColorToken[]) {
  const groups: { title: string; match: (name: string) => boolean }[] = [
    {
      title: "Surfaces",
      match: (n) =>
        [
          "background",
          "surface",
          "card",
          "card-foreground",
          "popover",
          "popover-foreground",
          "foreground",
        ].includes(n),
    },
    {
      title: "Brand",
      match: (n) =>
        n.startsWith("primary") ||
        n.startsWith("secondary") ||
        n.startsWith("accent") ||
        n.startsWith("muted"),
    },
    {
      title: "Status",
      match: (n) =>
        n.startsWith("destructive") || n.startsWith("success") || n.startsWith("warning"),
    },
    {
      title: "Chrome",
      match: (n) => n === "border" || n === "input" || n === "ring",
    },
  ];

  const used = new Set<string>();
  const result = groups.map((g) => {
    const items = tokens.filter((t) => g.match(t.name));
    items.forEach((t) => used.add(t.name));
    return { title: g.title, tokens: items };
  });

  const other = tokens.filter((t) => !used.has(t.name));
  if (other.length) result.push({ title: "Other", tokens: other });
  return result.filter((g) => g.tokens.length > 0);
}
