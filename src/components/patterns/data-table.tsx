"use client";

import type { Cell, Header, ReactTable, Row, RowData, TableFeatures } from "@tanstack/react-table";
import { useVirtualizer, useWindowVirtualizer, type Virtualizer } from "@tanstack/react-virtual";
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
  | "sortable"
  | "sortDirection"
  | "onSortChange"
  | "resizable"
  | "width"
  | "onWidthChange"
  | "onResizeStart"
  | "onResizeEnd"
  | "pinned"
  | "pinOffset"
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
  /**
   * Render only the rows near the viewport, with spacer rows standing in for the rest, once
   * the table has more than `threshold` rows. For tables that reach thousands of rows. The
   * nearest scrolling ancestor (or the window) is the viewport. Rows off screen are not in
   * the DOM: reach them with `apiRef.current.scrollToRow`, not `getElementById`.
   */
  virtualize?: boolean | DataTableVirtualize;
  /** Imperative handle — `scrollToRow` works with or without `virtualize`. */
  apiRef?: React.Ref<DataTableApi>;
};

type DataTableVirtualize = {
  /** Virtualize only above this many rows; smaller tables render every row. Default `100`. */
  threshold?: number;
  /** Row height guess in px until rows are measured. Default `37` (one line of `text-sm`). */
  estimateRowHeight?: number;
  /** Rows rendered beyond the viewport on each side. Default `10`. */
  overscan?: number;
};

type DataTableApi = {
  /** Scrolls the row with this id (`getRowId`) into view. `false` when the row model has no such row. */
  scrollToRow: (rowId: string, options?: { align?: ScrollAlign }) => boolean;
};

type ScrollAlign = "start" | "center" | "end" | "auto";
type RowScroller = (index: number, align: ScrollAlign) => void;

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

/** Pinned side + the CSS variable on `<table>` holding the column's offset. */
type Pin = { pinned: "left" | "right"; offsetVar: string };

type BodyProps<TFeatures extends TableFeatures, TData extends RowData> = {
  table: ReactTable<TFeatures, TData, any>;
  rows: Row<TFeatures, TData>[];
  leafIds: string[];
  /** `leafIds` joined — compared instead of the array, which is rebuilt every render. */
  leafKey: string;
  pins: Map<string, Pin>;
  pinKey: string;
  empty: React.ReactNode;
  getRowProps?: (row: Row<TFeatures, TData>) => DataTableRowProps;
  getCellProps?: (cell: Cell<TFeatures, TData, unknown>) => DataTableCellProps;
  /** A column is being dragged: only the header widths move. */
  resizing: boolean;
  /** Row count above which rows are virtualized; `Infinity` when off. */
  threshold: number;
  estimateRowHeight: number;
  overscan: number;
  /** Set by whichever body is mounted; backs `apiRef.scrollToRow`. */
  scrollerRef: React.RefObject<RowScroller | null>;
};

/**
 * While a column is dragged, the body keeps its last render: widths come from the
 * header (`table-fixed`) and pinned offsets from CSS variables, so no body cell
 * changes. The app usually re-renders on every step with fresh `getRowProps` /
 * `getCellProps`, which are picked up once the drag ends.
 */
function sameBody(prev: BodyProps<any, any>, next: BodyProps<any, any>) {
  if (
    prev.rows !== next.rows ||
    prev.leafKey !== next.leafKey ||
    prev.pinKey !== next.pinKey ||
    prev.threshold !== next.threshold ||
    prev.estimateRowHeight !== next.estimateRowHeight ||
    prev.overscan !== next.overscan
  ) {
    return false;
  }
  if (next.resizing) return true;
  return (
    prev.table === next.table &&
    prev.empty === next.empty &&
    prev.getRowProps === next.getRowProps &&
    prev.getCellProps === next.getCellProps
  );
}

/** One body row; `attrs` carries the virtualizer's `data-index` + measuring `ref`. */
function renderRow<TFeatures extends TableFeatures, TData extends RowData>(
  { table, leafIds, pins, getRowProps, getCellProps }: BodyProps<TFeatures, TData>,
  row: Row<TFeatures, TData>,
  attrs?: { "data-index": number; ref: (node: HTMLTableRowElement | null) => void },
) {
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
      {...attrs}
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
            {...pinVar(pins, column.id)}
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
}

/** Stands in for the rows a virtualized body leaves out, so the scroll height stays right. */
function Spacer({ height, colSpan }: { height: number; colSpan: number }) {
  if (height <= 0) return null;
  return (
    <tr aria-hidden="true" data-slot="table-spacer">
      <td colSpan={colSpan} style={{ height, padding: 0, border: 0 }} />
    </tr>
  );
}

