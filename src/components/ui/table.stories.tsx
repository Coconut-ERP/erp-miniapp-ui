import type { Meta, StoryObj } from "@storybook/react-vite";
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
 * Opt-in `stickyHorizontalScrollbar`: inside a fixed-height `overflow-y-auto`
 * parent the horizontal bar stays pinned to the bottom of the visible area, so
 * it is reachable at the top of the list as well as the bottom.
 */
export const StickyHorizontalScrollbar: Story = {
  render: () => (
    <div className="h-72 w-full overflow-y-auto rounded-md border">
      <Table stickyHorizontalScrollbar>
        <TableHeader className="sticky top-0 z-20 bg-background">
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
    const viewport = canvas.getByRole("table").parentElement as HTMLElement;
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
