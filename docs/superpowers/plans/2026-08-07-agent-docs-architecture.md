# Agent Docs Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `@erp/miniapp-ui`'s component API and pattern docs readable by AI agents working in *other* repos that install this package, without hand-maintained docs drifting from the code that backs them.

**Architecture:** JSDoc on each exported component becomes the source of truth for component-level docs (ships in `dist/index.d.ts` for a zero-config fallback); Storybook + `@storybook/addon-mcp` autodocs that JSDoc for a live, queryable interface; a generated `llms.txt` gives a one-file overview; all narrative docs with no single backing component (foundations, conventions, cross-component patterns, recipes) move into Storybook as MDX docs pages so the same MCP interface serves them too. A reusable `component-docs` skill keeps JSDoc+story in sync going forward and is reused to migrate the 50 components that predate this plan.

**Tech Stack:** React 19, Tailwind CSS 4, `@storybook/react-vite`, `@storybook/addon-docs`, `@storybook/addon-mcp`, existing `tsup` build.

**Spec:** [docs/adr/002-agent-docs-architecture.md](../../adr/002-agent-docs-architecture.md) — read it before starting; this plan implements it section by section.

## Global Constraints

- Stack is locked: React 19, Tailwind CSS 4, Radix UI, CVA, lucide-react, light mode only (`AGENTS.md`).
- No deep imports from outside `src/index.ts` / `styles.css`; no ERP domain logic in this package.
- JSDoc lives directly on the exported component in its `.tsx` file — never in a sibling file (ADR §2).
- `llms.txt` is generated only, never hand-edited (ADR §3).
- `docs/components/*.md` and the 5 code-backed `docs/patterns/*.md` files (`app-sidebar`, `date-picker`, `sortable-list`, `confirmation`, `search`) are retired by **hand**-deletion after review — no task in this plan deletes them automatically.
- `docs-site/` (Next.js) is untouched — no edits, no deletion.
- Only `.ai/skills/component.md` gets a one-line addition; the other 6 files in `.ai/skills/` are untouched.
- Hosting a persistent, publicly reachable Storybook+MCP instance is explicitly out of scope for this repo's code.
- `component-docs` skill is created via the `skill-creator` skill, not hand-written.

---

## Task 1: Storybook + Tailwind 4 tooling

**Files:**
- Modify: `package.json`
- Create: `.storybook/main.ts`
- Create: `.storybook/preview.ts`
- Create: `.storybook/tailwind.css`

**Interfaces:**
- Produces: a working `npm run storybook` dev server on port 6006, and `npm run build-storybook` static build. Later tasks (2, 5, 7+) rely on `.storybook/main.ts`'s `stories` globs already covering both `src/components/**/*.stories.tsx` and `docs/**/*.mdx`.

- [ ] **Step 1: Add devDependencies to `package.json`**

```json
"devDependencies": {
    "@storybook/addon-docs": "^10",
    "@storybook/addon-mcp": "^0.7",
    "@storybook/react-vite": "^10",
    "@tailwindcss/vite": "^4",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "storybook": "^10",
    "tailwindcss": "^4",
    "tsup": "^8.2.4",
    "typescript": "^5.5.4"
}
```

(Keep the existing entries; this only adds `storybook`, `@storybook/react-vite`,
`@storybook/addon-docs`, `@storybook/addon-mcp`, `@tailwindcss/vite`, `tailwindcss`.)

**Amendment (found during Task 1 execution, 2026-08-07):** the original plan pinned
`storybook`/`@storybook/react-vite`/`@storybook/addon-docs` to `^9`. `@storybook/addon-mcp`
(all published 0.x versions) declares `peerDependencies` support for `storybook ^9.1.16` but
in practice imports `importModule` from `storybook/internal/common`, which only exists from
`storybook@10.0.0` onward — every `9.x` release fails to boot with a `CriticalPresetLoadError`.
`storybook@10.5.7` is the current `latest` dist-tag (not canary/alpha), with matching `10.x`
releases of `react-vite`/`addon-docs`. Versions above are corrected to `^10` /
`@storybook/addon-mcp: ^0.7` (that package versions independently, never had a `9.x` line)
accordingly — this is the version set to install, not the original `^9` block.

