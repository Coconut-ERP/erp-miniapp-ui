"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";

type TableProps = React.ComponentProps<"table"> & {
  /**
   * Keep `<thead>` pinned while the body scrolls. Makes the table's own
   * container the vertical scroll area (`max-h-full`), so give it a parent with
   * a bounded height. Opt-in; default `false`.
   */
  stickyHeader?: boolean;
  /**
   * Pin the horizontal scrollbar to the bottom of the table's visible area
   * instead of the end of the table content. With `stickyHeader` / `stickyFooter`
   * the container scrolls both ways and keeps its native scrollbars, which already
   * sit at the visible bottom. Opt-in; default `false`.
   */
  stickyHorizontalScrollbar?: boolean;
  /**
   * `"fixed"` sizes columns from the header widths (CSS `table-layout: fixed`)
   * and clips overflowing cell text with an ellipsis, so a column can be
   * resized narrower than its content. Use with `TableHead` `resizable`.
   * Default `"auto"`.
   */
  layout?: "auto" | "fixed";
  /**
   * Keep `<tfoot>` (totals) pinned to the bottom while the body scrolls. Like
   * `stickyHeader`, the table container then owns vertical scrolling — give it a
   * height-bounded parent. Default `false`.
   */
  stickyFooter?: boolean;
  /**
   * How body rows are separated. `"lines"` (default) — a border under each row;
   * `"zebra"` — no borders, every other `striped` row tinted; `"cards"` — each row
   * is a card with a small gap on a muted backdrop; `"plain"` — no separators.
   * Row `state` always wins over the stripe, pinned cells included.
   */
  division?: TableDivision;
  /**
   * Row height (Carbon): `"compact"` 32px, `"default"` 40px. Omit to keep the
   * padding-sized rows (about 37px with `text-sm`).
   */
  density?: TableDensity;
};

type TableDivision = "lines" | "zebra" | "cards" | "plain";
type TableDensity = "compact" | "default";

type TableStyle = {
  stickyHeader: boolean;
  stickyFooter: boolean;
  division: TableDivision;
  density?: TableDensity;
};

const TableStyleContext = React.createContext<TableStyle>({
  stickyHeader: false,
  stickyFooter: false,
  division: "lines",
});

/**
 * Styled `<table>` wrapper with a horizontal-scroll container. Compose with
 * TableHeader/TableBody/TableFooter, TableRow, TableHead/TableCell, and
 * optional TableCaption.
 *
 * A11y: with `stickyHeader` or `stickyHorizontalScrollbar`, the scroll
 * container is focusable so the table can be scrolled with arrow/Home/End/Page
 * keys; the sticky bar is a visual proxy and is hidden from assistive tech.
 *
 * Do: pair `stickyHeader` with a height-bounded parent (`h-*`/`max-h-*`) — the
 * table container then owns vertical scrolling, which is what pins the header.
 * Don't add `sticky top-0` on `TableHeader` yourself, and don't wrap these
 * variants in an `overflow-hidden` ancestor — sticky positioning needs the
 * scrolling ancestor to see it.
 */
function Table({
  className,
  stickyHeader = false,
  stickyHorizontalScrollbar,
  stickyFooter = false,
  layout,
  division = "lines",
  density,
  ...props
}: TableProps) {
  // Memoised so rows and cells (which read it) don't re-render with every table render.
  const style = React.useMemo(
    () => ({ stickyHeader, stickyFooter, division, density }),
    [stickyHeader, stickyFooter, division, density],
  );
  const table = (
    <table
      data-slot="table"
      data-division={division}
      data-density={density}
      className={cn(
        "w-full caption-bottom text-sm",
        layout === "fixed" && "table-fixed [&_td]:overflow-hidden [&_td]:text-ellipsis",
        division === "cards" && "border-separate border-spacing-y-1 bg-muted/60",
        className,
      )}
      {...props}
    />
  );

  if (!stickyHeader && !stickyFooter && !stickyHorizontalScrollbar) {
    return (
      <TableStyleContext value={style}>
        <div data-slot="table-container" className="relative w-full overflow-x-auto">
          {table}
        </div>
      </TableStyleContext>
    );
  }

  return (
    <TableStyleContext value={style}>
      <TableScrollContainer
        stickyHeader={stickyHeader || stickyFooter}
        stickyScrollbar={stickyHorizontalScrollbar}
      >
        {table}
      </TableScrollContainer>
    </TableStyleContext>
  );
}

