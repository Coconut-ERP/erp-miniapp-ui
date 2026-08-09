# Architecture Decision: conventions/ and recipes/ are project-level docs, not library docs

## Status

Accepted — 2026-08-09

## Context

ADR-002 migrated all of `docs/` (`foundations/`, `conventions/`, `patterns/`, `recipes/`)
into Storybook MDX under one "prose-only, no backing component" treatment. A follow-up
per-file audit found that `conventions/` (17 files) and `recipes/` (15 files) do not
document `@erp/miniapp-ui` at all — they describe how a *consuming* Next.js/Vite mini-app
should organize its own code (folder structure, state management, API layer, page
conventions) and give full-screen copy-paste flows for a specific app's screens. Only
`foundations/` (design tokens the library ships) and `patterns/` (composition guidance for
the library's own components) are genuine library documentation.

Four files mixed both audiences in one file: `conventions/styling.mdx`,
`foundations/accessibility.mdx`, `foundations/animation.mdx`, `foundations/responsive.mdx`.

## Decision

1. `docs/foundations/` and `docs/patterns/` remain the library's documentation — stay in
   Storybook, stay in the npm tarball (`package.json` → `files`), stay in `llms.txt`.
2. `docs/conventions/` and `docs/recipes/` move to `docs/_for-project-template/`, renamed
   `.mdx` → `.md`, Storybook boilerplate stripped. This folder is **not** in Storybook, **not**
   in the npm tarball, and **not** in `llms.txt` — it exists only so the content can be
   copied by hand into a separate project template repository. Superseded from ADR-002 §1:
   the "Two content types" table's classification of these two folders as Storybook-migrated
   prose docs no longer holds.
3. The four hybrid files were split by section: the part describing the library's own
   components/tokens stays in `foundations/` (`foundations/styling.mdx` is new, carved out of
   the old `conventions/styling.mdx`); the part describing app-level setup or screen-building
   moved into `_for-project-template/conventions/`.
4. Cross-doc links were rewritten throughout to match the new locations (relative file
   paths, not Storybook `/docs/...--docs` paths, for anything crossing the library/project
   boundary).

## Consequences

- Storybook's sidebar now only shows "Foundations" and "Patterns" doc categories, plus
  component stories — smaller, but honestly scoped to what this package actually documents.
- `llms.txt` and the npm tarball are smaller; an agent reading them no longer gets app-level
  conventions mixed in with library API docs.
- `docs/_for-project-template/` is a manual, human-driven migration step — copying its
  content into a separate template repository is explicitly out of scope for any automated
  process in this package.
- `docs/mdx-audience-map.md`, the working document that produced this classification, is
  deleted — its findings are now directly expressed by the folder layout.
