# AGENTS.md — `@erp/miniapp-ui`

Guidance for coding agents touching `@erp/miniapp-ui` — whether maintaining this
package or consuming it from a mini app. The sections below are scoped by audience; read
the signpost below first.

> **Developing this library?** → Follow the full "Before coding" workflow below.
> **Using the library from another mini app?** → You do not need the maintainer sections.
>   - Need an existing component → see [docs-site](./docs-site/) or import from `@erp/miniapp-ui` (barrel `src/index.ts`).
>   - Need custom shell/sidebar/app colors → read only [`docs/foundations/colors.mdx`](./docs/foundations/colors.mdx).

## What this is

| Path | Role |
| --- | --- |
| `src/` | Library source — primitives (`components/ui/`), patterns (`components/patterns/`), tokens |
| `docs/` | MDX docs — `foundations/`, `patterns/` (component docs live as JSDoc + Storybook stories instead) |
| `docs-site/` | Live showcase (Next.js) — demos in `docs-site/src/registry/`; being superseded by Storybook (see ADR-002) |
| `.storybook/` | Storybook config — component stories + MDX docs, `@storybook/addon-mcp` for agent querying |
| `.agent/skills/` | Agent skills (canonical) — load before generating or reviewing UI; `.claude/skills/` symlinks here for Claude Code |

**Purpose (keep narrow):**

1. One installable library every mini app imports — no forked `components/ui`.
2. One live component/docs surface for foundations + components + patterns — Storybook
   going forward (see ADR-002); `docs-site` stays until the migration is complete.

Do not reintroduce VitePress or a second parallel docs archive.

## Before coding *(library maintainers only)*

1. Read [`ROADMAP.md`](./ROADMAP.md) — current phase, DoD, locked architecture decisions.
2. Read [`TODO.md`](./TODO.md) — pick the next unchecked item (or long-term backlog).
3. Read [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) — where files must live.
4. Follow [`CONTRIBUTING.md`](./CONTRIBUTING.md).
5. Load the relevant skill from [`.agent/skills/`](./.agent/skills/) before writing UI.

## Agent rules

- **Execute phases in order.** Do not skip ahead. If the roadmap must change, propose an ADR
  under `docs/adr/`.
- **After every phase:** update `ROADMAP.md`, check off `TODO.md`, append `CHANGELOG.md`.
- **UI only.** No ERP API keys, schema, initData, or HR domain logic in this package.
- **Mini app styling:** before shell/sidebar/custom colors in a consuming mini app, read
  [`docs/foundations/colors.mdx`](./docs/foundations/colors.mdx) — semantic tokens for library
  components; Tailwind classes inline for app chrome (no `--app-*` CSS vars, no palette
  `const` objects).
- **Primitive shape (locked):** shadcn + Radix + Tailwind 4 + CVA — do not invent a parallel
  design language.
- **Public API** only via `src/index.ts` and `./styles.css` export. No deep imports from
  outside the package.
- **Stack (locked):** React 19, Tailwind CSS 4, Radix UI, CVA, lucide-react, light mode only.
- **Current status:** Phases 1–10 complete (see `ROADMAP.md`); current release is tracked in
  `package.json` / `CHANGELOG.md`. Prefer long-term backlog / TODOs over re-scaffolding.
- **Docs-site Tailwind:** keep `@source` pointing at this repo's `src/` so component
  classes generate correctly.

## AI skills

Canonical skills live at [`.agent/skills/`](./.agent/skills/); `.claude/skills/` symlinks
into it for Claude Code's native discovery. Agents without native skill support (Codex,
Cursor, …) should read `.agent/skills/` directly.

| Skill | When |
| --- | --- |
| [component-docs](./.agent/skills/component-docs/SKILL.md) | New/changed component in `src/components/ui`, `patterns`, or `charts` — bring JSDoc + Storybook story up to date |

## Commands

```bash
# library
npm install
npm run typecheck
npm run build
npm pack

# Storybook
npm run storybook        # http://localhost:6006, live /mcp endpoint
npm run build-storybook  # static build (no /mcp — that's dev-server only)

# docs showcase (Next.js, being superseded by Storybook)
cd docs-site
npm install
npm run dev          # http://localhost:5173
```

## Conventions

- Component files: kebab-case (`alert-dialog.tsx`); exports: PascalCase (`AlertDialog`).
- Component docs: JSDoc on the exported component + `<name>.stories.tsx` (see
  `component-docs` skill) — not `docs/components/*.md`, which no longer exists.
- New library exports must be re-exported from `src/index.ts` and noted in `CHANGELOG.md`.
- Component checklist: tokens from `globals.css`, CVA variants, a11y, JSDoc + story, barrel export.

## What does not belong here

- Secrets, `.env`, workspace-specific display names