function TableScrollContainer({
  stickyHeader,
  stickyScrollbar,
  children,
}: {
  /** Header or footer is sticky: the container owns vertical scrolling. */
  stickyHeader?: boolean;
  stickyScrollbar?: boolean;
  children: React.ReactNode;
}) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({ scrollWidth: 0, clientWidth: 0 });

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const measure = () =>
      setSize({ scrollWidth: viewport.scrollWidth, clientWidth: viewport.clientWidth });
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    for (const child of Array.from(viewport.children)) observer.observe(child);
    return () => observer.disconnect();
  }, []);

  // When the container owns vertical scrolling, its bottom edge is the visible bottom, so
  // the native horizontal scrollbar is already pinned there. The proxy bar would need the
  // native bars hidden — and `scrollbar-width: none` hides the vertical one too.
  const proxy = stickyScrollbar && !stickyHeader;

  // Two-way sync; the equality guard stops the scroll events from ping-ponging.
  const sync = (from: HTMLDivElement | null, to: HTMLDivElement | null) => {
    if (from && to && to.scrollLeft !== from.scrollLeft) to.scrollLeft = from.scrollLeft;
  };

  return (
    <div className={cn("relative flex w-full flex-col", stickyHeader && "max-h-full min-h-0")}>
      <div
        ref={viewportRef}
        data-slot="table-container"
        tabIndex={0}
        onScroll={() => sync(viewportRef.current, barRef.current)}
        className={cn(
          "relative w-full overflow-x-auto outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          // Own the vertical scroll so `thead` has a scrolling ancestor to stick to.
          stickyHeader && "min-h-0 flex-1 overflow-y-auto",
          proxy && "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {children}
      </div>
      {proxy ? (
        <div
          ref={barRef}
          data-slot="table-sticky-scrollbar"
          aria-hidden="true"
          onScroll={() => sync(barRef.current, viewportRef.current)}
          hidden={size.scrollWidth <= size.clientWidth}
          className="sticky bottom-0 z-10 h-4 w-full shrink-0 overflow-x-scroll overscroll-x-contain"
        >
          <div style={{ width: size.scrollWidth, height: 1 }} />
        </div>
      ) : null}
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  // `className` stays last so consumers can override the sticky background.
  const sticky = React.use(TableStyleContext).stickyHeader;
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", sticky && "sticky top-0 z-10 bg-background", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

/** Opaque twin of the footer's `bg-muted/50`, for a sticky footer the body scrolls under. */
const FOOTER_SURFACE = "bg-[color-mix(in_oklab,var(--muted)_50%,var(--background))]";

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  // `className` stays last so consumers can override the sticky background.
  const sticky = React.use(TableStyleContext).stickyFooter;
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        sticky && `sticky bottom-0 z-10 ${FOOTER_SURFACE}`,
        className,
      )}
      {...props}
    />
  );
}

type TableSortDirection = "asc" | "desc";

type TableRowState = "warning" | "error" | "selected";

/** Row tint per state — semantic tokens only, so every table flags rows the same way. */
const ROW_STATE: Record<TableRowState, string> = {
  warning: "bg-warning/10 hover:bg-warning/15",
  error: "bg-destructive/10 hover:bg-destructive/15",
  selected: "bg-muted",
};

/** Row separators per `Table` `division`. Zebra hovers in primary so it stands out from the stripe. */
const ROW_DIVISION: Record<TableDivision, string | undefined> = {
  lines: undefined,
  zebra: "border-0 hover:bg-primary/10",
  cards: "border-0",
  plain: "border-0",
};

