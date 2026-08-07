# Architecture Decision: AI-agent access to docs (Storybook + MCP + llms.txt)

## Status

Accepted — 2026-08-07

## Context

Coding agents working in mini-app repos that consume `@erp/miniapp-ui` currently have no
reliable way to read this library's docs or skills. The published tarball only ships
`dist/`, `README.md`, `CHANGELOG.md` (`package.json` → `files`) — `docs/` and `.ai/skills/`
never leave the source repo. The Next.js `docs-site` is human-facing and not agent-friendly
(no query interface, requires browsing multiple pages).

Options considered: shipping `docs/`/`.ai/skills/` inside the tarball, a hand-built MCP
server, a shadcn-style `registry.json`, and adopting Storybook + `@storybook/addon-mcp`
(official, released 2026-02-13). Storybook + addon-mcp was chosen because it removes the
doc-drift problem at the source (agents query the running component, not a hand-maintained
copy) and ships official tooling instead of a custom server to maintain.

A second question surfaced during design: `docs/` has five categories
(`components`, `patterns`, `recipes`, `conventions`, `foundations`), and they cross-reference
each other (e.g. `docs/recipes/crud.md` → `docs/patterns/crud.md`). A subset of
`docs/patterns/*.md` documents real exported components
(`app-sidebar`, `date-picker`, `sortable-list`, `confirm-dialog`); the rest of `patterns/`,
plus all of `conventions/` and `foundations/`, is prose with no backing component. Any
solution that only migrates `recipes/` leaves the other four categories — and every
cross-reference into them — exactly as undistributed as before. The decision below covers
all five categories, split by whether they have backing code.

## Decision

### 1. Two content types, two different treatments

| Type | Examples | Treatment |
| --- | --- | --- |
| **Code-backed** — real exported component with props | `src/components/ui/*.tsx` (40), `src/components/patterns/*.tsx` (7: `app-sidebar`, `confirm-dialog`, `date-picker`, `layout`, `search-field`, `sortable-list`, `states`), `src/components/charts/*.tsx` (3: `bar-chart`, `donut-chart`, `line-chart`) — 50 total | JSDoc on the component (Purpose / A11y / Do-Don't) + Storybook CSF story with `autodocs`. Props table is generated from TS types (react-docgen), not hand-written. |
| **Prose-only** — guidance with no single backing component | `docs/recipes/*.md` (15), `docs/conventions/*.md` (17), `docs/foundations/*.md` (8), 15 of the 20 `docs/patterns/*.md` files (the other 5 — `app-sidebar`, `date-picker`, `sortable-list`, `confirmation`↔`ConfirmDialog`, `search`↔`SearchField` — document real components and are code-backed instead) — 55 total | Ported to Storybook **MDX docs pages** (not CSF stories), one Storybook sidebar category per doc folder (Foundations / Conventions / Patterns / Recipes). Cross-references between them become in-Storybook links instead of relative `.md` paths. |

`docs/components/*.md` is retired once Storybook stories cover the same component — deleted
by hand after review, not automatically (see Rollout, Phase E).

### 2. JSDoc is the source of truth for component-level docs

Written directly on the exported component/props type in the `.tsx` file, not in a sibling
file. Two reasons:
- **Colocation prevents drift** — the reason this whole redesign exists is that
  `docs/components/*.md` already drifts from the component it describes.
- **It ships in `dist/index.d.ts` for free** — `tsup` preserves JSDoc in generated
  declarations, and `dist/` is already in `package.json` → `files`. An agent in a consumer
  repo gets Purpose/A11y/Do-Don't from `node_modules/@erp/miniapp-ui/dist/index.d.ts` (or
  editor hover) with **zero MCP, zero network, zero config** — the one fallback path that
  survives even if nothing else in this ADR is reachable.

### 3. `llms.txt` is generated, never hand-edited

