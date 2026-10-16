"use client";

import type { Cell, Header, ReactTable, Row, RowData, TableFeatures } from "@tanstack/react-table";
import * as React from "react";

import { cn } from "../../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableCellProps,
  type TableHeadProps,
  type TableProps,
  type TableRowProps,
} from "../ui/table";

/**
 * Per-column presentation read from `columnDef.meta`. Type it once per table:
 * `tableFeatures({ ..., columnMeta: {} as DataTableColumnMeta })`.
 */
type DataTableColumnMeta = {
  /** Right-aligns header and cells, tabular figures in cells. */
  numeric?: boolean;
  /** Clips cell text to one line with the full text as `title`. */
  truncate?: boolean;
  /** Shown for empty cell values (`null`/`undefined`/`""`), e.g. `"—"`. */
  fallback?: React.ReactNode;
  /** Extra classes for this column's `TableHead`. */
  headClassName?: string;
  /** Extra classes for this column's `TableCell`s. */
  cellClassName?: string;
};

/** `data-*` attributes, which typed object literals can't otherwise carry. */
type DataAttributes = { [attribute: `data-${string}`]: string | number | boolean | undefined };
/** `TableRow` props plus `data-*` attributes. */
type DataTableRowProps = TableRowProps & DataAttributes;
/** `TableCell` props plus `data-*` attributes. */
type DataTableCellProps = TableCellProps & DataAttributes;
/** `TableHead` props plus `data-*` attributes (sorting, sizing and pinning stay with the table). */
type DataTableHeadProps = Omit<
  TableHeadProps,
  "sortable" | "sortDirection" | "onSortChange" | "resizable" | "width" | "onWidthChange" | "pinned" | "pinOffset"
> &
  DataAttributes;

type DataTableProps<TFeatures extends TableFeatures, TData extends RowData> = Omit<
  TableProps,
  "children" | "layout"
> & {
  /** Instance from `useTable` (`@tanstack/react-table` v9). The app picks the features; any state selector works. */
  table: ReactTable<TFeatures, TData, any>;
  /** Rendered in a full-width row when there are no rows. Default `"No results."`. */
  empty?: React.ReactNode;
  /** Extra props per body row — `state`, `onClick`, `className`… */
  getRowProps?: (row: Row<TFeatures, TData>) => DataTableRowProps;
  /** Extra props per body cell — per-row/per-column backgrounds, `id`, `title`… `className` merges last. */
  getCellProps?: (cell: Cell<TFeatures, TData, unknown>) => DataTableCellProps;
  /** Extra props per header cell (group headers included). `className` merges last. */
  getHeaderProps?: (header: Header<TFeatures, TData, unknown>) => DataTableHeadProps;
  /** Extra props per footer cell. `className` merges last. */
  getFooterProps?: (header: Header<TFeatures, TData, unknown>) => DataTableCellProps;
  /** Accessible name of a column's resize handle. Default `` name => `Resize ${name}` ``. */
  resizeLabel?: (columnName: string) => string;
};

// Feature APIs exist only when the app registers that feature, so they are
// read through optional shapes instead of the feature-gated generic types.
type LooseColumn = {
  id: string;
  columns?: unknown[];
  columnDef: { header?: unknown; footer?: unknown; meta?: unknown; minSize?: number; maxSize?: number };
  getCanSort?: () => boolean;
  getIsSorted?: () => false | "asc" | "desc";
  toggleSorting?: (desc?: boolean, isMulti?: boolean) => void;
  getCanResize?: () => boolean;
  getSize?: () => number;
  getIsPinned?: () => false | "start" | "end";
  getStart?: (position?: "start" | "end" | "center") => number;
  getAfter?: (position?: "start" | "end" | "center") => number;
};
type LooseTable = {
  getTotalSize?: () => number;
  setColumnSizing?: (updater: (old: Record<string, number>) => Record<string, number>) => void;
};
type LooseRow = { getIsSelected?: () => boolean };

const meta = (column: LooseColumn) => (column.columnDef.meta ?? {}) as DataTableColumnMeta;

