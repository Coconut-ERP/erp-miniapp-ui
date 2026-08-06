# AGENTS.md — `@erp/miniapp-ui`

Guidance for coding agents touching `@erp/miniapp-ui` — whether maintaining this
package or consuming it from a mini app. The sections below are scoped by audience; read
the signpost below first.

For ERP SDK, CLI, schema, and mini-app backend rules, see the repo root [`AGENTS.md`](../../AGENTS.md).

> **Developing this library?** → Follow the full "Before coding" workflow below.
> **Using the library from another mini app?** → You do not need the maintainer sections.
>   - Need an existing component → see [docs-site](./docs-site/) or import from `@erp/miniapp-ui` (barrel `src/index.ts`).
>   - Need custom shell/sidebar/app colors → read only [`.ai/skills/styling.md`](./.ai/skills/styling.md).

## What this is

| Path | Role |
| --- | --- |
| `src/` | Library source — primitives (`components/ui/`), patterns (`components/patterns/`), tokens |
| `docs/` | Markdown docs — foundations, components, patterns, recipes, conventions |
| `docs-site/` | Live showcase (Next.js) — demos in `docs-site/src/registry/` |
| `.ai/skills/` | Agent skills — load before generating or reviewing UI |

**Purpose (keep narrow):**

1. One installable library every mini app imports — no forked `components/ui`.
2. One docs site with live demos for foundations + components + patterns.

Do not reintroduce VitePress or a second parallel docs archive.

## Before coding *(library maintainers only)*

1. Read [`ROADMAP.md`](./ROADMAP.md) — current phase, DoD, locked architecture decisions.
2. Read [`TODO.md`](./TODO.md) — pick the next unchecked item (or long-term backlog).
3. Read [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) — where files must live.
4. Follow [`CONTRIBUTING.md`](./CONTRIBUTING.md).
5. Load the relevant skill from [`.ai/skills/`](./.ai/skills/README.md) before writing UI.

## Agent rules

- **Execute phases in order.** Do not skip ahead. If the roadmap must change, propose an ADR
  under `docs/adr/`.
- **After every phase:** update `ROADMAP.md`, check off `TODO.md`, append `CHANGELOG.md`.
- **UI only.** No ERP API keys, schema, initData, or HR domain logic in this package.
- **Mini app styling:** before shell/sidebar/custom colors in `examples/miniapp-*`, read
  [`.ai/skills/styling.md`](./.ai/skills/styling.md) — semantic tokens for library
  components; Tailwind classes inline for app chrome (no `--app-*` CSS vars, no palette
  `const` objects).
- **Extract from `examples/miniapp-hr`** for primitives (shadcn + Radix + Tailwind 4 + CVA),
  then generalize — do not invent a parallel design language.
- **Public API** only via `src/index.ts` and `./styles.css` export. No deep imports from
  outside the package.
- **Stack (locked):** React 19, Tailwind CSS 4, Radix UI, CVA, lucide-react, light mode only.
- **Current status:** Phases 1–10 complete for `0.1.0`. Prefer long-term backlog / TODOs
  over re-scaffolding.
- **Docs-site Tailwind:** keep `@source` pointing at `packages/miniapp-ui/src` so component
  classes generate correctly.

## AI skills

Load from [`.ai/skills/`](./.ai/skills/README.md):

| Skill | When |
| --- | --- |
| [styling.md](./.ai/skills/styling.md) | Shell, sidebar, canvas, or custom color in mini apps |
| [component.md](./.ai/skills/component.md) | New feature/domain component |
| [page.md](./.ai/skills/page.md) | New route / page orchestration |
| [pattern.md](./.ai/skills/pattern.md) | Reusable pattern composition |
| [recipe.md](./.ai/skills/recipe.md) | Full-page recipe docs |
| [review.md](./.ai/skills/review.md) | Code review against library standards |

Optional: `accessibility-review.md`, `performance-review.md`, `refactor.md`.

## Commands

```bash
# library
cd packages/miniapp-ui
npm install
npm run typecheck
npm run build
npm pack

# docs showcase
cd packages/miniapp-ui/docs-site
npm install
npm run dev          # http://localhost:5173
```

## Conventions

- Component files: kebab-case (`alert-dialog.tsx`); exports: PascalCase (`AlertDialog`).
- Doc files: `docs/components/<name>.md` matching the component.
- New library exports must be re-exported from `src/index.ts` and noted in `CHANGELOG.md`.
- Component checklist: tokens from `globals.css`, CVA variants, a11y, doc page, barrel export.

## What does not belong here

- ERP schema, API routes, initData session logic → mini apps / `erp-sdk`
- HR domain components → `examples/miniapp-hr` until generalized as recipes
- Secrets, `.env`, workspace-specific display names
