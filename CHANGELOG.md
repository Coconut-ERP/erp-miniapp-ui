# Changelog

All notable changes to `@erp/miniapp-ui` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

> **Note on `v0.4.1`.** The `v0.4.1` tag was cut by mistake *after* `0.5.0`: it only lowered
> `package.json` back to `0.4.1` and shipped the full 0.5.0 source (collapsible `AppSidebar`
> included). There is no separate 0.4.1 feature set — treat that tag as 0.5.0 and prefer the
> `v0.5.0` release.

## [0.8.0] - 2026-10-18

### Added

- `DataTable` `virtualize` (`true` or `{ threshold, estimateRowHeight, overscan }`) — above `threshold` rows (default `100`) only the rows near the viewport are rendered, with spacer rows for the rest, so tables of thousands of rows paint and scroll smoothly. The viewport is the nearest scrolling ancestor, else the window; rows are measured as they render. Server HTML carries the first 30 rows. Smaller tables render every row as before
- `DataTable` `apiRef` → `DataTableApi.scrollToRow(rowId, { align })` — scrolls to a row by its `getRowId` id, rendered or not (works without `virtualize` too)
- Exported types `DataTableApi`, `DataTableVirtualize`
- `@tanstack/react-virtual` `^3.14.21` as a dependency (used only by `DataTable` `virtualize`)

## [0.7.1] - 2026-10-18

### Fixed

- `DataTable` — dragging a column's resize handle no longer re-renders every body cell on each pointer move. The body is memoised and skipped while a drag is in progress (it renders once more on release to pick up fresh `getRowProps` / `getCellProps`), and pinned body/footer cells read their offset from a CSS variable on `<table>` (`--data-table-pin-<index>`) instead of an inline number. On wide tables (hundreds of rows × columns) the drag used to lag seconds behind the pointer

### Added

- `TableHead` `onResizeStart` / `onResizeEnd` — fire when a pointer drag of the resize handle begins and ends (keyboard steps don't fire them)

## [0.7.0] - 2026-10-16

### Added

- `DataTable` pattern — renders a TanStack Table v9 instance (`useTable` from `@tanstack/react-table`) with the `Table` primitives and picks up the registered features: sortable headers (`rowSortingFeature`), fixed layout + resize handles (`columnSizingFeature` / `columnResizingFeature`), sticky columns with computed offsets (`columnPinningFeature`), selected-row tint (`rowSelectionFeature`), footers, `empty` row, `getRowProps`, `resizeLabel`. Per-column `numeric` / `truncate` / `fallback` / class names via `columnDef.meta` (`DataTableColumnMeta`). See ADR-004
- `@tanstack/react-table` `^9.2.4` as an **optional** peer dependency — only apps that use `DataTable` install it; the package has no runtime import of it
- `DataTable` `getCellProps` / `getHeaderProps` / `getFooterProps` — per-cell props (backgrounds, `id`, `title`…; `className` merges last); with grouped columns an ungrouped leaf header spans the header rows (`rowSpan`) instead of leaving empty placeholder cells; footer levels with nothing to show are skipped; header and footer rows don't take the row hover tint
- Exported types `DataTableProps`, `DataTableColumnMeta`, `DataTableRowProps`, `DataTableCellProps`, `DataTableHeadProps` (all accept `data-*` attributes)
- `TableHead` `resizable` — drag handle on the header's right edge (`role="separator"`, keyboard ←/→, Shift for 50px steps). Width is uncontrolled (`defaultWidth`) or controlled (`width` + `onWidthChange`), clamped by `minWidth` (default `48`) / `maxWidth`
- `Table` `layout` (`"auto"` | `"fixed"`) — `"fixed"` sizes columns from header widths and clips overflowing cell text with an ellipsis, so resized columns can shrink below their content
- `TableHead` `resizeLabel` — accessible name of the resize handle (e.g. Vietnamese copy)

### Fixed

- Pinned `TableHead` / `TableCell` repaint the row tint (hover, `selected`, `warning`, `error`) and the sorted-header tint as opaque token mixes, so pinned columns no longer stay white on tinted rows or show scrolled content through a sorted header

All additions are opt-in; existing tables render unchanged.

## [0.6.1] - 2026-09-26

### Changed

- `TableHead` — the header of the sorted column (`sortable` with a `sortDirection`) is tinted `bg-primary/10`, so the active sort reads at a glance, not only by its icon

## [0.6.0] - 2026-09-25

### Added

- `TableHead` `sortable` / `sortDirection` / `onSortChange` — header becomes a button with a direction icon and `aria-sort`. Controlled: the library keeps no sort state, so sorting can be server-side
- `TableHead` / `TableCell` `numeric` — right-aligns (cells also use tabular figures)
- `TableHead` / `TableCell` `pinned` (`"left"` | `"right"`) + `pinOffset` — freeze a column while scrolling horizontally
- `TableCell` `fallback` — renders a placeholder (e.g. `"—"`) for `null` / `undefined` / `""`; a real `0` still renders
- `TableCell` `truncate` — single-line clip with the full text as `title`
- `TableRow` `state` (`"warning"` | `"error"` | `"selected"`) — semantic-token row tint
- Exported types `TableHeadProps`, `TableCellProps`, `TableRowProps`, `TableRowState`, `TableSortDirection`

All additions are opt-in; existing tables render unchanged.

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
