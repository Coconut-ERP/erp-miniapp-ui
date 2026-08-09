# Docs Restructure Round 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split `docs/` so only genuine `@erp/miniapp-ui` library documentation (`foundations/`, `patterns/`) stays in Storybook, move project-level docs (`conventions/`, `recipes/`) to a `.md` staging folder outside Storybook for manual migration to a separate project template, and translate the last Vietnamese fragments to English.

**Architecture:** `docs/conventions/` and `docs/recipes/` (32 files) move wholesale to `docs/_for-project-template/` with `.mdx`→`.md` and Storybook boilerplate stripped. Four hybrid files get split by section: the library-relevant part stays/lands in `foundations/`, the project-relevant part lands in `_for-project-template/conventions/`. Every cross-doc link is rewritten to match the new locations. Storybook config, the `llms.txt` generator, and the npm tarball allowlist are updated to stop referencing the two folders that left. An ADR records the decision.

**Tech Stack:** Storybook 10 MDX (`@storybook/addon-docs`), plain Markdown, Node (`scripts/generate-llms-txt.mjs`).

**Spec:** [docs/superpowers/specs/2026-08-09-docs-restructure-round2-design.md](../specs/2026-08-09-docs-restructure-round2-design.md) — read it before starting.

## Global Constraints

- Only `foundations/` and `patterns/` remain library docs (Storybook + npm tarball); `conventions/` and `recipes/` are project-level docs and move to `docs/_for-project-template/`, out of Storybook, renamed `.md`.
- `docs/_for-project-template/` is never added to `package.json` → `files` (not shipped in the tarball) and never added to `.storybook/main.ts`'s `stories` glob.
- The four hybrid files split by exact section per the spec §3 — do not improvise different boundaries.
- Every internal doc link that crosses the library/project boundary, or whose target moved, gets rewritten to a relative file path (never left as a Storybook `/docs/...--docs` path pointing at something no longer in Storybook).
- Vietnamese fragments translate to English inline with whatever edit already touches that file — no separate translation-only pass.
- `docs/components/*.md` (43 files) and the 5 code-backed `docs/patterns/*.md` files are untouched — unrelated, pending hand-deletion per ADR-002.
- `docs-site/` is untouched.

---

## Task 1: Move `conventions/` + `recipes/` to `_for-project-template/`

**Files:**
- Move + rename `.mdx`→`.md` (32 files): all of `docs/conventions/*.mdx` → `docs/_for-project-template/conventions/*.md`, all of `docs/recipes/*.mdx` → `docs/_for-project-template/recipes/*.md`. `docs/conventions/README.md` and `docs/recipes/README.md` move as `README.md` (already `.md`, no rename needed).

**Interfaces:**
- Produces: `docs/_for-project-template/conventions/` and `docs/_for-project-template/recipes/` directories with 32 files (17 + 15), each with Storybook boilerplate stripped. Task 2 edits content inside these same files (links, translation). Task 3/4 create/rewrite specific files inside `_for-project-template/conventions/` (`styling.md`, `accessibility.md`, plus new `animation.md`/`responsive.md`) — this task must land first.

This is mechanical and repeatable — do it yourself in one session, sequentially (no parallel sub-agents, to avoid git/file-state conflicts).

**Conventions (17, `docs/conventions/<name>.mdx` → `docs/_for-project-template/conventions/<name>.md`):**
- [ ] `accessibility.mdx` → `.md`
- [ ] `api.mdx` → `.md`
- [ ] `constants.mdx` → `.md`
- [ ] `empty.mdx` → `.md`
- [ ] `error-handling.mdx` → `.md`
- [ ] `folder.mdx` → `.md`
- [ ] `hooks.mdx` → `.md`
- [ ] `imports.mdx` → `.md`
- [ ] `lib.mdx` → `.md`
- [ ] `loading.mdx` → `.md`
- [ ] `naming.mdx` → `.md`
- [ ] `pages.mdx` → `.md`
- [ ] `performance.mdx` → `.md`
- [ ] `react-query.mdx` → `.md`
- [ ] `review.mdx` → `.md`
- [ ] `state.mdx` → `.md`
- [ ] `styling.mdx` → `.md`
- [ ] `README.md` → moves as-is

