"use client";

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
    <TableScrollContainer stickyHeader={stickyHeader} stickyScrollbar={stickyHorizontalScrollbar}>
      {table}
    </TableScrollContainer>
  );
}

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
          stickyHeader &&
            "min-h-0 flex-1 overflow-y-auto [&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead]:bg-background",
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
  return <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />;
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

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
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
export type { TableProps };
