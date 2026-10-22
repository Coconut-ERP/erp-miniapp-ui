import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { expect, waitFor, within } from "storybook/test";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta: Meta<typeof Table> = {
  title: "UI/Table",
  component: Table,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

const rows = [
  { id: "1", name: "Alice", role: "Admin" },
  { id: "2", name: "Bob", role: "Member" },
];

const wideColumns = Array.from({ length: 14 }, (_, i) => `Column ${i + 1}`);
const manyRows = Array.from({ length: 60 }, (_, i) => i + 1);

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of users.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/**
 * `stickyHeader` keeps `<thead>` pinned while the body scrolls. The table
 * container owns both scroll directions, so its native scrollbars — vertical,
 * and horizontal at the bottom of the visible area — stay reachable at any
 * scroll position (`stickyHorizontalScrollbar` adds nothing here). The parent
 * only needs a bounded height.
 */
export const StickyHeaderAndScrollbar: Story = {
  render: () => (
    <div className="h-72 w-full rounded-md border">
      <Table stickyHeader stickyHorizontalScrollbar>
        <TableHeader>
          <TableRow>
            {wideColumns.map((column) => (
              <TableHead key={column} className="min-w-40">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {manyRows.map((row) => (
            <TableRow key={row}>
              {wideColumns.map((column) => (
                <TableCell key={column}>{`${column} – row ${row}`}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole("table");
    const viewport = table.parentElement as HTMLElement;

    // Native scrollbars stay: hiding them would hide the vertical one too.
    expect(canvasElement.querySelector('[data-slot="table-sticky-scrollbar"]')).toBeNull();
    expect(getComputedStyle(viewport).scrollbarWidth).not.toBe("none");

    // The header stays pinned: the table container owns the vertical scroll.
    const thead = table.querySelector("thead") as HTMLElement;
    expect(getComputedStyle(viewport).overflowY).toBe("auto");
    expect(getComputedStyle(thead).position).toBe("sticky");

    viewport.scrollTop = 400;
    await waitFor(() =>
      expect(thead.getBoundingClientRect().top).toBeCloseTo(
        viewport.getBoundingClientRect().top,
        0,
      ),
    );
  },
};

/**
 * Without `stickyHeader` the page (here: a scrolling parent) scrolls vertically, and
 * `stickyHorizontalScrollbar` keeps a proxy horizontal bar at the bottom of the
 * visible area instead of the end of the table.
 */
export const StickyScrollbarInScrollingPage: Story = {
  render: () => (
    <div className="h-72 w-full overflow-y-auto rounded-md border">
      <Table stickyHorizontalScrollbar>
        <TableHeader>
          <TableRow>
            {wideColumns.map((column) => (
              <TableHead key={column} className="min-w-40">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {manyRows.map((row) => (
            <TableRow key={row}>
              {wideColumns.map((column) => (
                <TableCell key={column}>{`${column} \u2013 row ${row}`}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole("table");
    const viewport = table.parentElement as HTMLElement;
    const bar = canvasElement.querySelector<HTMLElement>(
      '[data-slot="table-sticky-scrollbar"]',
    ) as HTMLElement;

    // The proxy bar is as wide as the real scrollable content.
    await waitFor(() => expect(bar.scrollWidth).toBe(viewport.scrollWidth));

    // Sticky bar -> table viewport.
    bar.scrollLeft = 120;
    bar.dispatchEvent(new Event("scroll", { bubbles: true }));
    await waitFor(() => expect(viewport.scrollLeft).toBe(120));

    // Table viewport -> sticky bar.
    viewport.scrollLeft = 40;
    viewport.dispatchEvent(new Event("scroll", { bubbles: true }));
    await waitFor(() => expect(bar.scrollLeft).toBe(40));
  },
};

/** Controlled sorting + `numeric`, `fallback`, `truncate`, `pinned` and row `state`. */
export const SortableAndSmartCells: Story = {
  render: function Render() {
    const [dir, setDir] = React.useState<"asc" | "desc" | null>("asc");
    const data = [
      { id: "1", name: "A very long product name that gets clipped", qty: 1200, note: null },
      { id: "2", name: "Bob", qty: 0, note: "ok" },
    ];
    const sorted = dir === "desc" ? [...data].reverse() : data;
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead pinned="left">Name</TableHead>
            <TableHead numeric sortable sortDirection={dir} onSortChange={() => setDir(dir === "asc" ? "desc" : "asc")}>
              Qty
            </TableHead>
            <TableHead>Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => (
            <TableRow key={row.id} state={row.qty === 0 ? "warning" : undefined}>
              <TableCell pinned="left" truncate>{row.name}</TableCell>
              <TableCell numeric>{row.qty}</TableCell>
              <TableCell fallback="—">{row.note}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

/**
 * `resizable` headers: drag the right edge (or focus it and use ←/→, Shift
 * for 50px steps). `layout="fixed"` lets a column shrink below its content and
 * clips the overflow with an ellipsis. "Name" is controlled — the app owns the
 * width and could persist it; the others are uncontrolled via `defaultWidth`.
 */
export const ResizableColumns: Story = {
  render: function Render() {
    const [nameWidth, setNameWidth] = React.useState(220);
    const data = [
      { id: "1", name: "A very long product name that gets clipped", sku: "SKU-0001", qty: 1200 },
      { id: "2", name: "Bob", sku: "SKU-0002", qty: 0 },
    ];
    return (
      <div className="space-y-2">
        <Table layout="fixed">
          <TableHeader>
            <TableRow>
              <TableHead resizable width={nameWidth} onWidthChange={setNameWidth} minWidth={80}>
                Name
              </TableHead>
              <TableHead resizable defaultWidth={140}>SKU</TableHead>
              <TableHead resizable defaultWidth={100} numeric>Qty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell title={row.name}>{row.name}</TableCell>
                <TableCell>{row.sku}</TableCell>
                <TableCell numeric>{row.qty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground">Name width: {nameWidth}px</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = canvas.getByRole("separator", { name: "Resize Name" });
    handle.focus();
    handle.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight", shiftKey: true }));
    // Spare table width is shared across columns, so assert the requested width, not pixels.
    await waitFor(() => expect(handle).toHaveAttribute("aria-valuenow", "270"));
    expect(canvas.getByText("Name width: 270px")).toBeInTheDocument();
  },
};