function pinning(column: LooseColumn) {
  const pinned = column.getIsPinned?.();
  if (!pinned) return {};
  return pinned === "start"
    ? { pinned: "left" as const, pinOffset: column.getStart?.("start") ?? 0 }
    : { pinned: "right" as const, pinOffset: column.getAfter?.("end") ?? 0 };
}

const defaultResizeLabel = (name: string) => `Resize ${name}`;

/**
 * Renders a TanStack Table v9 instance with the library's `Table` primitives,
 * so app tables get sorting, column sizing/resizing, pinning and row selection
 * without hand-wiring each header and cell. Headless split: the app owns the
 * instance (`useTable` + `tableFeatures`), state and data fetching; this only
 * renders. `@tanstack/react-table` v9 is an optional peer dependency — install
 * it in the app that uses `DataTable`.
 *
 * Picks up whichever features are registered:
 * - `rowSortingFeature` → sortable headers (`enableSorting: false` opts a column out).
 * - `columnSizingFeature` → fixed layout from `size`; with `columnResizingFeature`
 *   headers get a drag/keyboard resize handle (`minSize` / `maxSize` clamp).
 * - `columnPinningFeature` (+ sizing) → `columnPinning: { start, end }` columns stick.
 * - `rowSelectionFeature` → selected rows are tinted; render the checkbox column yourself.
 *
 * Per-column presentation goes in `columnDef.meta` (`DataTableColumnMeta`); anything
 * that depends on the row or cell goes through `getRowProps` / `getCellProps` /
 * `getHeaderProps` / `getFooterProps`. With grouped columns, a leaf column outside
 * any group spans the header rows (`rowSpan`) instead of leaving empty cells above it.
 *
 * Do: keep `features`, `columns` and the `data` fallback stable (module scope or
 * memo). Don't mix it with hand-written `TableRow`s — use `Table` directly for that.
 */