type TableRowProps = React.ComponentProps<"tr"> & {
  /** Tints the row (`warning`, `error`, `selected`). Colour is never the only signal: pair it with text. */
  state?: TableRowState;
  /**
   * Takes the stripe when the table's `division` is `"zebra"` — set it on every other
   * body row (`DataTable` does this itself). Ignored when the row has a `state`.
   */
  striped?: boolean;
};

function TableRow({ className, state, striped, ...props }: TableRowProps) {
  const { division } = React.use(TableStyleContext);
  // One tint per row: a flagged or selected row drops the stripe.
  const selected = (props as { "data-state"?: string })["data-state"] === "selected";
  const stripe = division === "zebra" && !!striped && !state && !selected;
  return (
    <tr
      data-slot="table-row"
      data-row-state={state}
      data-striped={stripe || undefined}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        ROW_DIVISION[division],
        stripe && "bg-muted/50",
        state && ROW_STATE[state],
        className,
      )}
      {...props}
    />
  );
}

type CellLayoutProps = {
  /** Right-aligns and uses tabular figures — for numbers and money. */
  numeric?: boolean;
  /**
   * Freezes the column to an edge while the table scrolls horizontally. Give
   * every cell of the column (header and body) the same `pinned` + `pinOffset`.
   */
  pinned?: "left" | "right";
  /** Distance from the pinned edge (px number or CSS length), e.g. the widths of columns pinned before this one. Default `0`. */
  pinOffset?: number | string;
};

/**
 * A pinned cell must be opaque (content scrolls under it), so the row's
 * translucent tint can't show through. Repaint the same tint pre-mixed onto
 * `--background`, from the semantic tokens, so pinned columns match the row.
 * Card rows paint every body cell this way (the row sits on a muted backdrop).
 */
const ROW_TINTS = cn(
  "[tfoot>tr>&]:bg-[color-mix(in_oklab,var(--muted)_50%,var(--background))]",
  "[tr[data-state=selected]>&]:bg-muted [tr[data-row-state=selected]>&]:bg-muted",
  "[tr[data-row-state=warning]>&]:bg-[color-mix(in_oklab,var(--warning)_10%,var(--background))]",
  "[tr[data-row-state=warning]:hover>&]:bg-[color-mix(in_oklab,var(--warning)_15%,var(--background))]",
  "[tr[data-row-state=error]>&]:bg-[color-mix(in_oklab,var(--destructive)_10%,var(--background))]",
  "[tr[data-row-state=error]:hover>&]:bg-[color-mix(in_oklab,var(--destructive)_15%,var(--background))]",
);

const PINNED_SURFACE = cn(
  "bg-background",
  "[tbody>tr:hover>&]:bg-[color-mix(in_oklab,var(--muted)_50%,var(--background))]",
  ROW_TINTS,
);

/**
 * Zebra: stripe and primary hover, opaque. The hover skips flagged rows and outranks the
 * stripe; striped rows never carry a `state` (see `TableRow`), so `state` always wins.
 */
const ZEBRA_SURFACE = cn(
  "bg-background",
  "[tbody>tr[data-striped]>&]:bg-[color-mix(in_oklab,var(--muted)_50%,var(--background))]",
  "[tbody>tr:not([data-row-state]):hover>&]:bg-[color-mix(in_oklab,var(--primary)_10%,var(--background))]",
  ROW_TINTS,
);

const surface = (division: TableDivision) => (division === "zebra" ? ZEBRA_SURFACE : PINNED_SURFACE);

/** Card rows: rounded ends on each row's first and last cell. */
const CARD_CELL = "first:rounded-l-md last:rounded-r-md";

/** Header and cell heights per `density`. Fonts are left to the app (`text-xs`…). */
const HEAD_DENSITY: Record<TableDensity, string> = { compact: "h-8", default: "h-10" };
const CELL_DENSITY: Record<TableDensity, string> = { compact: "h-8 py-1", default: "h-10" };

/** Opaque twin of the sorted-header `bg-primary/10` tint, for pinned headers. */
const PINNED_SORTED = "bg-[color-mix(in_oklab,var(--primary)_10%,var(--background))]";

