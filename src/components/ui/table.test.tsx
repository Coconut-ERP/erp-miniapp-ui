import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

describe("TableHead sorting", () => {
  it("is a plain header unless sortable", () => {
    render(<Table><TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader></Table>);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("columnheader")).not.toHaveAttribute("aria-sort");
  });

  it.each([
    ["asc", "ascending"],
    ["desc", "descending"],
    [null, "none"],
  ] as const)("maps %s to aria-sort=%s and fires onSortChange", async (dir, aria) => {
    const onSort = vi.fn();
    render(
      <Table><TableHeader><TableRow>
        <TableHead sortable sortDirection={dir} onSortChange={onSort}>Name</TableHead>
      </TableRow></TableHeader></Table>,
    );
    expect(screen.getByRole("columnheader")).toHaveAttribute("aria-sort", aria);
    await userEvent.click(screen.getByRole("button", { name: "Name" }));
    expect(onSort).toHaveBeenCalledTimes(1);
  });
});

describe("TableCell", () => {
  const cell = (props: React.ComponentProps<typeof TableCell>) => {
    render(<Table><TableBody><TableRow><TableCell {...props} /></TableRow></TableBody></Table>);
    return screen.getByRole("cell");
  };

  it("shows fallback for empty values but keeps 0", () => {
    expect(cell({ fallback: "—", children: null })).toHaveTextContent("—");
  });
  it("keeps a real 0", () => {
    expect(cell({ fallback: "—", children: 0 })).toHaveTextContent("0");
  });
  it("numeric right-aligns; truncate sets title", () => {
    const c = cell({ numeric: true, truncate: true, children: "long text" });
    expect(c).toHaveClass("text-right", "tabular-nums", "truncate");
    expect(c).toHaveAttribute("title", "long text");
  });
  it("pinned cell is sticky at its offset", () => {
    const c = cell({ pinned: "left", pinOffset: 40, children: "x" });
    expect(c).toHaveClass("sticky");
    expect(c.style.left).toBe("40px");
  });
});

describe("TableRow state", () => {
  it("tags the row", () => {
    render(<Table><TableBody><TableRow state="warning"><TableCell>x</TableCell></TableRow></TableBody></Table>);
    expect(screen.getByRole("row")).toHaveAttribute("data-row-state", "warning");
  });
});