function DataTable<TFeatures extends TableFeatures, TData extends RowData>({
  table,
  empty = "No results.",
  getRowProps,
  getCellProps,
  getHeaderProps,
  getFooterProps,
  resizeLabel = defaultResizeLabel,
  className,
  style,
  ...props
}: DataTableProps<TFeatures, TData>) {
  const loose = table as unknown as LooseTable;
  const sized = typeof loose.getTotalSize === "function";
  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  // Body cells follow the leaf headers, so pinned-first order and hidden columns match the header.
  const leafIds = (headerGroups.at(-1)?.headers ?? []).map((header) => header.column.id);
  const leafCount = Math.max(leafIds.length, 1);
  const hasFooterDef = (header: Header<TFeatures, TData, unknown>) =>
    !header.isPlaceholder && (header.column as unknown as LooseColumn).columnDef.footer !== undefined;
  // TanStack emits one footer row per header level; drop the levels with nothing to show.
  const footerGroups = table.getFooterGroups().filter((group) => group.headers.some(hasFooterDef));

  const renderHead = (header: Header<TFeatures, TData, unknown>, rowSpan?: number) => {
    const column = header.column as unknown as LooseColumn;
    const m = meta(column);
    const leaf = header.subHeaders.length === 0;
    const sortable = leaf && !header.isPlaceholder && !!column.getCanSort?.();
    const resizable = leaf && sized && !!column.getCanResize?.();
    const name = typeof column.columnDef.header === "string" ? column.columnDef.header : column.id;
    const extra = getHeaderProps?.(header) ?? {};
    const spans = rowSpan !== undefined && rowSpan > 1;
    return (
      <TableHead
        key={header.id}
        colSpan={header.colSpan > 1 ? header.colSpan : undefined}
        rowSpan={spans ? rowSpan : undefined}
        numeric={m.numeric}
        {...extra}
        {...(leaf ? pinning(column) : {})}
        className={cn(
          header.colSpan > 1 && "text-center",
          spans && "align-bottom",
          m.headClassName,
          extra.className,
        )}
        sortable={sortable}
        sortDirection={sortable ? column.getIsSorted?.() || null : undefined}
        onSortChange={sortable ? () => column.toggleSorting?.() : undefined}
        resizable={resizable}
        resizeLabel={resizeLabel(name)}
        width={sized && leaf ? column.getSize?.() : undefined}
        minWidth={column.columnDef.minSize}
        // TanStack defaults maxSize to MAX_SAFE_INTEGER — that means "no limit".
        maxWidth={(column.columnDef.maxSize ?? Infinity) < Number.MAX_SAFE_INTEGER ? column.columnDef.maxSize : undefined}
        onWidthChange={
          resizable
            ? (width) => loose.setColumnSizing?.((old) => ({ ...old, [column.id]: width }))
            : undefined
        }
      >
        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
      </TableHead>
    );
  };

  // A leaf column outside any group shows up as placeholders above its real header.
  // Render the real header once, at the top, spanning those rows.
  const leafHeaders = new Map(
    (headerGroups.at(-1)?.headers ?? []).map((header) => [header.column.id, header]),
  );
  const spanned = new Set<string>();
  const headerCells = (headers: Header<TFeatures, TData, unknown>[], depth: number) =>
    headers.flatMap((header) => {
      const id = header.column.id;
      const leafColumn = !(header.column as unknown as LooseColumn).columns?.length;
      if (leafColumn && spanned.has(id)) return [];
      const leafHeader = leafHeaders.get(id);
      if (header.isPlaceholder && leafColumn && leafHeader && depth < headerGroups.length - 1) {
        spanned.add(id);
        return [renderHead(leafHeader, headerGroups.length - depth)];
      }
      return [renderHead(header)];
    });

  return (
    <Table
      layout={sized ? "fixed" : "auto"}
      className={className}
      style={sized ? { width: loose.getTotalSize?.(), ...style } : style}
      {...props}
    >
      <TableHeader>
        {headerGroups.map((group, depth) => (
          // Header rows are labels, not data — no hover tint.
          <TableRow key={group.id} className="hover:bg-transparent">
            {headerCells(group.headers, depth)}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={leafCount} className="h-24 text-center text-muted-foreground">
              {empty}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => {
            const r = row as unknown as LooseRow;
            const selected = !!r.getIsSelected?.();
            const rowProps = getRowProps?.(row) ?? {};
            const byId = row.getAllCellsByColumnId();
            const cells = leafIds.flatMap((id) => byId[id] ?? []);
            return (
              <TableRow
                key={row.id}
                data-state={selected ? "selected" : undefined}
                aria-selected={r.getIsSelected ? selected : undefined}
                {...rowProps}
                state={rowProps.state ?? (selected ? "selected" : undefined)}
              >
                {cells.map((cell) => {
                  const column = cell.column as unknown as LooseColumn;
                  const m = meta(column);
                  const value = cell.getValue();
                  const extra = getCellProps?.(cell) ?? {};
                  return (
                    <TableCell
                      key={cell.id}
                      numeric={m.numeric}
                      truncate={m.truncate}
                      title={m.truncate && typeof value === "string" ? value : undefined}
                      {...extra}
                      {...pinning(column)}
                      className={cn(m.cellClassName, extra.className)}
                    >
                      {m.fallback !== undefined && (value === null || value === undefined || value === "") ? (
                        <span className="text-muted-foreground">{m.fallback}</span>
                      ) : (
                        <table.FlexRender cell={cell} />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })
        )}
      </TableBody>
      {footerGroups.length > 0 ? (
        <TableFooter>
          {footerGroups.map((group) => (
            <TableRow key={group.id} className="hover:bg-transparent">
              {group.headers.map((header) => {
                const column = header.column as unknown as LooseColumn;
                const extra = getFooterProps?.(header) ?? {};
                return (
                  <TableCell
                    key={header.id}
                    colSpan={header.colSpan > 1 ? header.colSpan : undefined}
                    numeric={meta(column).numeric}
                    {...extra}
                    {...(header.subHeaders.length === 0 ? pinning(column) : {})}
                    className={extra.className}
                  >
                    {header.isPlaceholder ? null : <table.FlexRender footer={header} />}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableFooter>
      ) : null}
    </Table>
  );
}

export { DataTable };
export type {
  DataTableCellProps,
  DataTableColumnMeta,
  DataTableHeadProps,
  DataTableProps,
  DataTableRowProps,
};