A build script (`scripts/generate-llms-txt.mjs`) reads the Storybook story/docs-page index
and writes `llms.txt` at the package root: one line per component and one line per prose doc
page, each with a short description. Runs as part of `npm run build`. `llms.txt` and all
four prose-only doc folders (`docs/foundations/`, `docs/conventions/`, `docs/patterns/`,
`docs/recipes/` — `.mdx` after Phase D) are added to `package.json` → `files` so this — like
`dist/index.d.ts` — ships in the tarball with zero network dependency. The static fallback
covers all prose content uniformly, not recipes alone.

### 4. MCP is an interface, not a data store

`@storybook/addon-mcp` exposes the running Storybook's stories and docs pages at `/mcp` — it
holds no copy of its own. Consuming this requires the agent's host to be configured with the
endpoint (e.g. an entry in `.mcp.json`); this is a **manual, per-repo, one-time step**.
Installing the npm tarball does not auto-wire MCP. MCP is an enhancement layer on top of the
`dist/index.d.ts` + `llms.txt` baseline (§2, §3), never the only path — if the hosted
Storybook instance is unreachable, agents still have the static baseline.

### 5. The `component-docs` skill

A reusable skill that keeps §1/§2 in sync, used for three cases with the same logic
(idempotent — always re-derives from current source, no attempt at smart diffing):
new component just written, existing component whose props/variants changed, and one-time
bulk migration of the 50 components that predate this ADR.

**Location:** `.agent/skills/component-docs/SKILL.md` (canonical) with
`.claude/skills/component-docs/SKILL.md` as a symlink to it, so Claude Code auto-discovers it
natively while the content stays host-agnostic. `AGENTS.md` gets one line pointing at
`.agent/skills/` for agents (Codex, Cursor, …) that have no native skill mechanism but do
read `AGENTS.md`. Created using the `skill-creator` skill, not hand-written.

**Scope:** assumes the component already exists and is exported from `src/index.ts` — it
only produces docs, it does not scaffold a component. Applies to both
`src/components/ui/*.tsx`, `src/components/patterns/*.tsx`, and `src/components/charts/*.tsx`.

**Steps:**
1. Read the component + its props type (CVA variants, inherited native props).
2. Write/update JSDoc on the exported component: Purpose (1-2 sentences), A11y notes if the
   component has non-trivial keyboard/focus behavior, Do/Don't if there's a real misuse
   pitfall — omit sections that don't apply rather than padding them.
3. Create/update `<name>.stories.tsx` next to the component: `Meta` with
   `tags: ['autodocs']`, a `Default` story, plus one story per variant/size that matters
   (not the full cartesian product).
4. Does **not** touch `docs/components/<name>.md` — removed by hand later (Phase E).
5. Does **not** touch `llms.txt` — regenerated separately by the build script (§3).

**Definition of done (self-checked by the skill before reporting complete):**
- [ ] `npm run typecheck` passes
- [ ] The story renders in `storybook dev` with no console errors
- [ ] JSDoc Purpose is non-empty
- [ ] Every CVA variant/size has at least one illustrating story

`.ai/skills/component.md` (existing "Create Component" skill) gets one line added pointing
to `component-docs` as the final step of creating a component — nothing else in the existing
`.ai/skills/` structure changes.

### 6. Storybook infrastructure

- Config at `.storybook/` (package root, sibling to `docs-site/`, fully separate config).
  Builder: `@storybook/react-vite` (the library is not a Next app; Vite is the standard
  modern Storybook builder) with a Tailwind 4 Vite plugin. Addons:
  `@storybook/addon-docs` (autodocs) and `@storybook/addon-mcp`.
- `stories` glob covers `src/components/**/*.stories.tsx` (§1 code-backed) and
  `docs/{foundations,conventions,patterns,recipes}/**/*.mdx` (§1 prose-only).
- New `package.json` scripts: `storybook` (dev server, serves `/mcp`), `build-storybook`
  (static build — used for CI/visual verification; does **not** serve `/mcp`, confirmed below —
  hosting `/mcp` requires the long-running dev process).
- README gets a "For AI agents" section pointing at `llms.txt` and explaining how to add the
  MCP endpoint once one is hosted (left as an explicit placeholder, not a guessed URL).

### Resolved — static build `/mcp` support

