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
   * instead of the end of the table content. Opt-in; default `false`.
   */
  stickyHorizontalScrollbar?: boolean;
};

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
function Table({ className, stickyHeader, stickyHorizontalScrollbar, ...props }: TableProps) {
  const table = (
    <table data-slot="table" className={cn("w-full caption-bottom text-sm", className)} {...props} />
  );

  if (!stickyHeader && !stickyHorizontalScrollbar) {
    return (
      <div data-slot="table-container" className="relative w-full overflow-x-auto">
        {table}
      </div>
    );
  }

  return (
    <StickyHeaderContext value={!!stickyHeader}>
      <TableScrollContainer stickyHeader={stickyHeader} stickyScrollbar={stickyHorizontalScrollbar}>
        {table}
      </TableScrollContainer>
    </StickyHeaderContext>
  );
}

const StickyHeaderContext = React.createContext(false);

function TableScrollContainer({
  stickyHeader,
  stickyScrollbar,
  children,
}: {
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
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    for (const child of Array.from(viewport.children)) observer.observe(child);
    return () => observer.disconnect();
  }, []);

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
          stickyScrollbar && "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {children}
      </div>
      {stickyScrollbar ? (
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
  const sticky = React.use(StickyHeaderContext);
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

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
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

type TableRowProps = React.ComponentProps<"tr"> & {
  /** Tints the row (`warning`, `error`, `selected`). Colour is never the only signal: pair it with text. */
  state?: TableRowState;
};

function TableRow({ className, state, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      data-row-state={state}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
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

function pinProps({ pinned, pinOffset = 0 }: CellLayoutProps, style?: React.CSSProperties) {
  if (!pinned) return { className: undefined, style };
  return {
    className: "sticky z-[5] bg-background",
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
  };

const ARIA_SORT = { asc: "ascending", desc: "descending" } as const;

/**
 * Column header. With `sortable` it renders a button and sets `aria-sort`.
 * The library holds no sort state — pass `sortDirection` and handle `onSortChange`.
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
  style,
  ...props
}: TableHeadProps) {
  const pin = pinProps({ pinned, pinOffset }, style);
  const Icon = sortDirection === "asc" ? ArrowUp : sortDirection === "desc" ? ArrowDown : ChevronsUpDown;
  return (
    <th
      data-slot="table-head"
      aria-sort={sortable ? (sortDirection ? ARIA_SORT[sortDirection] : "none") : undefined}
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        numeric && "text-right",
        pin.className,
        // The sorted column is tinted, so it reads at a glance, not only by its icon.
        sortable && sortDirection && "bg-primary/10",
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
    </th>
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
  const pin = pinProps({ pinned, pinOffset }, style);
  const empty = fallback !== undefined && isEmpty(children);
  const content = empty ? fallback : children;
  return (
    <td
      data-slot="table-cell"
      title={title ?? (truncate && typeof content === "string" ? content : undefined)}
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
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
  TableHeadProps,
  TableProps,
  TableRowProps,
  TableRowState,
  TableSortDirection,
};
