"use client";

import type { Header, ReactTable, Row, RowData, TableFeatures } from "@tanstack/react-table";
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

type DataTableProps<TFeatures extends TableFeatures, TData extends RowData> = Omit<
  TableProps,
  "children" | "layout"
> & {
  /** Instance from `useTable` (`@tanstack/react-table` v9). The app picks the features; any state selector works. */
  table: ReactTable<TFeatures, TData, any>;
  /** Rendered in a full-width row when there are no rows. Default `"No results."`. */
  empty?: React.ReactNode;
  /** Extra props per body row — `state`, `onClick`, `className`… */
  getRowProps?: (row: Row<TFeatures, TData>) => TableRowProps;
  /** Accessible name of a column's resize handle. Default `` name => `Resize ${name}` ``. */
  resizeLabel?: (columnName: string) => string;
};

// Feature APIs exist only when the app registers that feature, so they are
// read through optional shapes instead of the feature-gated generic types.
type LooseColumn = {
  id: string;
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
 * Per-column presentation goes in `columnDef.meta` (`DataTableColumnMeta`).
 *
 * Do: keep `features`, `columns` and the `data` fallback stable (module scope or
 * memo). Don't mix it with hand-written `TableRow`s — use `Table` directly for that.
 */
function DataTable<TFeatures extends TableFeatures, TData extends RowData>({
  table,
  empty = "No results.",
  getRowProps,
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
  const hasFooter = table
    .getAllLeafColumns()
    .some((column) => (column as unknown as LooseColumn).columnDef.footer !== undefined);

  const renderHead = (header: Header<TFeatures, TData, unknown>) => {
    const column = header.column as unknown as LooseColumn;
    const m = meta(column);
    const leaf = header.subHeaders.length === 0;
    const sortable = leaf && !header.isPlaceholder && !!column.getCanSort?.();
    const resizable = leaf && sized && !!column.getCanResize?.();
    const name = typeof column.columnDef.header === "string" ? column.columnDef.header : column.id;
    return (
      <TableHead
        key={header.id}
        colSpan={header.colSpan > 1 ? header.colSpan : undefined}
        numeric={m.numeric}
        {...(leaf ? pinning(column) : {})}
        className={cn(header.colSpan > 1 && "text-center", m.headClassName)}
        sortable={sortable}
        sortDirection={sortable ? column.getIsSorted?.() || null : undefined}
        onSortChange={sortable ? () => column.toggleSorting?.() : undefined}
        resizable={resizable}
        resizeLabel={resizeLabel(name)}
        width={sized && leaf ? column.getSize?.() : undefined}
        minWidth={column.columnDef.minSize}
        maxWidth={column.columnDef.maxSize}
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

  return (
    <Table
      layout={sized ? "fixed" : "auto"}
      className={className}
      style={sized ? { width: loose.getTotalSize?.(), ...style } : style}
      {...props}
    >
      <TableHeader>
        {headerGroups.map((group) => (
          <TableRow key={group.id}>{group.headers.map(renderHead)}</TableRow>
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
                  return (
                    <TableCell
                      key={cell.id}
                      numeric={m.numeric}
                      truncate={m.truncate}
                      title={m.truncate && typeof value === "string" ? value : undefined}
                      {...pinning(column)}
                      className={m.cellClassName}
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
      {hasFooter ? (
        <TableFooter>
          {table.getFooterGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                const column = header.column as unknown as LooseColumn;
                return (
                  <TableCell
                    key={header.id}
                    colSpan={header.colSpan > 1 ? header.colSpan : undefined}
                    numeric={meta(column).numeric}
                    {...(header.subHeaders.length === 0 ? pinning(column) : {})}
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
export type { DataTableColumnMeta, DataTableProps };