function pinProps(
  { pinned, pinOffset = 0 }: CellLayoutProps,
  division: TableDivision,
  style?: React.CSSProperties,
) {
  if (!pinned) return { className: undefined, style };
  return {
    className: cn("sticky z-[5]", surface(division)),
    style: { ...style, [pinned]: pinOffset } as React.CSSProperties,
  };
}

type TableHeadProps = React.ComponentProps<"th"> &
  CellLayoutProps & {
    /** Makes the header a button that requests a sort. Sorting itself is the app's job (typically server-side). */
    sortable?: boolean;
    /** Current direction for this column; `null`/`undefined` = not the sorted column. */
    sortDirection?: TableSortDirection | null;
    /** Called when the header button is pressed. The app decides the cycle (asc → desc → none). */
    onSortChange?: () => void;
    /**
     * Adds a drag handle on the header's right edge (also keyboard: focus it,
     * then ←/→, Shift for bigger steps). To shrink a column below its content,
     * set `layout="fixed"` on `Table`.
     */
    resizable?: boolean;
    /** Accessible name of the resize handle. Default `Resize <header text>`. */
    resizeLabel?: string;
    /** Controlled column width in px. Pair with `onWidthChange`. */
    width?: number;
    /** Initial width in px when uncontrolled. Omit to start from the natural width. */
    defaultWidth?: number;
    /** Lower bound while resizing, px. Default `48`. */
    minWidth?: number;
    /** Upper bound while resizing, px. Default unbounded. */
    maxWidth?: number;
    /** Fires on every resize step with the new clamped width — persist it (debounced) if needed. */
    onWidthChange?: (width: number) => void;
    /** A pointer drag of the handle begins — keyboard steps don't fire it. */
    onResizeStart?: () => void;
    /** The pointer drag ends (released or cancelled). */
    onResizeEnd?: () => void;
  };

const ARIA_SORT = { asc: "ascending", desc: "descending" } as const;

/**
 * Column header. With `sortable` it renders a button and sets `aria-sort`.
 * The library holds no sort state — pass `sortDirection` and handle `onSortChange`.
 *
 * With `resizable` it gets a width handle; width is uncontrolled
 * (`defaultWidth`) or controlled (`width` + `onWidthChange`).
 */
function TableHead({
  className,
  children,
  numeric,
  pinned,
  pinOffset,
  sortable,
  sortDirection,
  onSortChange,
  resizable,
  resizeLabel,
  width: widthProp,
  defaultWidth,
  minWidth = 48,
  maxWidth = Number.POSITIVE_INFINITY,
  onWidthChange,
  onResizeStart,
  onResizeEnd,
  style,
  ...props
}: TableHeadProps) {
  const [uncontrolledWidth, setUncontrolledWidth] = React.useState(defaultWidth);
  const width = widthProp ?? uncontrolledWidth;
  const resize = (next: number) => {
    const clamped = Math.round(Math.min(maxWidth, Math.max(minWidth, next)));
    if (clamped === width) return;
    if (widthProp === undefined) setUncontrolledWidth(clamped);
    onWidthChange?.(clamped);
  };
  const { division, density } = React.use(TableStyleContext);
  const pin = pinProps({ pinned, pinOffset }, division, width === undefined ? style : { ...style, width });
  const Icon = sortDirection === "asc" ? ArrowUp : sortDirection === "desc" ? ArrowDown : ChevronsUpDown;
  return (
    <th
      data-slot="table-head"
      aria-sort={sortable ? (sortDirection ? ARIA_SORT[sortDirection] : "none") : undefined}
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        density && HEAD_DENSITY[density],
        numeric && "text-right",
        // Anchors the resize handle; a pinned header's `sticky` (merged after) also anchors it.
        resizable && "relative",
        pin.className,
        // The sorted column is tinted, so it reads at a glance, not only by its icon.
        sortable && sortDirection && (pinned ? PINNED_SORTED : "bg-primary/10"),
        className,
      )}
      style={pin.style}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSortChange}
          className={cn(
            "-mx-1 inline-flex items-center gap-1 rounded px-1 font-medium outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
            numeric && "flex-row-reverse",
          )}
        >
          {children}
          <Icon
            aria-hidden="true"
            className={cn("size-3.5 shrink-0", sortDirection ? "text-foreground" : "text-muted-foreground")}
          />
        </button>
      ) : (
        children
      )}
      {resizable ? (
        <ColumnResizeHandle
          label={resizeLabel ?? (typeof children === "string" ? `Resize ${children}` : "Resize column")}
          width={width}
          minWidth={minWidth}
          maxWidth={maxWidth}
          onResize={resize}
          onResizeStart={onResizeStart}
          onResizeEnd={onResizeEnd}
        />
      ) : null}
    </th>
  );
}