Tested 2026-08-07: `npm run storybook` (dev server, port 6006) responds on `POST /mcp` with a
`200` JSON-RPC `tools/list` result (`preview-stories`, `get-storybook-story-instructions`,
`get-changed-stories`, `get-stories-by-component`, `list-all-documentation`,
`get-documentation`, `get-documentation-for-story`). The `npm run build-storybook` output
(`storybook-static/`), served via `npx serve storybook-static -l 6007`, returns a plain `404`
on the same `POST /mcp` request — no MCP route exists in the static output.

Conclusion: static hosting is **not** sufficient. `/mcp` is only served by the live
`storybook dev` process (it registers the endpoint on its dev middleware server; `storybook
build` never emits one). Hosting the MCP path in production requires running a long-running
`storybook dev`-mode process — a static deploy of `storybook-static/` can serve the docs UI
but cannot serve `/mcp`.

Separately: Storybook needs component **source** to run, so only one centrally hosted
instance can ever serve `/mcp` — a consumer repo cannot spin up its own Storybook from just
`node_modules/@erp/miniapp-ui` (it only has `dist/`, no `.stories.tsx`). Deciding *where*
that one instance is hosted and who operates it is an infrastructure decision **outside this
package repo's scope** (see Out of scope below) — this ADR only commits to this repo shipping
the tooling that makes such hosting possible.

## Rollout phases

| Phase | Work |
| --- | --- |
| A | Storybook + addon-mcp setup, `llms.txt` generator script, `package.json` changes (`files`, scripts, devDeps) |
| B | Create `component-docs` skill via `skill-creator` at `.agent/skills/` + `.claude/skills/` symlink; add pointer line to `.ai/skills/component.md` |
| C | Verify whether `build-storybook` (static) serves `/mcp`; record the answer and its hosting consequence |
| D | Migrate all prose-only docs (§1 table) to `.mdx`: `recipes/*` (15), `conventions/*` (17), `foundations/*` (8), 15 of the 20 `patterns/*` files; rewrite cross-references to in-Storybook links |
| E | Run `component-docs` skill against the 50 code-backed components (40 `ui/` + 7 `patterns/` + 3 `charts/`, batched across subagents); after review, hand-delete the now-redundant `docs/components/*.md` and `docs/patterns/{confirmation,search}.md` files |

## Out of scope (explicit, to prevent scope creep during implementation)

- `docs-site/` (Next.js showcase) — untouched. Superseded by Storybook long-term, but that
  replacement is a separate future decision/ADR, not part of this rollout.
- The other 6 files in `.ai/skills/` (`page.md`, `pattern.md`, `recipe.md`, `review.md`,
  `styling.md`, `README.md`) — untouched, stay in the old structure for now. Only
  `component.md` gets a one-line addition.
- Hosting a persistent, publicly reachable Storybook+MCP instance — infra/ops decision, not
  a code change in this repo.
- Deleting `docs/components/*.md` — done by hand after Phase E, not automated.
- A dedicated skill for recipes/prose docs — not built; §1's prose-only migration is a
  one-time mechanical pass, not a repeatable skill.

## Consequences

- `docs/patterns/*.md` splits across two different future homes — this is intentional (§1),
  not an oversight: 5 files (`app-sidebar`, `date-picker`, `sortable-list`, `confirmation`,
  `search`) retire like `docs/components/*.md` once their Storybook story exists; the other
  15 move to `.mdx`. No file is left behind in the old location once Phase D/E finish.
- New standing devDependencies: `storybook`, `@storybook/react-vite`, `@storybook/addon-docs`,
  `@storybook/addon-mcp`.
- New operational responsibility: keeping a long-running `storybook dev` instance reachable
  if the MCP path is to work for any consumer repo — a static `build-storybook` deploy cannot
  serve `/mcp` (confirmed above).
- `package.json` → `files` must include `llms.txt`, `docs/foundations/`, `docs/conventions/`,
  `docs/patterns/`, and `docs/recipes/` (all `.mdx` after Phase D) so the zero-infra fallback
  keeps working for every prose category, not just recipes, even after the MCP path exists.