**Recipes (15, `docs/recipes/<name>.mdx` → `docs/_for-project-template/recipes/<name>.md`):**
- [ ] `approve-request.mdx` → `.md`
- [ ] `chart-page.mdx` → `.md`
- [ ] `create-user.mdx` → `.md`
- [ ] `crud.mdx` → `.md`
- [ ] `data-table.mdx` → `.md`
- [ ] `delete-user.mdx` → `.md`
- [ ] `edit-user.mdx` → `.md`
- [ ] `filter-drawer.mdx` → `.md`
- [ ] `login.mdx` → `.md`
- [ ] `profile.mdx` → `.md`
- [ ] `reject-request.mdx` → `.md`
- [ ] `report-page.mdx` → `.md`
- [ ] `search-page.mdx` → `.md`
- [ ] `setting-page.mdx` → `.md`
- [ ] `upload-file.mdx` → `.md`
- [ ] `README.md` → moves as-is

**For each file:** `git mv docs/<folder>/<name>.mdx docs/_for-project-template/<folder>/<name>.md`, then remove the first 3 lines (the `import { Meta } from "@storybook/addon-docs/blocks";` line, the blank line after it, and the `<Meta title="..." />` line + the blank line after that) — every file in `docs/conventions/` and `docs/recipes/` has this exact 4-line header. Leave everything else in the file untouched for now (content fixes are Task 2+).

- [ ] **Step 1: Move and strip all 32 files per the lists above**

- [ ] **Step 2: Verify the move**

Run:
```bash
ls docs/conventions docs/recipes 2>&1
```
Expected: `No such file or directory` for both (old paths gone).

Run:
```bash
find docs/_for-project-template -name "*.md" | wc -l
```
Expected: `32`.

Run:
```bash
grep -rl "^import { Meta }" docs/_for-project-template/ ; grep -rl "^<Meta" docs/_for-project-template/
```
Expected: no output (boilerplate fully stripped).

- [ ] **Step 3: Commit**

```bash
git add docs/_for-project-template docs/conventions docs/recipes
git commit -m "docs(miniapp-ui): move conventions/ and recipes/ to _for-project-template/ (.mdx -> .md)"
```

---

## Task 2: Fix links and stale references inside the moved files, translate 2 files

**Files:**
- Modify: `docs/_for-project-template/conventions/empty.md`, `folder.md`, `loading.md`, `pages.md`, `README.md`, `lib.md`, `constants.md`
- Modify: `docs/_for-project-template/recipes/crud.md`, `upload-file.md`

**Interfaces:**
- Consumes: files created by Task 1.

- [ ] **Step 1: Fix internal conventions↔conventions links (relative, `.md` extension, same folder)**

In `docs/_for-project-template/conventions/folder.md`, find:
```
See [pages](/docs/conventions-pages--docs), [constants](/docs/conventions-constants--docs), [lib](/docs/conventions-lib--docs).
```
Replace with:
```
See [pages](./pages.md), [constants](./constants.md), [lib](./lib.md).
```

In `docs/_for-project-template/conventions/pages.md`, find:
```
7. **Copy from `constants/`** — titles, empty/error strings live in `src/constants/pages.ts` (see [constants](/docs/conventions-constants--docs)). Date helpers live in `src/lib/date.ts` (see [lib](/docs/conventions-lib--docs)).
8. **Extract feature UI** — rich list cards / sections belong in `components/features/`, not inline in `*-page.tsx` (see [folder](/docs/conventions-folder--docs)).
```
Replace with:
```
7. **Copy from `constants/`** — titles, empty/error strings live in `src/constants/pages.ts` (see [constants](./constants.md)). Date helpers live in `src/lib/date.ts` (see [lib](./lib.md)).
8. **Extract feature UI** — rich list cards / sections belong in `components/features/`, not inline in `*-page.tsx` (see [folder](./folder.md)).
```

- [ ] **Step 2: Fix conventions → patterns links (cross into Storybook, relative path up two levels)**

(`docs/_for-project-template/conventions/accessibility.md`'s own link to `foundations/accessibility`
is skipped here — Task 4 replaces this file's entire content with real checklist content
that already has the correct final links, so editing it now would just be overwritten.)

In `docs/_for-project-template/conventions/empty.md`, find:
```
See [patterns/empty](/docs/patterns-empty--docs). Distinguish empty vs error vs forbidden.
```
Replace with:
```
See [patterns/empty](../../patterns/empty.mdx). Distinguish empty vs error vs forbidden.
```

In `docs/_for-project-template/conventions/loading.md`, find:
```
See [patterns/loading](/docs/patterns-loading--docs).
```
Replace with:
```
See [patterns/loading](../../patterns/loading.mdx).
```

- [ ] **Step 3: Fix recipes → patterns links (cross into Storybook, relative path up two levels)**

