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
 * `stickyHeader` keeps `<thead>` pinned while the body scrolls, and
 * `stickyHorizontalScrollbar` keeps the horizontal bar at the bottom of the
 * visible area — both reachable at any vertical scroll position. The parent
 * only needs a bounded height; the table owns the scrolling.
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