- [ ] **Step 2: Add scripts to `package.json`**

```json
"scripts": {
    "typecheck": "tsc --noEmit",
    "build": "tsup && node ./scripts/copy-styles.mjs && node ./scripts/generate-llms-txt.mjs",
    "pack:check": "npm pack --dry-run",
    "prepack": "npm run build",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
}
```

(The `generate-llms-txt.mjs` call is added here now so Task 4 only has to create the file —
if Task 4's script doesn't exist yet, `npm run build` will fail until Task 4 lands; that's
expected and fine since tasks run in order.)

- [ ] **Step 3: Install**

Run: `npm install`
Expected: lockfile updates, no errors. If npm reports a missing peer for `vite`, add it
explicitly: `npm install -D vite@^6` (the exact major version `@storybook/react-vite`
resolves to — check the installed version with `npm ls vite` and pin `package.json` to
match).

- [ ] **Step 4: Create `.storybook/main.ts`**

```ts
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: [
    "../src/components/**/*.stories.tsx",
    "../docs/foundations/**/*.mdx",
    "../docs/conventions/**/*.mdx",
    "../docs/patterns/**/*.mdx",
    "../docs/recipes/**/*.mdx",
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-mcp"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(viteConfig) {
    viteConfig.plugins = viteConfig.plugins ?? [];
    viteConfig.plugins.push(tailwindcss());
    return viteConfig;
  },
};

export default config;
```

- [ ] **Step 5: Create `.storybook/preview.ts`**

```ts
import type { Preview } from "@storybook/react-vite";

import "./tailwind.css";

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};

export default preview;
```

- [ ] **Step 6: Create `.storybook/tailwind.css`**

```css
@import "tailwindcss";
@import "../src/styles/globals.css";

/* Scan library source directly (not dist) so story-only class names are generated too. */
@source "../src/**/*.{ts,tsx}";
```

- [ ] **Step 7: Verify the dev server boots**

