# ERP MiniApp UI — Roadmap

Package: `@erp/miniapp-ui`  
Source of truth for UI primitives: extract from `examples/miniapp-hr` (shadcn + Radix + Tailwind 4 + CVA).  
Status legend: `[ ]` pending · `[~]` in progress · `[x]` done

---

## Architecture decisions (locked unless changed via ADR)

| Decision | Choice | Rationale |
| --- | --- | --- |
| Stack | React 19 + Tailwind CSS 4 + Radix UI + CVA + lucide-react | Matches `miniapp-hr`; proven in production mini apps |
| Package layout | `packages/miniapp-ui` inside `erp-sdk` repo | Ship UI with the same release channel as the SDK |
| Publish | GitHub Release tarball (same as `erp-sdk`) | No private npm registry required yet |
| CSS | Ship `styles/globals.css` with design tokens; consumer imports it | Tokens stay versioned with components |
| Dark mode | Out of scope (light-only, like ERP shell) | Long-term backlog |
| Docs language | Vietnamese primary; English summaries where useful | Matches repo docs convention |
| AI skills | `.ai/skills/` under this package + installable skill | Phase 7 |

If any of these must change, stop and propose an ADR in `docs/adr/` before coding.

---

## Phase 1 — UI Library Foundation

**Status:** `[x]` done (2026-08-05)

### Goal

Hoàn thiện package `@erp/miniapp-ui` để có thể build, pack và dùng được từ mọi Mini App.

### Deliverables

- [x] `package.json` (name, peerDeps, exports, scripts)
- [x] `tsconfig.json` (strict)
- [x] `src/styles/globals.css` (tokens + base)
- [x] `src/lib/utils.ts` (`cn`)
- [x] `src/index.ts` (public barrel)
- [x] `README.md` (install + quick start)
- [x] Build via `tsup` → `dist/` (ESM + types)
- [x] `npm pack` succeeds
- [x] Release notes template for GitHub Release (`RELEASE.md`)

### Checklist

- [x] Folder structure matches `PROJECT_STRUCTURE.md`
- [x] Exports map: `.` and `./styles.css`
- [x] Peer dependencies declared: `react`, `react-dom`
- [x] Typecheck passes
- [x] Build produces usable artifacts
- [x] README documents consumer Tailwind setup

### Definition of Done

Package builds cleanly, packs to `.tgz`, and a consumer can `import { … } from "@erp/miniapp-ui"` after linking the tarball (even if only `cn` is exported initially).

### Dependencies

None (first phase).

### Review criteria

- [x] Public API surface is intentional and documented
- [x] No secrets or app-specific HR logic in the package
- [x] Aligns with `PROJECT_STRUCTURE.md`

---

## Phase 2 — Design Foundation

**Status:** `[x]` done (2026-08-05)

### Goal

Tài liệu hóa nền tảng Design System (tokens + rules) mà components phải tuân theo.

### Deliverables

- [x] `docs/foundations/colors.md`
- [x] `docs/foundations/typography.md`
- [x] `docs/foundations/spacing.md`
- [x] `docs/foundations/radius.md`
- [x] `docs/foundations/elevation.md`
- [x] `docs/foundations/animation.md`
- [x] `docs/foundations/responsive.md`
- [x] `docs/foundations/accessibility.md`
- [x] `docs/foundations/README.md` (index)

### Checklist

- [x] Tokens in docs match CSS variables in `globals.css`
- [x] Breakpoints documented and used consistently
- [x] A11y rules cover focus, contrast, keyboard, labels
- [x] Icon guideline referenced (lucide-react)

### Definition of Done

Every foundation topic has a doc; CSS tokens and docs do not contradict each other.

### Dependencies

Phase 1 (globals.css must exist).

### Review criteria

- [x] A designer or engineer can theme a mini app from the docs alone
- [x] No orphan tokens; no undocumented CSS variables used by components

---

## Phase 3 — Component Library

**Status:** `[x]` done (2026-08-05)

### Goal

Hoàn thiện bộ component primitives; mỗi component có tài liệu đầy đủ.

### Deliverables

