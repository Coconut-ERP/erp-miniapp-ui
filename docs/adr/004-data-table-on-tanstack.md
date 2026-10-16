# Architecture Decision: DataTable on TanStack Table v9

## Status

Accepted — 2026-10-16

## Context

`Table` is a styled `<table>` (shadcn) plus opt-in props (`sortable`, `pinned`,
`resizable`, …). It holds no data or state, so every mini app hand-writes the
same logic per table: sort cycles, column widths, pinned offsets, selection.
`vv3-luong-san-pham` alone has ~15 table files plus a custom resize handle and
sort hook. Three apps already install `@tanstack/react-table` (one on v8, two on v9).

A full grid (AG Grid, MUI/Mantine grids) was rejected: its own design system,
heavier bundle on mobile mini apps, paid tiers for some features, and a second
visual language beside the locked shadcn + Tailwind stack.

## Decision

Add a `DataTable` pattern that **renders a TanStack Table v9 instance** with the
existing `Table` primitives.

- The app owns the instance: `useTable` + `tableFeatures({...})`, state, data
  fetching. `DataTable` only reads it and adapts to the registered features
  (sorting, sizing/resizing, pinning, selection). Column presentation comes
  from `columnDef.meta` (`DataTableColumnMeta`).
- `@tanstack/react-table` `^9` is an **optional peer dependency**. The library
  imports it for types only; rendering goes through `table.FlexRender`, so the
  package has no runtime import of TanStack and apps that don't use
  `DataTable` need not install it.
- `Table` and its API stay unchanged. `DataTable` is additive.

## Consequences

- Existing apps are unaffected; migration is per table and optional.
- Apps using `DataTable` must be on TanStack Table v9 (v8 apps upgrade first).
- Feature APIs are read structurally at runtime, so a feature the app does not
  register simply does not render (no sort button, no resize handle).
- Interactive bits TanStack does not render (checkbox column, filters, column
  menu) stay app-side column definitions until a shared need appears.
