import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Join JSDoc lines until the first blank line (end of the "Purpose" paragraph),
// or a recognized sub-section marker if there's no blank line before it.
function firstParagraph(lines) {
  const paragraph = [];
  let started = false;
  for (const line of lines) {
    if (line === "") {
      if (started) break;
      continue; // skip leading blank lines before the paragraph starts
    }
    if (/^(A11y|Do|Don't):/.test(line)) break;
    started = true;
    paragraph.push(line);
  }
  return paragraph.join(" ").trim() || null;
}

function firstJSDocLine(source) {
  // Match JSDoc immediately before export function (prioritized for components)
  let match = source.match(/\/\*\*((?:[^*]|\*(?!\/))*)\*\/\s*\n\s*export\s+(?:async\s+)?function\s/);

  // Fallback: match JSDoc before any function (for non-exported functions)
  if (!match) {
    match = source.match(/\/\*\*((?:[^*]|\*(?!\/))*)\*\/\s*\n\s*(?:async\s+)?function\s/);
  }

  if (!match) return null;
  const lines = match[1].split("\n").map((line) => line.replace(/^\s*\*\s?/, "").trim());
  return firstParagraph(lines);
}

function componentEntries(dir) {
  const full = join(root, "src", "components", dir);
  return readdirSync(full)
    .filter((file) => file.endsWith(".tsx") && !file.endsWith(".stories.tsx"))
    .sort()
    .map((file) => {
      const name = basename(file, ".tsx");
      const source = readFileSync(join(full, file), "utf8");
      const description = firstJSDocLine(source) ?? "(no JSDoc yet — run the component-docs skill)";
      return `- ${name} — ${description}`;
    });
}

function firstMarkdownParagraph(source) {
  const lines = source.split("\n");
  const titleIndex = lines.findIndex((line) => line.startsWith("# "));
  for (let i = titleIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line &&
      !line.startsWith("#") &&
      !line.startsWith("import ") &&
      !line.startsWith("<Meta") &&
      !line.startsWith("```") &&
      !line.startsWith("|") &&
      !line.startsWith("<")
    ) {
      return line.replace(/^-\s*(\[[ x]\]\s*)?/, "");
    }
  }
  return "(no description)";
}

function docEntries(dir) {
  const full = join(root, "docs", dir);
  return readdirSync(full)
    .filter((file) => (file.endsWith(".md") || file.endsWith(".mdx")) && file !== "README.md")
    .sort()
    .map((file) => {
      const name = basename(file, extname(file));
      const source = readFileSync(join(full, file), "utf8");
      return `- ${name} — ${firstMarkdownParagraph(source)}`;
    });
}

const sections = [
  ["# @erp/miniapp-ui — LLM overview"],
  ["## Components (ui)", ...componentEntries("ui")],
  ["## Components (patterns)", ...componentEntries("patterns")],
  ["## Components (charts)", ...componentEntries("charts")],
  ["## Foundations", ...docEntries("foundations")],
  ["## Patterns (guides)", ...docEntries("patterns")],
];

const output = `${sections.map((section) => section.join("\n")).join("\n\n")}\n`;
const outPath = join(root, "llms.txt");
writeFileSync(outPath, output);
console.error(`wrote ${outPath}`);