Components (migrate/adapt from `miniapp-hr`):

- [x] Button, Input, Textarea, Select, Label, Field
- [x] Badge, Card, Separator, Avatar, Skeleton, Spinner
- [x] Checkbox, Switch (add if missing), Radio Group (add if missing)
- [x] Dialog, Alert Dialog, Drawer (add if missing)
- [x] Dropdown Menu, Popover, Tooltip (add as needed)
- [x] Tabs, Accordion (add if missing)
- [x] Alert, Empty, Toast (Sonner)
- [x] Table, Pagination (add if missing)
- [x] Scroll Area

Docs under `docs/components/<name>.md` with: Purpose, Import, Props, Variants, Sizes, A11y, Do/Don't, Example, API, Source.

### Checklist

- [x] Every exported component has a matching doc
- [x] Components use tokens, not hard-coded colors
- [x] `data-slot` attributes preserved for styling hooks
- [x] Barrel exports updated in `src/index.ts`
- [x] Typecheck + build green

### Definition of Done

Core set above is exported, documented, and buildable; no HR-domain coupling.

### Dependencies

Phase 1, Phase 2.

### Review criteria

- [x] Props API is stable and typed
- [x] A11y section present per component
- [x] Examples copy-paste clean

---

## Phase 4 — UI Patterns

**Status:** `[x]` done (2026-08-05)

### Goal

Chuẩn hóa cách kết hợp component thành pattern tái sử dụng.

### Deliverables

Code under `src/patterns/` + docs under `docs/patterns/`:

- [x] forms, search, crud, table, filter, pagination
- [x] dialog-flow, confirmation
- [x] loading, error, empty, not-found, permission
- [x] upload, wizard
- [x] dashboard-card, statistic-card
- [x] list-detail, master-detail

### Checklist

- [x] Each pattern composes library components only
- [x] Doc explains when to use / when not to use
- [x] Loading / empty / error strategies are consistent

### Definition of Done

Documented patterns cover the CRUD + state surfaces used by typical mini apps.

### Dependencies

Phase 3.

### Review criteria

- [x] Patterns do not re-implement primitives
- [x] Naming matches convention docs (Phase 6 may refine)

---

## Phase 5 — Recipes

**Status:** `[x]` done (2026-08-05)

### Goal

Copy-ready flows for common ERP mini-app screens.

### Deliverables

`docs/recipes/`:

- [x] login, profile, crud
- [x] approve-request, reject-request
- [x] create-user, edit-user, delete-user
- [x] setting-page, search-page, data-table
- [x] upload-file, filter-drawer
- [x] report-page, chart-page (stub OK if charts deferred)

### Checklist

- [x] Each recipe references patterns + components
- [x] Includes schema/API notes where ERP-specific
- [x] Marked as recipe (not a runtime dependency)

### Definition of Done

An engineer can implement a listed flow by following one recipe end-to-end.

### Dependencies

Phase 4.

### Review criteria

- [x] Recipes stay framework-agnostic where possible (Next.js notes OK)
- [x] No hardcoded API keys or workspace secrets

---

## Phase 6 — Engineering Convention

**Status:** `[x]` done (2026-08-05)

### Goal

Chuẩn hóa cách tổ chức code trong mọi Mini App dùng thư viện này.

### Deliverables

`docs/conventions/`:

- [x] folder.md, naming.md, imports.md
- [x] hooks.md, state.md, api.md, react-query.md
- [x] error-handling.md, loading.md, empty.md
- [x] accessibility.md, performance.md, review.md

### Checklist

- [x] Conventions align with `miniapp-hr` lessons
- [x] Review checklist is actionable for PRs
- [x] Import rules match package exports

### Definition of Done

Conventions are the single source of truth for app structure reviews.

### Dependencies

Phase 3–5 (patterns inform conventions).

### Review criteria

- [x] New mini apps can scaffold folders from these docs
- [x] AI agents can follow without guessing

---

## Phase 7 — AI Coding Standard

**Status:** `[x]` done (2026-08-05)

### Goal

Skill files để AI sinh / review code theo chuẩn Senior + thư viện này.