In `docs/_for-project-template/recipes/crud.md`, find:
```
Follow the [CRUD pattern](/docs/patterns-crud--docs). Wire React Query (or
```
Replace with:
```
Follow the [CRUD pattern](../../patterns/crud.mdx). Wire React Query (or
```

In `docs/_for-project-template/recipes/upload-file.md`, find:
```
See [patterns/upload](/docs/patterns-upload--docs). Show filename + progress + toast.
```
Replace with:
```
See [patterns/upload](../../patterns/upload.mdx). Show filename + progress + toast.
```

- [ ] **Step 4: Fix stale "Storybook" reference in `docs/_for-project-template/conventions/README.md`**

Current content:
```md
# Conventions

Engineering standards for mini apps using `@erp/miniapp-ui`.

See these topics in Storybook under "Conventions":

- Pages — `page.tsx` is server; client UI in `components/page/`; early-return
- Styling — colors: semantic tokens for UI; inline Tailwind for app shell
- Folder — recommended layout
- Constants — page copy, nav, labels
- Lib — erp / api / client / date helpers
```
Replace with:
```md
# Conventions

Engineering standards for mini apps using `@erp/miniapp-ui`.

Topics in this folder:

- [pages.md](./pages.md) — `page.tsx` is server; client UI in `components/page/`; early-return
- [styling.md](./styling.md) — colors: semantic tokens for UI; inline Tailwind for app shell
- [folder.md](./folder.md) — recommended layout
- [constants.md](./constants.md) — page copy, nav, labels
- [lib.md](./lib.md) — erp / api / client / date helpers
```

- [ ] **Step 5: Translate `docs/_for-project-template/conventions/lib.md`**

Replace the file's content with:
```md
# Lib

Shared non-UI code under `src/lib/`.

## Layout

```text
lib/
  erp/       # createMiniApp, assertSchema, session, records helpers
  api/       # withAuth wrappers, list/create domain functions used by route handlers
  client/    # browser api() + initData bridge (may be imported only from client modules)
  date.ts    # todayISO / todayLocal — pure, safe on server and client
  format.ts  # display formatting (optional)
```

## Rules

1. Prefer **pure functions** with no React imports.
2. Server-only ERP secrets stay in `lib/erp` / API routes — never import `lib/erp/app` from client components.
3. Date helpers used by both API (`Production.Date`) and Assign form live in `lib/date.ts` — do not redefine `todayLocal` inside a page.
4. Domain types stay in `domain/` (or `lib/domain/`); `lib/api` imports them, pages import hooks that call `lib/client`.

```ts
// src/lib/date.ts
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Local calendar day for <input type="date"> */
export function todayLocal(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}
```
```

- [ ] **Step 6: Translate `docs/_for-project-template/conventions/constants.md`**