/** Drag/keyboard separator on a header's right edge. Measures the `<th>`, so it works before any width is set. */
function ColumnResizeHandle({
  label,
  width,
  minWidth,
  maxWidth,
  onResize,
  onResizeStart,
  onResizeEnd,
}: {
  label: string;
  width?: number;
  minWidth: number;
  maxWidth: number;
  onResize: (width: number) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
}) {
  const drag = React.useRef<{ x: number; width: number } | null>(null);
  const headWidth = (handle: HTMLElement) =>
    (handle.parentElement as HTMLElement).getBoundingClientRect().width;
  const stop = () => {
    if (!drag.current) return;
    drag.current = null;
    onResizeEnd?.();
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={width}
      aria-valuemin={minWidth}
      aria-valuemax={Number.isFinite(maxWidth) ? maxWidth : undefined}
      tabIndex={0}
      data-slot="table-resize-handle"
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture?.(event.pointerId);
        drag.current = { x: event.clientX, width: headWidth(event.currentTarget) };
        onResizeStart?.();
      }}
      onPointerMove={(event) => {
        if (drag.current) onResize(drag.current.width + event.clientX - drag.current.x);
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 50 : 10;
        const delta = event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0;
        if (!delta) return;
        event.preventDefault();
        onResize((width ?? headWidth(event.currentTarget)) + delta);
      }}
      className={cn(
        "absolute inset-y-0 -right-1 z-[1] w-2 cursor-col-resize touch-none select-none outline-none",
        "after:absolute after:inset-y-2 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-border",
        "hover:after:w-0.5 hover:after:bg-primary focus-visible:after:w-0.5 focus-visible:after:bg-primary",
      )}
    />
  );
}

type TableCellProps = React.ComponentProps<"td"> &
  CellLayoutProps & {
    /** Shown instead of `null`, `undefined` or `""` (a real `0` still renders). Typically `"—"`. */
    fallback?: React.ReactNode;
    /** Clips long text to one line (`max-w-48`; override with `className`) and exposes the full text as `title`. */
    truncate?: boolean;
  };

function isEmpty(node: React.ReactNode) {
  return node === null || node === undefined || node === "" || node === false;
}

function TableCell({
  className,
  children,
  numeric,
  pinned,
  pinOffset,
  fallback,
  truncate,
  style,
  title,
  ...props
}: TableCellProps) {
  const { division, density } = React.use(TableStyleContext);
  const pin = pinProps({ pinned, pinOffset }, division, style);
  const empty = fallback !== undefined && isEmpty(children);
  const content = empty ? fallback : children;
  return (
    <td
      data-slot="table-cell"
      title={title ?? (truncate && typeof content === "string" ? content : undefined)}
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        density && CELL_DENSITY[density],
        // Cards: the row sits on a muted backdrop, so every cell paints the opaque row tint.
        division === "cards" && cn(CARD_CELL, !pinned && surface(division)),
        numeric && "text-right tabular-nums",
        truncate && "max-w-48 truncate",
        empty && "text-muted-foreground",
        pin.className,
        className,
      )}
      style={pin.style}
      {...props}
    >
      {content}
    </td>
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
export type {
  TableCellProps,
  TableDensity,
  TableDivision,
  TableHeadProps,
  TableProps,
  TableRowProps,
  TableRowState,
  TableSortDirection,
};
