# Docs Restructure Round 2 — Library vs Project Split + EN Translation

## Context

ADR-002 migrated all prose docs (`foundations/`, `conventions/`, `patterns/`, `recipes/`)
into Storybook MDX under a single "prose-only" treatment. A follow-up audit
(`docs/mdx-audience-map.md`) classified all 57 `.mdx` files by actual audience and found
that `conventions/` (17 files) and `recipes/` (15 files) are not library documentation at
all — they describe how a *consuming* Next.js/Vite mini-app should organize its own code
(folder structure, state management, API layer, page conventions, full-screen recipes).
Only `foundations/` (8 files) and `patterns/` (15 prose files) genuinely document
`@erp/miniapp-ui` itself. Four files turned out to be hybrids, mixing both audiences in one
file: `conventions/styling.mdx`, `foundations/accessibility.mdx`, `foundations/animation.mdx`,
`foundations/responsive.mdx`.

Separately, 11 files still carry Vietnamese prose fragments (mostly a one-line "Purpose"
paragraph), left over from before the docs were standardized on English documentation.

This round corrects both: split content by real audience, and translate the remaining
Vietnamese fragments to English.

## Decision

### 1. Final directory structure

```
docs/
├── foundations/                 # Library docs — stays in Storybook
│   ├── colors.mdx, spacing.mdx, radius.mdx, elevation.mdx, typography.mdx   (unchanged)
│   ├── accessibility.mdx        (trimmed — see §3)
│   ├── animation.mdx            (trimmed — see §3)
│   ├── responsive.mdx           (trimmed — see §3)
│   ├── styling.mdx              (NEW — split from conventions/styling.mdx)
│   └── README.md                (index updated with styling.mdx entry)
├── patterns/                    # Library docs — unchanged, 100% already library-only
│   └── *.mdx (15 files), README.md
├── components/                  # Untouched — out of scope, pending hand-deletion per ADR-002
├── _for-project-template/       # NEW — staging only, NOT in Storybook, manual copy-out by user
│   ├── conventions/
│   │   ├── *.md (15 unchanged files, renamed from .mdx, moved as-is)
│   │   ├── accessibility.md     (real checklist content — see §3, was a stub before)
│   │   ├── styling.md           (project half — see §3)
│   │   ├── animation.md         (NEW — project half of foundations/animation.mdx)
│   │   ├── responsive.md        (NEW — project half of foundations/responsive.mdx)
│   │   └── README.md            (moved as-is)
│   └── recipes/
│       └── *.md (15 files, renamed from .mdx, moved as-is), README.md
└── mdx-audience-map.md          # DELETED — job done, folder structure now embodies it
```

`docs/components/*.md` (43 files, code-backed, pending hand-deletion once their Storybook
stories are reviewed) is unrelated to this restructure and stays untouched.

### 2. File format change for the staging folder

Everything under `_for-project-template/` is renamed `.mdx` → `.md` and has its Storybook
boilerplate stripped (`import { Meta } from "@storybook/addon-docs/blocks";` and the
`<Meta title="..." />` line) — this folder is never rendered by Storybook, so the MDX/CSF
machinery has no purpose there.

### 3. Hybrid file splits (exact content boundaries)

**`conventions/styling.mdx` → two files:**
- → `foundations/styling.mdx` (NEW): the `## Library components` section (token-usage table
  + the two "Do not" rules about arbitrary CSS var syntax and hex/oklch literals in
  `className`). Intro line adapted to describe this as the library's own component styling
  rule, keeping the existing cross-reference to `foundations/colors.mdx`.
