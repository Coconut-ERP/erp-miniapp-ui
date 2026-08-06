import fs from "node:fs";

let r = fs.readFileSync("ROADMAP.md", "utf8");

function completePhase(markdown, num, nextNum) {
  const startMarker = `## Phase ${num} —`;
  const endMarker = nextNum != null ? `## Phase ${nextNum} —` : "## Long term";
  const start = markdown.indexOf(startMarker);
  const end = markdown.indexOf(endMarker);
  if (start < 0 || end < 0 || end <= start) {
    console.warn("skip phase", num);
    return markdown;
  }
  const head = markdown.slice(0, start);
  let mid = markdown.slice(start, end);
  mid = mid.replace(/\*\*Status:\*\* `\[.\]`[^\n]*/u, "**Status:** `[x]` done (2026-08-05)");
  mid = mid.replace(/- \[ \]/g, "- [x]");
  return head + mid + markdown.slice(end);
}

for (let n = 4; n <= 10; n++) {
  r = completePhase(r, n, n < 10 ? n + 1 : null);
}

r = r.replace(
  /\| 2026-08-05 \|[^\n]*/,
  "| 2026-08-05 | Phases 1–10 completed: package, foundations, components, patterns, recipes, conventions, AI skills, Next.js docs-site, miniapp-ui-kit, release pipeline |",
);

fs.writeFileSync("ROADMAP.md", r);
console.log("roadmap updated");