Replace the file's content with:
```md
# Constants

Static, serializable values used by pages and shell. Prefer `src/constants/*.ts`.

## Rules

1. **No React** — no JSX, no hooks, no `"use client"`.
2. **No I/O** — no `fetch`, no ERP client, no `process.env`.
3. Group by surface: `pages.ts` (headers / empty / error), `nav.ts` (shell links), `status.ts` (badges/labels).
4. Page early-returns import the same constant object so `PageHeader` copy is not duplicated by hand.
5. ERP **field display names** stay in `lib/erp/schema.ts` (`F`, `OBJECTS`) — not in `constants/`.

```ts
// src/constants/pages.ts
export const FACTORIES_PAGE = {
  header: {
    title: "Factories",
    description: "List of active factories…",
  },
  errorTitle: "Failed to load factory list",
  empty: {
    title: "No factories yet",
    description: "Create a Factory record in the workspace…",
  },
} as const;
```

```tsx
// components/page/factories-page.tsx
import { FACTORIES_PAGE } from "@/constants/pages";

if (isLoading) {
  return (
    <>
      <PageHeader {...FACTORIES_PAGE.header} />
      <LoadingRows rows={4} />
    </>
  );
}
```
```

- [ ] **Step 7: Verify no stale Storybook-path links remain**

Run:
```bash
grep -rn '](/docs/\|--docs' docs/_for-project-template/
```
Expected: no output.

Run:
```bash
grep -rlP '[\x{00C0}-\x{1EF9}]' docs/_for-project-template/conventions/lib.md docs/_for-project-template/conventions/constants.md
```
Expected: no output (no Vietnamese diacritics remain).

- [ ] **Step 8: Commit**

```bash
git add docs/_for-project-template
git commit -m "docs(miniapp-ui): fix cross-references and translate lib/constants in _for-project-template"
```

---

## Task 3: Split `conventions/styling.mdx` — create `foundations/styling.mdx`, trim the moved project copy

**Files:**
- Create: `docs/foundations/styling.mdx`
- Modify: `docs/_for-project-template/conventions/styling.md`
- Modify: `docs/foundations/README.md`

**Interfaces:**
- Consumes: `docs/_for-project-template/conventions/styling.md` as moved by Task 1 (still has the full original content at this point — this task trims it).

- [ ] **Step 1: Create `docs/foundations/styling.mdx`**

```mdx
import { Meta } from "@storybook/addon-docs/blocks";

<Meta title="Foundations/Styling" />

# Styling

How `@erp/miniapp-ui` components use design tokens. Library internals follow the same
token rules documented in [foundations/colors](/docs/foundations-colors--docs).

## Library components

Use semantic Tailwind tokens mapped from the design system:

| Use | Classes |
| --- | --- |
| Page canvas | `bg-surface`, `bg-background` |
| Text | `text-foreground`, `text-muted-foreground` |
| Cards / panels | `bg-card`, `border-border` |
| Actions | `bg-primary text-primary-foreground`, `variant="outline"` on `Button` |
| Status | `text-destructive`, `text-success`, `Badge` variants |

Do **not** reference design tokens via arbitrary CSS variable syntax in JSX
(`bg-[var(--primary)]`). The utilities `bg-primary`, `text-muted-foreground`, etc.
already wrap those variables.

Do **not** add hex / oklch literals in component `className` strings.
```

- [ ] **Step 2: Trim `docs/_for-project-template/conventions/styling.md` to the project half**

Replace the file's entire content with:
```md
# Styling & colors

Rules for mini apps consuming `@erp/miniapp-ui`. Library internals follow the same
token rules in [foundations/colors](../../foundations/colors.mdx).

## App-only chrome (shell, sidebar)

Shell layout is **not** part of `@erp/miniapp-ui`. Style it with Tailwind palette
utilities written **directly** on each element:

```tsx
<aside className="… bg-sky-100 …">
<div className="… bg-sky-50/80 …">
<div className="… bg-white …">
```

### Avoid in mini apps

1. **Custom `:root` variables** such as `--app-sidebar`, `--app-canvas` — duplicates
   the design system and forces `bg-[var(--…)]` syntax.
2. **Palette constant objects** (`const SHELL = { … }`) — colors belong on the JSX
   element, not in an indirection layer.
3. **`bg-[var(--token)]`** for tokens that already have Tailwind classes.

Reference implementation: `examples/miniapp-ui-kit/src/components/app-shell.tsx`.

## Optional accent backgrounds

Feature cards may use light palette tints for KPI emphasis (`bg-sky-50`, `ring-sky-100/80`)
when paired with semantic text colors. Follow `examples/miniapp-workshop` /
`examples/miniapp-ui-kit` feature components.
```

(The original file's "## Agent skill" section, which pointed at the now-deleted
`.ai/skills/styling.md`, is dropped entirely — not moved anywhere.)

- [ ] **Step 3: Add `styling.mdx` to `docs/foundations/README.md`'s topic line**

Find:
```
See these topics in Storybook under "Foundations": Colors, Typography, Spacing, Radius,
Elevation / shadow, Animation, Responsive, Accessibility.
```
Replace with:
```
See these topics in Storybook under "Foundations": Colors, Typography, Spacing, Radius,
Elevation / shadow, Animation, Responsive, Accessibility, Styling.
```

- [ ] **Step 4: Verify in Storybook**

Run: `npm run storybook`, confirm "Foundations/Styling" appears in the sidebar and renders
with no console errors. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add docs/foundations/styling.mdx docs/_for-project-template/conventions/styling.md docs/foundations/README.md
git commit -m "docs(miniapp-ui): split styling into foundations/styling.mdx (library) + project copy"
```

---

## Task 4: Split `foundations/accessibility.mdx` — trim in place, write real content into the project copy

**Files:**
- Modify: `docs/foundations/accessibility.mdx`
- Modify: `docs/_for-project-template/conventions/accessibility.md`

**Interfaces:**
- Consumes: `docs/_for-project-template/conventions/accessibility.md`, already fixed for its internal links by Task 2 Step 2 (still has only the stub 1-liner content at this point — this task adds real content).

- [ ] **Step 1: Replace `docs/foundations/accessibility.mdx` with the trimmed, translated version**

```mdx
import { Meta } from "@storybook/addon-docs/blocks";

<Meta title="Foundations/Accessibility" />

# Accessibility

## Purpose

Mini apps must be usable with a keyboard, a screen reader, and sufficient contrast in a
light-only portal.

## Rules (mandatory)

### Keyboard

- Every interactive control is focusable in a sensible order.
- Dialogs / menus use Radix focus trap + Esc to dismiss.
- Do not remove focus outlines — library uses `focus-visible:ring-*`.

### Labels

- Inputs have visible `<Label>` or `aria-label`.
- Icon-only buttons require `aria-label`.
- Error text is linked via `aria-invalid` / describedby patterns (Field component).

### Contrast

- Prefer token pairs (`primary` + `primary-foreground`, `muted-foreground` on `background`).
- Do not place `muted-foreground` on `muted` for critical information.

### Semantics

- Use correct elements (`button`, `a`, headings) — don't fake buttons with `div` + onClick.
- Status messages: `role="status"` / `role="alert"` where appropriate (Alert, toast).

### Motion

- Respect `prefers-reduced-motion` for decorative motion.

## Component expectations

Every component doc must include an **Accessibility** section covering keyboard, ARIA, and focus.

## Do

- Keep hit areas adequate on mobile.
- Announce async results via toast/live regions when the UI changes out of view.

## Don't

- Don't use `outline-none` without a visible replacement ring.
- Don't rely on color alone for status (pair with text/icon).
- Don't disable scrolling on `body` without restoring it after overlays close (Radix handles this when used correctly).
```

- [ ] **Step 2: Replace `docs/_for-project-template/conventions/accessibility.md` with the real checklist**

```md
# Accessibility convention

PR checklist for mini-app screens built with `@erp/miniapp-ui`. See the library's own
accessibility rules at [foundations/accessibility](../../foundations/accessibility.mdx) for
what each component already guarantees. See also the general PR checklist at
[review](./review.md).

## Review checklist

- [ ] Tab through the view — no traps except intentional modal traps
- [ ] Screen-reader label present for icon buttons
- [ ] Errors associated with fields
- [ ] Contrast OK for text and focus ring on surfaces used
```

- [ ] **Step 3: Verify**

Run:
```bash
grep -cP '[\x{00C0}-\x{1EF9}]' docs/foundations/accessibility.mdx
```
Expected: `0`.

Run: `npm run storybook`, confirm "Foundations/Accessibility" still renders with no console
errors and no longer shows a "Review checklist" section. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add docs/foundations/accessibility.mdx docs/_for-project-template/conventions/accessibility.md
git commit -m "docs(miniapp-ui): split accessibility, translate library half, real checklist in project copy"
```

---

## Task 5: Split `foundations/animation.mdx` — trim in place, create the project copy

**Files:**
- Modify: `docs/foundations/animation.mdx`
- Create: `docs/_for-project-template/conventions/animation.md`

- [ ] **Step 1: Replace `docs/foundations/animation.mdx` with the trimmed, translated version**

```mdx
import { Meta } from "@storybook/addon-docs/blocks";

<Meta title="Foundations/Animation" />

# Animation

## Purpose

Motion supports hierarchy and feedback, not decoration.

## Principles

1. **Short** — micro-interactions 150–250ms; overlays 200–300ms.
2. **Purposeful** — open/close, state change, progress — not perpetual decoration.
3. **Respect reduced motion** — honor `prefers-reduced-motion` for non-essential animation.

## Library defaults

Components from the shadcn/Radix lineage use:

- `transition-all` / `transition-colors` on controls
- Focus ring transitions
- Dialog/overlay enter-exit via Radix + CSS

## Do

- Animate opacity/transform on overlays.
- Keep button press feedback subtle (`active:translate-y-px` pattern already in Button).

## Don't

- Don't add looping ambient animations on data screens.
- Don't block interaction waiting for long entrance animations.
- Don't animate layout width/height when transform/opacity suffice.
```

- [ ] **Step 2: Create `docs/_for-project-template/conventions/animation.md`**

```md
# Animation setup

`@erp/miniapp-ui` does not bundle `tw-animate-css`. If your mini app needs Radix
enter/exit keyframe animations (dialogs, overlays), add it yourself:

```css
@import "tw-animate-css";
```

(as `miniapp-hr` does) until the library optionally re-exports animation helpers.
```

- [ ] **Step 3: Verify**

Run:
```bash
grep -cP '[\x{00C0}-\x{1EF9}]' docs/foundations/animation.mdx
```
Expected: `0`.

Run: `npm run storybook`, confirm "Foundations/Animation" still renders with no console
errors. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add docs/foundations/animation.mdx docs/_for-project-template/conventions/animation.md
git commit -m "docs(miniapp-ui): split animation, translate library half, add project setup note"
```

---

## Task 6: Split `foundations/responsive.mdx` — trim in place, create the project copy

**Files:**
- Modify: `docs/foundations/responsive.mdx`
- Create: `docs/_for-project-template/conventions/responsive.md`

- [ ] **Step 1: Replace `docs/foundations/responsive.mdx` with the trimmed, translated version**

```mdx
import { Meta } from "@storybook/addon-docs/blocks";

<Meta title="Foundations/Responsive" />

# Responsive

## Purpose

Library components run inside the ERP shell across both a desktop sidebar layout and a
mobile webview, so they share one consistent breakpoint scale.

## Breakpoints

Uses Tailwind defaults:

| Prefix | Min width | Typical |
| --- | --- | --- |
| (none) | 0 | Mobile webview |
| `sm` | 640px | Large phone / small tablet |
| `md` | 768px | Tablet / narrow desktop embed |
| `lg` | 1024px | Desktop shell content |
| `xl` | 1280px | Wide desktop |

## Component defaults

1. **Mobile first** — base styles for narrow; enhance at `md`/`lg`.
2. **Touch targets** — controls ≥ 32px height (`h-8` library default); prefer larger on primary mobile CTAs when needed.
```

- [ ] **Step 2: Create `docs/_for-project-template/conventions/responsive.md`**

```md
# Responsive

Mini apps run inside the ERP shell: desktop sidebar + mobile webview. Screen layouts must
work in both. See [foundations/responsive](../../foundations/responsive.mdx) for the
breakpoint scale library components use.

## Layout rules

1. **Single column forms** on mobile; multi-column only from `md` up.
2. **Avoid horizontal scroll** for primary flows.
3. **Drawers** on mobile where desktop uses dialogs/side panels.

## Example

```tsx
<div className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
  {/* fields */}