function BodyRows<TFeatures extends TableFeatures, TData extends RowData>(props: BodyProps<TFeatures, TData>) {
  const { rows, leafIds, empty, threshold } = props;
  if (rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={Math.max(leafIds.length, 1)} className="h-24 text-center text-muted-foreground">
            {empty}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  return rows.length > threshold ? <VirtualRows {...props} /> : <PlainRows {...props} />;
}

function PlainRows<TFeatures extends TableFeatures, TData extends RowData>(props: BodyProps<TFeatures, TData>) {
  const bodyRef = React.useRef<HTMLTableSectionElement>(null);
  const { scrollerRef } = props;
  React.useLayoutEffect(() => {
    scrollerRef.current = (index, align) =>
      bodyRef.current?.rows[index]?.scrollIntoView({ block: align === "auto" ? "nearest" : align });
  }, [scrollerRef]);
  return <TableBody ref={bodyRef}>{props.rows.map((row) => renderRow(props, row))}</TableBody>;
}

/** Rows rendered before the viewport is known — on the server and for the first client render. */
const FIRST_ROWS = 30;

/**
 * Finds the viewport, then hands over to the element or window virtualizer. Until then
 * it renders the first rows plus a spacer of the estimated height, so the server HTML
 * has content and the scroll container already overflows when it is looked for.
 */
function VirtualRows<TFeatures extends TableFeatures, TData extends RowData>(props: BodyProps<TFeatures, TData>) {
  const bodyRef = React.useRef<HTMLTableSectionElement>(null);
  const [viewport, setViewport] = React.useState<Element | Window | null>(null);
  React.useLayoutEffect(() => {
    if (bodyRef.current) setViewport(scrollParent(bodyRef.current));
  }, []);

  // `null` until the layout effect runs — always on the server, where `Element` and
  // `Window` don't exist, so they are only touched once a viewport was found.
  if (viewport && "nodeType" in viewport) return <ElementRows {...props} viewport={viewport} />;
  if (viewport) return <WindowRows {...props} />;
  const first = props.rows.slice(0, FIRST_ROWS);
  return (
    <TableBody ref={bodyRef}>
      {first.map((row) => renderRow(props, row))}
      <Spacer
        height={(props.rows.length - first.length) * props.estimateRowHeight}
        colSpan={Math.max(props.leafIds.length, 1)}
      />
    </TableBody>
  );
}

/** Nearest ancestor that scrolls vertically — preferring one that actually overflows — else the window. */
function scrollParent(node: Element): Element | Window {
  let fallback: Element | null = null;
  for (let el = node.parentElement; el; el = el.parentElement) {
    const { overflowY } = getComputedStyle(el);
    if (overflowY !== "auto" && overflowY !== "scroll" && overflowY !== "overlay") continue;
    if (el.scrollHeight > el.clientHeight) return el;
    fallback ??= el;
  }
  return fallback ?? window;
}

function ElementRows<TFeatures extends TableFeatures, TData extends RowData>({
  viewport,
  ...props
}: BodyProps<TFeatures, TData> & { viewport: Element }) {
  const bodyRef = React.useRef<HTMLTableSectionElement>(null);
  // Distance from the top of the viewport's content to the first row (header, toolbar…).
  const margin = useOffset(bodyRef, () => {
    const body = bodyRef.current;
    return body ? body.getBoundingClientRect().top - viewport.getBoundingClientRect().top + viewport.scrollTop : 0;
  });
  const virtualizer = useVirtualizer<Element, HTMLTableRowElement>({
    count: props.rows.length,
    getScrollElement: () => viewport,
    estimateSize: () => props.estimateRowHeight,
    overscan: props.overscan,
    scrollMargin: margin,
    getItemKey: (index) => props.rows[index]?.id ?? index,
  });
  return <VirtualBody props={props} bodyRef={bodyRef} virtualizer={virtualizer} />;
}

function WindowRows<TFeatures extends TableFeatures, TData extends RowData>(props: BodyProps<TFeatures, TData>) {
  const bodyRef = React.useRef<HTMLTableSectionElement>(null);
  const margin = useOffset(bodyRef, () => (bodyRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY);
  const virtualizer = useWindowVirtualizer<HTMLTableRowElement>({
    count: props.rows.length,
    estimateSize: () => props.estimateRowHeight,
    overscan: props.overscan,
    scrollMargin: margin,
    getItemKey: (index) => props.rows[index]?.id ?? index,
  });
  return <VirtualBody props={props} bodyRef={bodyRef} virtualizer={virtualizer} />;
}

/** Re-measured after every render (cheap), stored only when it moves — content above can reflow. */
function useOffset(bodyRef: React.RefObject<HTMLTableSectionElement | null>, measure: () => number) {
  const [offset, setOffset] = React.useState(0);
  React.useLayoutEffect(() => {
    if (!bodyRef.current) return;
    const next = Math.round(measure());
    if (next !== offset) setOffset(next);
  });
  return offset;
}

function VirtualBody<TFeatures extends TableFeatures, TData extends RowData>({
  props,
  bodyRef,
  virtualizer,
}: {
  props: BodyProps<TFeatures, TData>;
  bodyRef: React.RefObject<HTMLTableSectionElement | null>;
  virtualizer: Virtualizer<any, HTMLTableRowElement>;
}) {
  const { scrollerRef } = props;
  React.useLayoutEffect(() => {
    scrollerRef.current = (index, align) => virtualizer.scrollToIndex(index, { align });
  }, [scrollerRef, virtualizer]);

  const items = virtualizer.getVirtualItems();
  const margin = virtualizer.options.scrollMargin;
  const total = virtualizer.getTotalSize();
  const first = items[0];
  const last = items.at(-1);
  const colSpan = Math.max(props.leafIds.length, 1);
  return (
    <TableBody ref={bodyRef}>
      <Spacer height={first ? first.start - margin : 0} colSpan={colSpan} />
      {items.map((item) => {
        const row = props.rows[item.index];
        return row
          ? renderRow(props, row, { "data-index": item.index, ref: virtualizer.measureElement })
          : null;
      })}
      <Spacer height={last ? total - (last.end - margin) : total} colSpan={colSpan} />
    </TableBody>
  );
}

// `memo` drops the generics; the cast restores them.
const DataTableBody = React.memo(BodyRows as React.FC<BodyProps<any, any>>, sameBody) as typeof BodyRows;

function pinVar(pins: Map<string, Pin>, columnId: string) {
  const pin = pins.get(columnId);
  return pin ? { pinned: pin.pinned, pinOffset: `var(${pin.offsetVar})` } : {};
}

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
 * While a column is dragged only the header re-renders; the body is skipped as long
 * as the row model is unchanged, so large tables resize smoothly.
 *
 * Do: keep `features`, `columns` and the `data` fallback stable (module scope or
 * memo) — otherwise the row model is rebuilt on every resize step and the body
 * re-renders with it. Don't mix it with hand-written `TableRow`s — use `Table` directly for that.
 */
function DataTable<TFeatures extends TableFeatures, TData extends RowData>({
  table,
  empty = "No results.",
  getRowProps,
  getCellProps,
  getHeaderProps,
  getFooterProps,
  resizeLabel = defaultResizeLabel,
  virtualize,
  apiRef,
  className,
  style,
  ...props
}: DataTableProps<TFeatures, TData>) {
  const loose = table as unknown as LooseTable;
  const sized = typeof loose.getTotalSize === "function";
  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const [resizing, setResizing] = React.useState(false);
  const virtual = virtualize === true ? {} : virtualize || undefined;
  const scrollerRef = React.useRef<RowScroller | null>(null);
  React.useImperativeHandle(
    apiRef,
    () => ({
      scrollToRow: (rowId, options) => {
        const index = table.getRowModel().rows.findIndex((row) => row.id === rowId);
        if (index < 0 || !scrollerRef.current) return false;
        scrollerRef.current(index, options?.align ?? "auto");
        return true;
      },
    }),
    [table],
  );
  // Body cells follow the leaf headers, so pinned-first order and hidden columns match the header.
  const leaves = headerGroups.at(-1)?.headers ?? [];
  const leafIds = leaves.map((header) => header.column.id);
  // Body and footer cells read pinned offsets from variables on `<table>`, so a resize
  // changes one style there instead of every pinned cell.
  const pins = new Map<string, Pin>();
  const pinOffsets: Record<string, string> = {};
  leaves.forEach((header, index) => {
    const pin = pinning(header.column as unknown as LooseColumn);
    if (!pin.pinned) return;
    const offsetVar = `--data-table-pin-${index}`;
    pins.set(header.column.id, { pinned: pin.pinned, offsetVar });
    pinOffsets[offsetVar] = `${pin.pinOffset}px`;
  });
  const pinKey = [...pins].map(([id, pin]) => `${id}:${pin.pinned}:${pin.offsetVar}`).join("|");
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
        onResizeStart={resizable ? () => setResizing(true) : undefined}
        onResizeEnd={resizable ? () => setResizing(false) : undefined}
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
      style={{ ...pinOffsets, ...(sized ? { width: loose.getTotalSize?.() } : {}), ...style }}
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
      <DataTableBody
        table={table}
        rows={rows}
        leafIds={leafIds}
        leafKey={leafIds.join("\u0000")}
        pins={pins}
        pinKey={pinKey}
        empty={empty}
        getRowProps={getRowProps}
        getCellProps={getCellProps}
        resizing={resizing}
        threshold={virtual ? (virtual.threshold ?? 100) : Number.POSITIVE_INFINITY}
        estimateRowHeight={virtual?.estimateRowHeight ?? 37}
        overscan={virtual?.overscan ?? 10}
        scrollerRef={scrollerRef}
      />
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
                    {...(header.subHeaders.length === 0 ? pinVar(pins, column.id) : {})}
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
  DataTableApi,
  DataTableCellProps,
  DataTableColumnMeta,
  DataTableHeadProps,
  DataTableProps,
  DataTableRowProps,
  DataTableVirtualize,
};