- → `_for-project-template/conventions/styling.md`: `## App-only chrome (shell, sidebar)`,
  `### Avoid in mini apps`, `## Optional accent backgrounds`. The `## Agent skill` section
  is **dropped**, not moved — it references `packages/miniapp-ui/.ai/skills/styling.md`,
  which no longer exists (deleted in commit `7db68e7`, "chore(skills): remove obsolete skill
  documentation files"). No replacement content; if the user wants an agent-skill pointer
  restored later, that's a separate decision outside this restructure.

**`foundations/accessibility.mdx` → mostly stays, one section moves:**
- Stays in `foundations/accessibility.mdx`: Purpose (translated), `## Rules (mandatory)`
  (Keyboard/Labels/Contrast/Semantics/Motion), `## Component expectations`, `## Do`,
  `## Don't`.
- → `_for-project-template/conventions/accessibility.md` (replaces the current stub, which
  today is just a one-line pointer): becomes real content — the `## Review checklist
  (short)` list, plus a short intro pointing back at `foundations/accessibility.mdx` (via a
  relative path, since it's now outside Storybook) for what each component already
  guarantees.

**`foundations/animation.mdx` → mostly stays, one paragraph moves:**
- Stays: Purpose (translated), `## Principles`, `## Library defaults` (trimmed — the
  "Consuming apps that need enter/exit keyframes..." paragraph and its `@import
  "tw-animate-css";` code block move out), `## Do`, `## Don't`.
- → `_for-project-template/conventions/animation.md` (NEW): just that one paragraph + code
  block, framed as a standalone "how to add enter/exit animation to your mini app" note.

**`foundations/responsive.mdx` → split by section, not by file:**
- Stays: Purpose (translated, reworded to explain why library components need consistent
  breakpoints rather than describing app screens generally), the `## Breakpoints` table,
  layout rule 1 ("Mobile first"), the `## Touch targets` guidance (library control sizing
  defaults).
- → `_for-project-template/conventions/responsive.md` (NEW): layout rules 3-5 (single-column
  forms, avoid horizontal scroll, drawer-vs-dialog choice), the `## Example` code block, and
  the full `## Do` / `## Don't` sections — all of this is about building app screens, not
  library component behavior.

### 4. Link rewrites

Every internal doc-to-doc link is checked and rewritten to match the new layout:

- **Library doc → moved project doc** (e.g. `foundations/colors.mdx`'s existing link to
  `conventions/styling` at `/docs/conventions-styling--docs`): rewritten to a relative file
  path into `_for-project-template/` (e.g. `../_for-project-template/conventions/styling.md`).
  These links exist as plain prose references from this point on (Storybook doesn't resolve
  them, but they work as normal relative links when the file is read directly on GitHub/an
  editor).
- **Project doc → project doc** (recipes ↔ conventions cross-references): stay relative, just
  adjusted for `.md` extension and the new nested path.
- **Project doc → library doc that stays in Storybook** (e.g. a recipe referencing a
  `patterns/*` composition guide): rewritten from a Storybook path to a relative file path
  back into `docs/patterns/*.mdx` (e.g. `../../patterns/upload.mdx`) — works as a plain link
  when the `_for-project-template/` content is later copied into a separate project, in which
  case the link target won't exist there either; that's expected and the user's problem to
  resolve manually when they do the copy (out of scope here).
- **Library doc → library doc** (foundations ↔ patterns): unchanged, they're both still in
  Storybook.

Concrete list of source docs whose links need checking for `](../` or `--docs` patterns
targeting a file moving out of Storybook: `foundations/colors.mdx`, `foundations/README.md`,
`patterns/dashboard.mdx`, plus every file inside the new `_for-project-template/` tree
(cross-references between recipes and conventions, and any recipe referencing a `patterns/*`
file).

### 5. Infrastructure updates (consequence of removing `conventions/`/`recipes/` from the library surface)

- **`.storybook/main.ts`**: remove the two `stories` glob entries
  `"../docs/conventions/**/*.mdx"` and `"../docs/recipes/**/*.mdx"`. Keep
  `"../docs/foundations/**/*.mdx"` and `"../docs/patterns/**/*.mdx"` (the new
  `foundations/styling.mdx` is already covered by the existing foundations glob).
- **`scripts/generate-llms-txt.mjs`**: remove the `## Conventions` and `## Recipes` sections
  (the two `docEntries("conventions")` / `docEntries("recipes")` calls and their headers) —
  otherwise the script's `readdirSync` throws once those directories no longer exist at
  `docs/conventions` / `docs/recipes`.
- **`package.json` → `files`**: remove `"docs/conventions"` and `"docs/recipes"` from the
  npm tarball allowlist. Keep `"llms.txt"`, `"docs/foundations"`, `"docs/patterns"`.
  `_for-project-template/` is never added — it's a local staging area, not something a
  consumer's `node_modules` needs.
- **`README.md`** ("For AI agents" section): update the sentence listing which `docs/`
  subfolders ship in the tarball to only mention `docs/foundations/` and `docs/patterns/`.
- **`docs/foundations/README.md`**: add the new `styling.mdx` entry to its index table/list.
- **New ADR** (`docs/adr/003-...`): records that `conventions/` and `recipes/` were
  reclassified as project-level (not library) docs and moved out of the Storybook/tarball
  surface into `_for-project-template/` for manual migration to a separate project template
  repo, superseding the relevant parts of ADR-002 §1's "Two content types" table.

### 6. Vietnamese → English translation scope

11 files, all short fragments (mostly a one-line "Purpose" paragraph), translated in the same
edit pass as the hybrid split (not a separate pass):

| File | Post-restructure location |
| --- | --- |
| `foundations/colors.mdx` | unchanged |
| `foundations/spacing.mdx` | unchanged |
| `foundations/radius.mdx` | unchanged |
| `foundations/elevation.mdx` | unchanged |
| `foundations/typography.mdx` | unchanged |
| `foundations/accessibility.mdx` | trimmed, stays |
| `foundations/animation.mdx` | trimmed, stays |
| `foundations/responsive.mdx` | trimmed, stays |
| `foundations/README.md` | unchanged path |
| `conventions/lib.mdx` | → `_for-project-template/conventions/lib.md` |
| `conventions/constants.mdx` | → `_for-project-template/conventions/constants.md` |

Excluded from translation scope:
- `docs/mdx-audience-map.md` — deleted as part of this restructure (§1), not translated first.
- `docs/superpowers/plans/2026-08-07-agent-docs-architecture.md` — execution history record,
  not reader-facing documentation.

Translation approach: preserve code blocks, token names, and component names verbatim; match
the terse Do/Don't bullet style already used throughout the English-language files (no long
prose paragraphs).

### 7. `docs/mdx-audience-map.md`

Deleted once the restructure lands — its classification work is now directly expressed by the
folder layout (§1), so keeping it around would be a second, driftable source of the same
information.

## Scope boundaries

- `docs/components/*.md` (43 files) and the 5 code-backed `docs/patterns/*.md` files
  (`app-sidebar`, `date-picker`, `sortable-list`, `confirmation`, `search`) — untouched,
  unrelated to this restructure, pending hand-deletion per ADR-002.
- `docs-site/` (Next.js showcase) — untouched, per ADR-002's existing out-of-scope ruling.
- Actually moving `_for-project-template/`'s content into a separate template repository —
  explicitly the user's own manual follow-up, not part of this work.
- No new ADA/a11y or content review beyond what's needed to relocate/translate existing text
  — this is a restructure + translation pass, not a content rewrite.