### Deliverables

`.ai/skills/`:

- [x] component.md, pattern.md, page.md, recipe.md, review.md
- [x] Optional: accessibility-review.md, performance-review.md, refactor.md
- [x] Install notes (mirror `erp skill install` pattern if useful)

### Checklist

- [x] Skills reference ROADMAP phases and docs paths
- [x] Skills forbid inventing components outside the library
- [x] Skills require foundation + a11y compliance

### Definition of Done

An agent with only these skills produces UI consistent with the library.

### Dependencies

Phase 2–6.

### Review criteria

- [x] Skills are actionable, not aspirational prose
- [x] Cross-links to docs are valid

---

## Phase 8 — Documentation Website

**Status:** `[x]` done (2026-08-05)

### Goal

Site kiểu shadcn/MUI: browse foundations, components, patterns, recipes.

### Deliverables

- [x] Docs site app (e.g. Next.js under `apps/miniapp-ui-docs` or `packages/miniapp-ui/docs-site`)
- [x] Sections: Getting Started, Installation, Foundations, Components, Patterns, Recipes, Conventions, Changelog
- [x] Live preview + copy code + props tables + search

### Checklist

- [x] MD docs render without drift from source
- [x] Component previews import from `@erp/miniapp-ui`
- [x] Mobile-usable navigation

### Definition of Done

Docs site builds and covers all published public APIs.

### Dependencies

Phase 2–7 (content must exist).

### Review criteria

- [x] No broken links
- [x] Preview matches real component behavior

---

## Phase 9 — Miniapp Reference

**Status:** `[x]` done (2026-08-05)

### Goal

Mini App chuẩn (`examples/miniapp-ui-kit/`) dùng `@erp/miniapp-ui` end-to-end.

### Deliverables

- [x] ERP bootstrap, auth, initData bridge, API client, schema
- [x] Layout + navigation
- [x] CRUD demo + states (loading/empty/error)
- [x] Deploy notes + best practices README

### Checklist

- [x] Depends on published/packed `@erp/miniapp-ui`
- [x] No local copy of UI primitives
- [x] `schema check --offline` clean

### Definition of Done

New projects can clone the reference and replace domain objects only.

### Dependencies

Phase 1–6 (Phase 8 nice-to-have).

### Review criteria

- [x] Follows convention docs
- [x] Uses patterns/recipes, not one-off UI

---

## Phase 10 — Release Pipeline

**Status:** `[x]` done (2026-08-05)

### Goal

Quy trình phát hành lặp lại được cho mọi Mini App cùng một phiên bản UI.

### Deliverables

- [x] Scripts: typecheck, lint, build, pack
- [x] CHANGELOG discipline + semver
- [x] GitHub Release + tarball publish steps
- [x] Version bump checklist

### Checklist

- [x] CI (or documented manual) gate before release
- [x] CHANGELOG entry per release
- [x] Tag format agreed (`@erp/miniapp-ui@x.y.z` or `miniapp-ui-vX.Y.Z`)

### Definition of Done

A release can be cut by following a short checklist with zero tribal knowledge.

### Dependencies

Phase 1 (minimum); full value after Phase 3+.

### Review criteria

- [x] Reproducible from a clean clone
- [x] Artifacts match declared version

---

## Long term (backlog)

- Design Token Generator / Figma tokens
- Dark mode (if ERP shell supports)
- Charts, Data Grid, Rich Editor
- Virtual Table, i18n
- A11y audit, performance benchmarks
- Migration guide, `create-miniapp` CLI

---

## Progress log

| Date | Note |
| --- | --- |
| 2026-08-05 | Phases 1–10 completed: package, foundations, components, patterns, recipes, conventions, AI skills, Next.js docs-site, miniapp-ui-kit, release pipeline |
| 2026-08-06 | Removed obsolete `docs-site-md-archive` (old VitePress markdown); AGENTS.md clarified (library + docs-site only) |
| 2026-08-06 | Added Sidebar + Sheet, Collapsible, Breadcrumb, Progress, Slider, Toggle, Toggle Group, Hover Card, Aspect Ratio |
|
