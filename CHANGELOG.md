# Changelog

All notable changes to `@erp/miniapp-ui` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

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