Run: `npm run storybook`
Expected: server starts on `http://localhost:6006` with no build errors in the terminal
(the sidebar will be empty — no stories exist yet, that's expected). Stop the server
(Ctrl-C) once confirmed.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json .storybook
git commit -m "chore(miniapp-ui): add Storybook + Tailwind 4 tooling"
```

---

## Task 2: Pilot component doc — Button

**Files:**
- Modify: `src/components/ui/button.tsx`
- Create: `src/components/ui/button.stories.tsx`

**Interfaces:**
- Produces: the concrete JSDoc + CSF story pattern that Task 9's batch migration and the
  `component-docs` skill (Task 6) both follow. Read this task's diffs before writing the
  skill in Task 6.

- [ ] **Step 1: Add JSDoc to `Button` in `src/components/ui/button.tsx`**

Insert directly above `function Button({`:

```tsx
/**
 * Primary interactive control for actions and navigation.
 *
 * A11y: keyboard reachable with a visible focus-visible ring; icon-only
 * triggers need an aria-label; pair form controls with Label/Field.
 *
 * Do: use design tokens (bg-primary, text-muted-foreground, …) and compose
 * with other library primitives.
 * Don't: hard-code colors, or bypass Radix for custom focus traps on overlays.
 */
function Button({
```

- [ ] **Step 2: Create `src/components/ui/button.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Destructive: Story = {
  args: { variant: "destructive" },
};

export const Link: Story = {
  args: { variant: "link" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const IconOnly: Story = {
  args: { size: "icon", "aria-label": "Icon action", children: "★" },
};
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Visually verify in Storybook**

Run: `npm run storybook`, open `http://localhost:6006`, navigate to `UI/Button`.
Expected: an autodocs page titled "Button" showing the JSDoc description, a props table
listing `variant`, `size`, `asChild`, `children` with types pulled from the TS type (not
hand-written), and all 9 stories rendering without console errors. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/button.tsx src/components/ui/button.stories.tsx
git commit -m "docs(miniapp-ui): add JSDoc + Storybook story for Button (pilot)"
```

---

## Task 3: `package.json` files field + README "For AI agents" section

**Files:**
- Modify: `package.json`
- Modify: `README.md`

- [ ] **Step 1: Extend the `files` field**

```json
"files": [
    "dist",
    "README.md",
    "CHANGELOG.md",
    "llms.txt",
    "docs/foundations",
    "docs/conventions",
    "docs/patterns",
    "docs/recipes"
]
```

- [ ] **Step 2: Add a "For AI agents" section to `README.md`**

Insert after the existing "## Quick start" section (before "## Project docs"):

```markdown
## For AI agents

- `llms.txt` (shipped in this package) is a one-file overview of every component and doc
  page — read it first.
- `dist/index.d.ts` carries JSDoc for every exported component (Purpose / A11y / Do-Don't) —
  readable with zero network access, e.g. via editor hover or `cat
  node_modules/@erp/miniapp-ui/dist/index.d.ts`.
- `docs/foundations/`, `docs/conventions/`, `docs/patterns/`, `docs/recipes/` (shipped as
  `.mdx`) ship inside this package for the same zero-network reason.
- If this org has hosted a live Storybook instance for `@erp/miniapp-ui`, its `/mcp` endpoint
  gives richer, always-current querying (props, live examples, tests) — add it to your
  agent's MCP config. Ask your team for the URL; none is hard-coded here.
```

- [ ] **Step 3: Verify the tarball**

Run: `npm run pack:check`
Expected: output lists `llms.txt` (will 404/be absent until Task 4 — that's fine, re-run
this check after Task 4) and the four `docs/` subfolders.

- [ ] **Step 4: Commit**

```bash
git add package.json README.md
git commit -m "chore(miniapp-ui): ship llms.txt and prose docs in the npm tarball"
```

---

## Task 4: `llms.txt` generator

**Amendment (found during Task 3, 2026-08-07):** Task 1's `build` script already chains
`node ./scripts/generate-llms-txt.mjs`, and Task 3's own verification step (`npm run
pack:check`) triggers `prepack` → `build`, so it would hard-fail with `ENOENT` without a
file at that path. The Task 3 implementer created a 3-line placeholder there (logs a
placeholder message, no side effects) so Task 3's own required check could pass. Ruling:
keep the stub — Task 4 below still **overwrites it in full** with the real implementation;
treat the "Create" in the Files section as "overwrite the existing placeholder," not a
from-scratch file.

**Files:**
- Create (overwrite the Task 3 placeholder): `scripts/generate-llms-txt.mjs`

**Interfaces:**
- Consumes: JSDoc comments in `src/components/{ui,patterns,charts}/*.tsx` (Task 2's pattern),
  and first-paragraph text in `docs/{foundations,conventions,patterns,recipes}/*.{md,mdx}`.
- Produces: `llms.txt` at the package root, referenced by Task 3's README section and Task 1's
  `build` script.

- [ ] **Step 1: Create `scripts/generate-llms-txt.mjs`**

**Amendment (found in Task 4 review, fix round 1, 2026-08-07):** the original regex below
matched the *first* `/** */` block in the file, which for `app-sidebar`, `date-picker`,
`layout`, `sortable-list`, `bar-chart`, `donut-chart`, `line-chart` is a prop-level JSDoc
comment above an interior type field, not the component's own summary — producing nonsense
entries like `app-sidebar — Stable id used with activeId.` in `llms.txt`. A first fix attempt
(anchoring a non-greedy `[\s\S]*?` to require `function` right after `*/`) was still capable
of backtracking across an intervening `*/`/`/**` pair and capturing text spanning multiple
blocks. The actual fix uses `(?:[^*]|\*(?!\/))*`, which cannot cross a `*/` boundary at all —
the capture group can only ever match within one comment block — plus a two-tier match
(prefer the block immediately before `export function`, fall back to any `function`, so
`Button`'s `function Button(...) { }` + separate `export { Button }` at file-end still
resolves correctly). The corrected function below is what Task 4 actually implements:

```js
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function firstJSDocLine(source) {
  let match = source.match(
    /\/\*\*((?:[^*]|\*(?!\/))*)\*\/\s*\n\s*export\s+(?:async\s+)?function\s/,
  );
  if (!match) {
    match = source.match(/\/\*\*((?:[^*]|\*(?!\/))*)\*\/\s*\n\s*(?:async\s+)?function\s/);
  }
  if (!match) return null;
  const lines = match[1]
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, "").trim())
    .filter(Boolean);
  return lines[0] ?? null;
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
    if (line && !line.startsWith("#") && !line.startsWith("import ") && !line.startsWith("<Meta")) {
      return line;
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
  ["## Conventions", ...docEntries("conventions")],
  ["## Patterns (guides)", ...docEntries("patterns")],
  ["## Recipes", ...docEntries("recipes")],
];

const output = `${sections.map((section) => section.join("\n")).join("\n\n")}\n`;
const outPath = join(root, "llms.txt");
writeFileSync(outPath, output);
console.error(`wrote ${outPath}`);
```

- [ ] **Step 2: Run it**

Run: `node ./scripts/generate-llms-txt.mjs`
Expected: `llms.txt` created at repo root. Open it — `Components (ui)` should show a line
for every `.tsx` file including `button — Primary interactive control for actions and
navigation.` (Task 2's JSDoc) and `(no JSDoc yet — run the component-docs skill)` for every
other component (expected — Task 9 fixes this). Doc sections list every existing `.md` file
with its first paragraph.

- [ ] **Step 3: Run the full build**

Run: `npm run build`
Expected: `tsup` build succeeds, `copy-styles.mjs` runs, `generate-llms-txt.mjs` runs,
`llms.txt` is (re)written with no errors.

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-llms-txt.mjs llms.txt
git commit -m "feat(miniapp-ui): generate llms.txt from component JSDoc and docs"
```

---

## Task 5: Verify `/mcp` on dev server and static build (ADR open item)

**Files:**
- Modify: `docs/adr/002-agent-docs-architecture.md`

- [ ] **Step 1: Check `/mcp` on the dev server**

Run: `npm run storybook` (leave running), in a second terminal run:
`curl -s http://localhost:6006/mcp -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`
Expected: a JSON-RPC response listing the addon-mcp tools (`list-all-documentation`,
`get-documentation`, etc.). Record the actual response. Stop the dev server.

- [ ] **Step 2: Check `/mcp` on the static build**

Run: `npm run build-storybook`, then serve the output: `npx serve storybook-static -l 6007`,
then in a second terminal repeat the same `curl` against `http://localhost:6007/mcp`.
Expected: either the same JSON-RPC tool list (static build supports MCP — good, cheaper to
host) or a 404/connection behavior indicating it does not (confirms the ADR's fallback: a
long-running `storybook dev`-mode process is required for hosting). Record which happened.
Stop the static server.

- [ ] **Step 3: Record the finding in the ADR**

Open `docs/adr/002-agent-docs-architecture.md`, find the "Open item — verify before relying
on the MCP path in production" section, and replace it with the confirmed answer, e.g.:

```markdown
### Resolved — static build `/mcp` support

Tested 2026-08-07: `npm run build-storybook` output served via `npx serve` [DOES / DOES NOT]
respond on `/mcp`. [If it does: static hosting is sufficient — deploy `storybook-static/`
like any static site.] [If it does not: hosting requires a long-running `storybook dev`
process; static deploy cannot serve MCP.]
```

(Fill in the actual result from Steps 1-2 — do not leave the bracketed placeholders in the
committed file.)

- [ ] **Step 4: Commit**

```bash
git add docs/adr/002-agent-docs-architecture.md
git commit -m "docs(miniapp-ui): resolve MCP static-build open item in ADR-002"
```

---

## Task 6: Create the `component-docs` skill

**Files:**
- Create: `.agent/skills/component-docs/SKILL.md` (via `skill-creator`)
- Create: `.claude/skills/component-docs` (symlink)
- Modify: `.ai/skills/component.md`
- Modify: `AGENTS.md`

**Interfaces:**
- Produces: a skill invocable as `component-docs` that Task 9 (and all future component
  work) uses. Its behavior must match Task 2's pilot exactly (same JSDoc shape, same story
  shape) — Task 9's reviewer checks output against Task 2, not against this task's skill
  wording.

- [ ] **Step 1: Invoke `skill-creator` to scaffold the skill**

Use the `skill-creator` skill (via the `Skill` tool) to create a new skill named
`component-docs` at `.agent/skills/component-docs/SKILL.md`. Supply it this exact brief as
the skill's required content — `skill-creator` should produce valid frontmatter
(`name: component-docs`, a `description` that triggers on "add docs for component X",
"update docs for component X", "migrate component X to Storybook") wrapping this body:

```markdown
# Skill: component-docs

Keep a component's JSDoc and Storybook story in sync with its current source. Used for
three cases with the same idempotent logic (always re-derive from current source, never
diff against prior output): a component that was just written, an existing component whose
props/variants changed, and one-time bulk migration of pre-existing components.

Assumes the component already exists and is exported from `src/index.ts` — this skill only
produces docs, it does not scaffold a component (see `component.md` for that).

Applies to files under `src/components/ui/`, `src/components/patterns/`, and
`src/components/charts/`.

## Steps

1. Read the component and its props type (CVA variants, inherited native element props).
2. Write or update JSDoc directly above the exported component function: Purpose (1-2
   sentences), A11y notes only if the component has non-trivial keyboard/focus behavior,
   Do/Don't only if there is a real misuse pitfall. Omit sections that don't apply — do not
   pad them. Follow the exact shape used on `Button` in `src/components/ui/button.tsx`.
3. Create or update `<name>.stories.tsx` next to the component: a `Meta` with
   `tags: ["autodocs"]`, a `Default` story, and one story per variant/size that matters (not
   the full cartesian product of every variant × every size). Follow the exact shape used in
   `src/components/ui/button.stories.tsx`.
4. Do **not** touch `docs/components/<name>.md` or `docs/patterns/<name>.md` — those are
   deleted by hand after review, not by this skill.
5. Do **not** touch `llms.txt` — it is regenerated separately by `npm run build`.

## Definition of done

- [ ] `npm run typecheck` passes
- [ ] The story renders in `storybook dev` with no console errors
- [ ] JSDoc Purpose is non-empty
- [ ] Every CVA variant/size has at least one illustrating story
```

- [ ] **Step 2: Verify the skill file**

Read `.agent/skills/component-docs/SKILL.md`. Confirm it has YAML frontmatter with `name`
and `description` fields and the body above (or an equivalent `skill-creator` produced while
preserving all five numbered steps and the DoD checklist). Fix by hand if `skill-creator`
dropped any of the five steps or the DoD list.

- [ ] **Step 3: Symlink for Claude Code discovery**

```bash
mkdir -p .claude/skills
ln -s ../../.agent/skills/component-docs .claude/skills/component-docs
```

Run: `ls -la .claude/skills/component-docs` — expected to show it as a symlink pointing to
`../../.agent/skills/component-docs`, and `cat .claude/skills/component-docs/SKILL.md`
should print the same content as `.agent/skills/component-docs/SKILL.md`.

- [ ] **Step 4: Point `.ai/skills/component.md` at the new skill**

Add this line at the end of the existing numbered list in `.ai/skills/component.md` (as item
7, after the existing item 6):

```markdown
7. After implementing, run the `component-docs` skill (`.agent/skills/component-docs/`) to
   add JSDoc + a Storybook story before considering the component done.
```

- [ ] **Step 5: Point `AGENTS.md` at `.agent/skills/`**

Add this line under the existing "## AI skills" section in `AGENTS.md`, after the table:

```markdown
Agents without native skill support (Codex, Cursor, …) should also read
[`.agent/skills/`](./.agent/skills/) directly — it holds the same skills in a host-agnostic
location; `.claude/skills/` symlinks into it for Claude Code's native discovery.
```

- [ ] **Step 6: Commit**

```bash
git add .agent/skills/component-docs .claude/skills/component-docs .ai/skills/component.md AGENTS.md
git commit -m "feat(miniapp-ui): add component-docs skill (.agent/skills, symlinked for Claude Code)"
```

---

## Task 7: Pilot prose migration — `crud` recipe

**Files:**
- Create: `docs/recipes/crud.mdx`
- Delete: `docs/recipes/crud.md`

**Interfaces:**
- Produces: the concrete MDX conversion pattern Task 8's batch migration follows exactly
  (frontmatter shape, internal-link style, git-mv-then-edit workflow).

- [ ] **Step 1: Create `docs/recipes/crud.mdx`**

```mdx
import { Meta } from "@storybook/addon-docs/blocks";

<Meta title="Recipes/CRUD" />

# Recipe: CRUD screen

## Goal

Full list + create + edit + delete for one object.

## Steps

Follow the [CRUD pattern](/?path=/docs/patterns-crud--docs). Wire React Query (or
equivalent) in the app layer.
```

(The `?path=/docs/patterns-crud--docs` link resolves once Task 8 migrates
`docs/patterns/crud.md` — until then it 404s in a locally running Storybook. That's expected
mid-rollout; both sides exist by the end of Task 8.)

- [ ] **Step 2: Delete the old file**

```bash
git rm docs/recipes/crud.md
```

- [ ] **Step 3: Verify in Storybook**

Run: `npm run storybook`, confirm a "Recipes/CRUD" entry appears in the sidebar and renders
the content above with no console errors. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add docs/recipes/crud.mdx
git commit -m "docs(miniapp-ui): migrate crud recipe to Storybook MDX (pilot)"
```

---

## Task 8: Batch-migrate remaining prose docs to MDX

**Files:**
- Create/Delete: 54 file pairs listed below (each `docs/<folder>/<name>.md` →
  `docs/<folder>/<name>.mdx`)

**Interfaces:**
- Consumes: the exact conversion pattern from Task 7 (Meta title convention:
  `"<FolderTitle>/<PageTitle>"`, e.g. `"Conventions/Folder structure"`,
  `"Foundations/Colors"`, `"Patterns/Empty"`).

For each file below: read the existing `.md`, wrap its content in an `.mdx` file with a
`<Meta title="…">` block following Task 7's exact shape, rewrite any relative link to
another doc folder (grep for `](../` to find them) into a Storybook path link
(`/?path=/docs/<folder>-<name>--docs`), `git rm` the old `.md`, and check it off. This is
mechanical and repeatable — dispatch it across multiple subagents in parallel by folder
(one agent per row below) via `superpowers:dispatching-parallel-agents`, since each file is
independent.

**`docs/recipes/` (14 remaining — `crud.md` already done in Task 7):**
- [ ] `approve-request.md` → `.mdx`
- [ ] `chart-page.md` → `.mdx`
- [ ] `create-user.md` → `.mdx`
- [ ] `data-table.md` → `.mdx`
- [ ] `delete-user.md` → `.mdx`
- [ ] `edit-user.md` → `.mdx`
- [ ] `filter-drawer.md` → `.mdx`
- [ ] `login.md` → `.mdx`
- [ ] `profile.md` → `.mdx`
- [ ] `reject-request.md` → `.mdx`
- [ ] `report-page.md` → `.mdx`
- [ ] `search-page.md` → `.mdx`
- [ ] `setting-page.md` → `.mdx`
- [ ] `upload-file.md` → `.mdx` (has a relative link to `../patterns/upload.md` — rewrite to
      `/?path=/docs/patterns-upload--docs`)

**`docs/conventions/` (17):**
- [ ] `accessibility.md` → `.mdx`
- [ ] `api.md` → `.mdx`
- [ ] `constants.md` → `.mdx`
- [ ] `empty.md` → `.mdx`
- [ ] `error-handling.md` → `.mdx`
- [ ] `folder.md` → `.mdx`
- [ ] `hooks.md` → `.mdx`
- [ ] `imports.md` → `.mdx`
- [ ] `lib.md` → `.mdx`
- [ ] `loading.md` → `.mdx`
- [ ] `naming.md` → `.mdx`
- [ ] `pages.md` → `.mdx`
- [ ] `performance.md` → `.mdx`
- [ ] `react-query.md` → `.mdx`
- [ ] `review.md` → `.mdx`
- [ ] `state.md` → `.mdx`
- [ ] `styling.md` → `.mdx`

**`docs/foundations/` (8):**
- [ ] `accessibility.md` → `.mdx`
- [ ] `animation.md` → `.mdx`
- [ ] `colors.md` → `.mdx`
- [ ] `elevation.md` → `.mdx`
- [ ] `radius.md` → `.mdx`
- [ ] `responsive.md` → `.mdx`
- [ ] `spacing.md` → `.mdx`
- [ ] `typography.md` → `.mdx`

**`docs/patterns/` (15 prose-only — the other 5 in this folder are code-backed, see Task 9):**
- [ ] `crud.md` → `.mdx` (referenced by Task 7's `crud.mdx` — must land for that link to resolve)
- [ ] `dashboard.md` → `.mdx`
- [ ] `dialog.md` → `.mdx`
- [ ] `empty.md` → `.mdx`
- [ ] `error.md` → `.mdx`
- [ ] `filter.md` → `.mdx`
- [ ] `forms.md` → `.mdx`
- [ ] `list-detail.md` → `.mdx`
- [ ] `loading.md` → `.mdx`
- [ ] `not-found.md` → `.mdx`
- [ ] `pagination.md` → `.mdx`
- [ ] `permission.md` → `.mdx`
- [ ] `table.md` → `.mdx`
- [ ] `upload.md` → `.mdx` (referenced by `docs/recipes/upload-file.mdx` above)
- [ ] `wizard.md` → `.mdx`

**Also update `docs/patterns/README.md`, `docs/recipes/README.md`, `docs/conventions/README.md`,
`docs/foundations/README.md`** (index files, left as `.md`, not story/doc entries themselves)
to strike through or remove links to files that moved, or leave them as plain-text file
listings — check each README's existing content before editing, since some may already be
simple enough to leave untouched.

- [ ] **Step (after all 54 above are checked off): Verify the full sidebar**

Run: `npm run storybook`. Expected: sidebar shows populated "Foundations", "Conventions",
"Patterns", "Recipes" categories with no broken navigation, no console errors.

- [ ] **Step: Grep for leftover relative doc links**

Run: `grep -rn '](\.\./' docs/foundations docs/conventions docs/patterns docs/recipes`
Expected: no output (all cross-references now point at Storybook paths, not relative `.md`
files).

- [ ] **Step: Commit** (can be one commit per subagent/folder, or one final commit)

```bash
git add docs/recipes docs/conventions docs/foundations docs/patterns
git commit -m "docs(miniapp-ui): migrate prose docs (recipes, conventions, foundations, patterns) to Storybook MDX"
```

---

## Task 9: Batch-run `component-docs` for the remaining 49 components

**Files:**
- Modify/Create: 49 pairs of `src/components/<dir>/<name>.tsx` (add JSDoc) +
  `src/components/<dir>/<name>.stories.tsx` (create)

**Interfaces:**
- Consumes: the `component-docs` skill from Task 6, whose behavior must match Task 2's
  `Button` pilot exactly.

For each component below, run the `component-docs` skill (Task 6) against it and check its
own Definition of Done (typecheck passes, story renders with no console errors, JSDoc
Purpose non-empty, every variant/size has a story). This is mechanical and independent per
file — dispatch across subagents via `superpowers:dispatching-parallel-agents`, grouped
by directory below.

**`src/components/ui/` (39 remaining — `button.tsx` already done in Task 2):**
- [ ] `accordion.tsx`
- [ ] `alert-dialog.tsx`
- [ ] `alert.tsx`
- [ ] `aspect-ratio.tsx`
- [ ] `avatar.tsx`
- [ ] `badge.tsx`
- [ ] `breadcrumb.tsx`
- [ ] `calendar.tsx`
- [ ] `card.tsx`
- [ ] `checkbox.tsx`
- [ ] `collapsible.tsx`
- [ ] `dialog.tsx`
- [ ] `drawer.tsx`
- [ ] `dropdown-menu.tsx`
- [ ] `empty.tsx`
- [ ] `field.tsx`
- [ ] `hover-card.tsx`
- [ ] `input.tsx`
- [ ] `label.tsx`
- [ ] `pagination.tsx`
- [ ] `popover.tsx`
- [ ] `progress.tsx`
- [ ] `radio-group.tsx`
- [ ] `scroll-area.tsx`
- [ ] `select.tsx`
- [ ] `separator.tsx`
- [ ] `sheet.tsx`
- [ ] `sidebar.tsx`
- [ ] `skeleton.tsx`
- [ ] `slider.tsx`
- [ ] `sonner.tsx`
- [ ] `spinner.tsx`
- [ ] `switch.tsx`
- [ ] `table.tsx`
- [ ] `tabs.tsx`
- [ ] `textarea.tsx`
- [ ] `toggle-group.tsx`
- [ ] `toggle.tsx`
- [ ] `tooltip.tsx`

**`src/components/patterns/` (7 — `layout.tsx` and `states.tsx` have no prior doc at all,
skill creates JSDoc+story from scratch for them; the other 5 have a `docs/patterns/*.md`
counterpart to hand-delete after review):**
- [ ] `app-sidebar.tsx`
- [ ] `confirm-dialog.tsx`
- [ ] `date-picker.tsx`
- [ ] `layout.tsx`
- [ ] `search-field.tsx`
- [ ] `sortable-list.tsx`
- [ ] `states.tsx`

**`src/components/charts/` (3):**
- [ ] `bar-chart.tsx`
- [ ] `donut-chart.tsx`
- [ ] `line-chart.tsx`

- [ ] **Step (after all 49 above are checked off): Full verification**

Run: `npm run typecheck && npm run build`
Expected: both succeed. `llms.txt` (regenerated by `build`) should now show a real
description (not "(no JSDoc yet …)") for every component.

- [ ] **Step: Visual spot-check**

Run: `npm run storybook`, spot-check 5-6 components across all three directories for
rendering + no console errors (don't need to click through all 49 — this is a sanity check,
not the DoD, which each skill run already verified per-file).

- [ ] **Step: Commit** (per-directory or per-subagent-batch commits are fine)

```bash
git add src/components
git commit -m "docs(miniapp-ui): add JSDoc + Storybook stories for remaining ui/patterns/charts components"
```

---

## After this plan (explicitly not part of it — do by hand per ADR-002)

- Delete `docs/components/*.md` (43 files) and `docs/patterns/{confirmation,search}.md` once
  Task 9's Storybook stories have been reviewed and confirmed to cover the same content.
- Decide and stand up hosting for a persistent Storybook+MCP instance (infra/ops decision).
- Decide `docs-site/`'s long-term fate (separate ADR).
- Migrate the other 6 `.ai/skills/*.md` files to `.agent/skills/` (separate, smaller task).