</div>
```

## Do

- Test critical flows at ~390px and ~1280px widths.
- Collapse secondary nav into sheets/drawers on small screens.

## Don't

- Don't hide essential actions behind hover-only affordances.
- Don't assume desktop pointer precision in the embedded shell.
```

- [ ] **Step 3: Verify**

Run:
```bash
grep -cP '[\x{00C0}-\x{1EF9}]' docs/foundations/responsive.mdx
```
Expected: `0`.

Run: `npm run storybook`, confirm "Foundations/Responsive" still renders with no console
errors. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add docs/foundations/responsive.mdx docs/_for-project-template/conventions/responsive.md
git commit -m "docs(miniapp-ui): split responsive, translate library half, add project layout rules"
```

---

## Task 7: Translate the remaining pure-library foundations files

**Files:**
- Modify: `docs/foundations/colors.mdx`
- Modify: `docs/foundations/spacing.mdx`
- Modify: `docs/foundations/radius.mdx`
- Modify: `docs/foundations/elevation.mdx`
- Modify: `docs/foundations/typography.mdx`
- Modify: `docs/foundations/README.md`

- [ ] **Step 1: `docs/foundations/colors.mdx` — translate Purpose, fix the stale conventions link**

Find:
```
Semantic color tokens cho surface, text, action, status. Tất cả map qua `:root` → `@theme inline` → utility Tailwind (`bg-primary`, `text-destructive`, …).
```
Replace with:
```
Semantic color tokens for surface, text, action, status. All map through `:root` → `@theme inline` → Tailwind utilities (`bg-primary`, `text-destructive`, …).
```

Find:
```
- Don't add mini-app shell variables (`--app-sidebar`, …) or `bg-[var(--…)]` — see [conventions/styling](/docs/conventions-styling--docs).
```
Replace with:
```
- Don't add mini-app shell variables (`--app-sidebar`, …) or `bg-[var(--…)]` — see [conventions/styling](../_for-project-template/conventions/styling.md).
```

- [ ] **Step 2: `docs/foundations/spacing.mdx` — translate 2 lines**

Find:
```
Nhịp khoảng cách nhất quán giữa layout, form và list.
```
Replace with:
```
Consistent spacing rhythm across layout, forms, and lists.
```

Find:
```
Dùng Tailwind spacing scale (4px base):
```
Replace with:
```
Uses the Tailwind spacing scale (4px base):
```

- [ ] **Step 3: `docs/foundations/radius.mdx` — translate Purpose**

Find:
```
Bo góc thống nhất cho control, card và overlay.
```
Replace with:
```
Consistent corner radius for controls, cards, and overlays.
```

- [ ] **Step 4: `docs/foundations/elevation.mdx` — translate 3 lines**

Find:
```
Phân tầng bề mặt bằng màu + border trước; shadow dùng sparingly cho overlay.
```
Replace with:
```
Layer surfaces with color + border first; use shadow sparingly, for overlays only.
```

Find:
```
ERP mini apps ưu tiên **flat + border** (portal đã có chrome riêng).
```
Replace with:
```
ERP mini apps favor **flat + border** (the portal already provides its own chrome).
```

Find:
```
Không định nghĩa custom shadow tokens trong Phase 2 — dùng Tailwind defaults cho đến khi có nhu cầu brand.
```
Replace with:
```
No custom shadow tokens defined yet — use Tailwind defaults until there's a real brand need.
```

- [ ] **Step 5: `docs/foundations/typography.mdx` — translate Purpose**

Find:
```
Hệ chữ thống nhất, đọc tốt trên portal ERP (desktop + mobile webview).
```
Replace with:
```
A unified type system that reads well across the ERP portal (desktop + mobile webview).
```

- [ ] **Step 6: `docs/foundations/README.md` — translate remaining Vietnamese**

Find:
```
Nền tảng Design System của `@erp/miniapp-ui`. Mọi component, pattern và recipe phải tuân theo các tài liệu này và khớp với CSS variables trong `src/styles/globals.css`.
```
Replace with:
```
Design system foundation for `@erp/miniapp-ui`. Every component and pattern must follow
these docs and match the CSS variables in `src/styles/globals.css`.
```

Find:
```
1. **Tokens first** — dùng CSS variables / Tailwind theme colors (`bg-primary`, `text-muted-foreground`), không hard-code hex/oklch trong component.
2. **Light only** — ERP shell nhúng mini app ở chế độ sáng. Không bật dark theme trừ khi roadmap long-term mở khóa.
3. **One language** — stack visual lấy từ `miniapp-hr` (oklch, radius 0.7rem, primary blue-violet).
4. **Icons** — dùng [lucide-react](https://lucide.dev); kích thước mặc định 16px trong button (`size-4`).
```
Replace with:
```
1. **Tokens first** — use CSS variables / Tailwind theme colors (`bg-primary`, `text-muted-foreground`), never hard-code hex/oklch in a component.
2. **Light only** — the ERP shell embeds mini apps in light mode. Dark theme stays off unless the long-term roadmap unlocks it.
3. **One language** — the visual stack comes from `miniapp-hr` (oklch, 0.7rem radius, blue-violet primary).
4. **Icons** — use [lucide-react](https://lucide.dev); default size 16px inside buttons (`size-4`).
```

(Note: this file already gained a `styling.mdx` mention in Task 3 Step 3 — that edit is untouched by this step, this step only translates the Vietnamese paragraphs.)

- [ ] **Step 7: Verify no Vietnamese remains anywhere in `docs/foundations/`**

Run:
```bash
grep -rlP '[\x{00C0}-\x{1EF9}]' docs/foundations/
```
Expected: no output.

Run: `npm run storybook`, spot-check 3-4 of the edited pages (Colors, Spacing, Elevation)
render with no console errors. Stop the server.

- [ ] **Step 8: Commit**

```bash
git add docs/foundations/colors.mdx docs/foundations/spacing.mdx docs/foundations/radius.mdx docs/foundations/elevation.mdx docs/foundations/typography.mdx docs/foundations/README.md
git commit -m "docs(miniapp-ui): translate remaining Vietnamese foundations content to English"
```

---

## Task 8: Fix `patterns/` cross-references to the moved project docs

**Files:**
- Modify: `docs/patterns/dashboard.mdx`
- Modify: `docs/patterns/crud.mdx`

- [ ] **Step 1: `docs/patterns/dashboard.mdx` — fix the recipe link**

Find:
```
Grid of `StatisticCard` + `DashboardCard` panels. Charts: `BarChart` / `DonutChart` / `LineChart` — pass data only (see [chart-page recipe](/docs/recipes-chart-page--docs)).
```
Replace with:
```
Grid of `StatisticCard` + `DashboardCard` panels. Charts: `BarChart` / `DonutChart` / `LineChart` — pass data only (see [chart-page recipe](../_for-project-template/recipes/chart-page.md)).
```

- [ ] **Step 2: `docs/patterns/crud.mdx` — fix the stale "Phase 5" recipes mention**

Find:
```
See recipes in Phase 5 for full screen copy-paste flows.
```
Replace with:
```
See recipes under `docs/_for-project-template/recipes/` for full screen copy-paste flows.
```

- [ ] **Step 3: Verify**

Run:
```bash
grep -rn '](/docs/\|--docs\|Phase 5' docs/patterns/dashboard.mdx docs/patterns/crud.mdx
```
Expected: no output.

Run: `npm run storybook`, confirm "Patterns/Dashboard" and "Patterns/CRUD" still render with
no console errors. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add docs/patterns/dashboard.mdx docs/patterns/crud.mdx
git commit -m "docs(miniapp-ui): fix patterns/ cross-references to moved project docs"
```

---

## Task 9: Update Storybook config, llms.txt generator, tarball allowlist, README

**Files:**
- Modify: `.storybook/main.ts`
- Modify: `scripts/generate-llms-txt.mjs`
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: the final `docs/foundations/` and `docs/patterns/` state from Tasks 3-8 (must run after those, since it changes what the build considers "the library docs").

- [ ] **Step 1: Remove the two stale globs from `.storybook/main.ts`**

Find:
```ts
  stories: [
    "../src/components/**/*.stories.tsx",
    "../docs/foundations/**/*.mdx",
    "../docs/conventions/**/*.mdx",
    "../docs/patterns/**/*.mdx",
    "../docs/recipes/**/*.mdx",
  ],
```
Replace with:
```ts
  stories: [
    "../src/components/**/*.stories.tsx",
    "../docs/foundations/**/*.mdx",
    "../docs/patterns/**/*.mdx",
  ],
```

- [ ] **Step 2: Remove the Conventions/Recipes sections from `scripts/generate-llms-txt.mjs`**

Find:
```js
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
```
Replace with:
```js
const sections = [
  ["# @erp/miniapp-ui — LLM overview"],
  ["## Components (ui)", ...componentEntries("ui")],
  ["## Components (patterns)", ...componentEntries("patterns")],
  ["## Components (charts)", ...componentEntries("charts")],
  ["## Foundations", ...docEntries("foundations")],
  ["## Patterns (guides)", ...docEntries("patterns")],
];
```

- [ ] **Step 3: Update `package.json`'s `files` array**

Find:
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
  ],
```
Replace with:
```json
  "files": [
    "dist",
    "README.md",
    "CHANGELOG.md",
    "llms.txt",
    "docs/foundations",
    "docs/patterns"
  ],
```

(Exact current formatting/quoting may differ slightly — apply the same removal of the
`"docs/conventions"` and `"docs/recipes"` entries regardless of exact whitespace.)

- [ ] **Step 4: Update the "For AI agents" section in `README.md`**

Find:
```
- `docs/foundations/`, `docs/conventions/`, `docs/patterns/`, `docs/recipes/` (shipped as
  `.mdx`) ship inside this package for the same zero-network reason.
```
Replace with:
```
- `docs/foundations/` and `docs/patterns/` (shipped as `.mdx`) ship inside this package for
  the same zero-network reason — these are the library's own docs. `docs/conventions/` and
  `docs/recipes/` were project-level docs, not library docs; they've moved to
  `docs/_for-project-template/` for manual migration into a separate project template and no
  longer ship with this package.
```

- [ ] **Step 5: Rebuild and verify**

Run:
```bash
npm run typecheck && npm run build
```
Expected: both succeed. Open the regenerated `llms.txt` at the repo root — confirm it has no
`## Conventions` or `## Recipes` section anymore, only `## Foundations` and
`## Patterns (guides)` among the doc sections.

Run:
```bash
npm run pack:check
```
Expected: tarball listing shows `docs/foundations/*` and `docs/patterns/*` but no
`docs/conventions/*` or `docs/recipes/*` entries.

Run: `npm run storybook`, confirm the sidebar now shows only "Foundations" and "Patterns"
top-level doc categories (plus the component story categories) — no "Conventions" or
"Recipes". No console errors. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add .storybook/main.ts scripts/generate-llms-txt.mjs package.json README.md llms.txt
git commit -m "chore(miniapp-ui): drop conventions/recipes from Storybook, llms.txt, and npm tarball"
```

---

## Task 10: Write ADR-003, delete the audience-map working doc

**Files:**
- Create: `docs/adr/003-conventions-recipes-are-project-docs.md`
- Delete: `docs/mdx-audience-map.md`

- [ ] **Step 1: Create the ADR**

```md
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
```

- [ ] **Step 2: Delete the audience-map file**

```bash
git rm docs/mdx-audience-map.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/adr/003-conventions-recipes-are-project-docs.md
git commit -m "docs(miniapp-ui): add ADR-003, remove mdx-audience-map.md (superseded by folder layout)"
```
