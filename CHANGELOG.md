# Changelog

All notable changes to `@erp/miniapp-ui` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.5.0] - 2026-09-24

### Added

- `AppSidebar` collapse toggle — the header now renders a desktop collapse button that shrinks the sidebar to an icon-only rail (labels become `sr-only`, submenus close, icons keep a `title` tooltip). New props: `collapsible` (default `true`), `collapsed`, `defaultCollapsed`, `onCollapsedChange`; the root exposes `data-collapsed`

## [0.4.0] - 2026-09-21

### Added

- `WeekPicker` / `WeekPickerProps` — ISO week period picker (Popover + Calendar). Clicking any day selects its whole Monday→Sunday week; the value is a `"YYYY-Www"` string (e.g. `"2026-W12"`) and the trigger reads `Tuần 12, 16/03–22/03/2026`. Controlled/uncontrolled and `fromYear`/`toYear` behave as in `MonthPicker`
- `vitest` + `@testing-library/react` test setup and an `npm test` script, covering `WeekPicker` value formatting/parsing, week selection, week-year boundaries, and controlled/uncontrolled state

## [0.3.9] - 2026-09-20

### Changed

- `StatisticCard` now places its label above the metric value, renders hints as text-only, and shows the existing optional `icon` beside its trend percentage.

## [0.3.8] - 2026-09-17

### Fixed

- `Switch` (and `Checkbox`, `RadioGroup`, `Field`, `Tabs`, `Slider`, `Separator`, `ScrollArea`, and every dialog/menu/popover overlay) never reflected their Radix state visually — e.g. toggling a `Switch` fired `onCheckedChange` but the track stayed grey and the thumb never slid. Tailwind's bare `data-*:` shorthand compiles to an attribute-presence selector (`[data-checked]`), while Radix renders `data-state="checked"`, so the rules could not match. `styles.css` now declares `data-checked`, `data-unchecked`, `data-open`, `data-closed`, `data-active`, `data-vertical`, and `data-horizontal` as `@custom-variant`s targeting the attributes Radix actually emits

## [0.3.7] - 2026-09-17

### Changed

- `Table` `stickyHeader` now styles `TableHeader` through context instead of a descendant selector, so a consumer `className` (e.g. `bg-card`) wins over the default sticky background

## [0.3.6] - 2026-09-17

### Added

- `Table` opt-in `stickyHeader` prop — pins `<thead>` while the body scrolls; the table container owns the vertical scroll (needs a height-bounded parent), combinable with `stickyHorizontalScrollbar`

## [0.3.5] - 2026-09-17

### Added

- `Table` opt-in `stickyHorizontalScrollbar` prop — keeps the horizontal scrollbar pinned to the bottom of the table's visible area inside a fixed-height `overflow-y-auto` parent (scroll position synced both ways; scroll container focusable for keyboard scrolling)

## [0.3.4] - 2026-08-21

### Added

- `MonthPicker` — Popover with year nav + 3×4 month grid; value `"YYYY-MM"`
- `YearPicker` — Popover with decade nav + year grid; value `"YYYY"`

## [0.3.3] - 2026-08-21

### Fixed

- `SelectContent` default `position` to `popper` so the menu aligns under the trigger (was `item-aligned`)

## [0.3.2] - 2026-08-11

### Fixed

- `Combobox` list scroll inside Dialog (manual wheel handling + `pointer-events-auto` on content)
- `PopoverContent` optional `container` prop to portal into Dialog (scroll-lock friendly)

## [0.3.1] - 2026-08-11

### Added

- `Combobox` pattern — searchable single-select (`options` + optional `onSearch` callback for consumer-owned / remote filtering, `loading`, `clearable`)

## [0.3.0] - 2026-08-10

### Added

- Storybook 10 + `@storybook/addon-mcp` — live, queryable component docs (`npm run storybook`, `npm run build-storybook`)
- JSDoc (Purpose / A11y / Do-Don't) on all 50 components, source of truth for component docs, ships in `dist/index.d.ts`
- Generated `llms.txt` (one-file LLM overview of components, foundations, and patterns), shipped in the npm tarball
- `component-docs` skill at `.agent/skills/` (symlinked to `.claude/skills/` for Claude Code) to keep JSDoc + Storybook stories in sync
- `npm run storybook:serve` + `railway.json` — deploy a long-running Storybook instance (with a working `/mcp` endpoint) to Railway

### Changed

- Prose docs (`docs/foundations/`, most of `docs/patterns/`) migrated from `.md` to Storybook MDX docs pages; ship in the npm tarball
- `docs/components/` (old per-component `.md`) removed — component docs now live as JSDoc + Storybook stories
- Conventions and recipes reclassified as project-level docs and removed from this repo entirely; no longer ship in the npm tarball or `llms.txt` (ADR-003)

## [0.2.1] - 2026-08-07

### Added

- `Calendar` primitive (react-day-picker v9) + `DatePicker` / `DateRangePicker` patterns (Popover + Calendar)

## [0.2.0] - 2026-08-07

### Added

- `SortableList` pattern — HTML5 drag-and-drop reorder (handle + ArrowUp/Down); no DnD dependency
- Charts: `BarChart`, `DonutChart`, `LineChart` — config-driven dashboard charts (no app-side SVG/bar markup)
- `AppSidebar` pattern — Dreams ERP nav (`type: "section"`, nested groups, `renderLink` / footer)
- `StatisticCard` trend props (`trend`, `trendLabel`) for KPI cards
- `Progress` `indicatorClassName` for multi-color bars
- Sidebar compound component (`SidebarProvider`, menu primitives, `useSidebar`) + sidebar design tokens
- Sheet, Collapsible, Breadcrumb, Progress, Slider, Toggle, Toggle Group, Hover Card, Aspect Ratio
- `useIsMobile` hook (sidebar breakpoint helper)
- Shell layout CSS vars: `--shell-inset`, `--sidenav-width`, `--topbar-height`
- Server-safe `cn` export via `@erp/miniapp-ui/cn`

### Changed

- Primary brand color: ocean blue `#0284c7` (was Dreams teal `#0f766e`); accent / ring / sidebar-primary follow
- Design tokens follow Dreams ERP **light** layout by default; optional `html.dark`
- Component anatomy aligned to Dreams: `Button` h-9, `Input` h-9 `rounded-md`, `Badge` `rounded-md`, `Card` `rounded-md`
- `AppSidebar` menu paddings/active states match Dreams sidebar CSS (not “dark-only” restyle)
- `PageHeader` / `StatisticCard` typography tuned to dashboard density

### Fixed

- Preserve `"use client"` in built `dist/index.*` so Next.js App Router can import UI from Server Components without `createContext` RSC errors
- Sidebar collapse: drive width from state + `overflow-hidden` so icon/offcanvas modes clip correctly in embedded demos

## [0.1.0] - 2026-08-05

### Added

- Project management: ROADMAP, TODO, CHANGELOG, PROJECT_STRUCTURE, CONTRIBUTING, RELEASE
- Package foundation: exports, tokens CSS, `cn`, tsup build, npm pack
- Design foundations docs (`docs/foundations/*`)
- Component library (29 primitives) + docs (`docs/components/*`)
- Patterns: states, layout, search, confirm + docs (`docs/patterns/*`)
- Recipes, conventions, AI skills (`.ai/skills/*`)
- Next.js documentation / showcase site (`docs-site/`)
- Reference app `examples/miniapp-ui-kit`
- Release pipeline docs + ADR 001 (Drawer without Vaul)
