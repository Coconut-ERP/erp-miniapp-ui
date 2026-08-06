# Contributing to `@erp/miniapp-ui`

## Principles

1. **Roadmap order.** Finish the current phase before starting the next. Do not skip phases.
2. **Docs track code.** After every phase: update `ROADMAP.md`, `TODO.md`, and `CHANGELOG.md`.
3. **No domain leakage.** This package is UI only — no ERP API keys, schemas, or HR business rules.
4. **Propose before pivoting.** Stack and publish decisions are locked in `ROADMAP.md`. Open an ADR in `docs/adr/` if they must change.

## Workflow

```bash
cd packages/miniapp-ui
npm install          # or bun install
npm run typecheck
npm run build
npm pack             # verify tarball
```

1. Read `ROADMAP.md` — confirm current phase and Definition of Done.
2. Pick the next unchecked item in `TODO.md`.
3. Implement; keep public exports in `src/index.ts`.
4. Add/update docs under `docs/` for the phase.
5. Run typecheck + build.
6. Update progress files (`ROADMAP` / `TODO` / `CHANGELOG`).

## Component checklist (Phase 3+)

For each new component:

- [ ] Purpose clear; no overlap with an existing export
- [ ] Uses design tokens from `globals.css`
- [ ] Typed props + variants via CVA when applicable
- [ ] Accessibility: keyboard, focus ring, labels / `aria-*`
- [ ] Doc at `docs/components/<name>.md` (Purpose, Import, Props, Variants, Sizes, A11y, Do/Don't, Example, API, Source)
- [ ] Re-exported from `src/index.ts`
- [ ] CHANGELOG `[Unreleased]` entry

## Commit messages

Follow repo convention: `<type>(miniapp-ui): <subject>`

Examples:

- `feat(miniapp-ui): add button and input primitives`
- `docs(miniapp-ui): add colors foundation`
- `chore(miniapp-ui): scaffold package exports`

## Review

Use the phase **Review criteria** in `ROADMAP.md` plus `docs/conventions/review.md` once Phase 6 exists.
