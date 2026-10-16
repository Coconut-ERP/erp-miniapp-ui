import { fireEvent, render, screen } from "@testing-library/react";
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

it("tints only the sorted column header", () => {
  render(
    <Table><TableHeader><TableRow>
      <TableHead sortable sortDirection="asc">A</TableHead>
      <TableHead sortable sortDirection={null}>B</TableHead>
    </TableRow></TableHeader></Table>,
  );
  const [a, b] = screen.getAllByRole("columnheader");
  expect(a).toHaveClass("bg-primary/10");
  expect(b).not.toHaveClass("bg-primary/10");
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

describe("TableHead resizing", () => {
  const head = (props: React.ComponentProps<typeof TableHead>) =>
    render(
      <Table layout="fixed"><TableHeader><TableRow>
        <TableHead {...props}>Name</TableHead>
      </TableRow></TableHeader></Table>,
    );

  it("has no handle unless resizable", () => {
    head({});
    expect(screen.queryByRole("separator")).toBeNull();
  });

  it("applies defaultWidth and steps with the keyboard, clamped", async () => {
    const onWidth = vi.fn();
    head({ resizable: true, defaultWidth: 100, minWidth: 95, onWidthChange: onWidth });
    const handle = screen.getByRole("separator", { name: "Resize Name" });
    expect(screen.getByRole("columnheader").style.width).toBe("100px");

    handle.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onWidth).toHaveBeenLastCalledWith(110);
    expect(screen.getByRole("columnheader").style.width).toBe("110px");
    expect(handle).toHaveAttribute("aria-valuenow", "110");

    await userEvent.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    expect(onWidth).toHaveBeenLastCalledWith(95);
  });

  it("stays controlled by width", async () => {
    const onWidth = vi.fn();
    head({ resizable: true, width: 120, onWidthChange: onWidth });
    screen.getByRole("separator").focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(onWidth).toHaveBeenCalledWith(110);
    expect(screen.getByRole("columnheader").style.width).toBe("120px");
  });

  it("follows a pointer drag", () => {
    const onWidth = vi.fn();
    head({ resizable: true, onWidthChange: onWidth });
    const handle = screen.getByRole("separator");
    // jsdom measures the header as 0px wide, so the drag distance is the width.
    fireEvent.pointerDown(handle, { button: 0, clientX: 10 });
    fireEvent.pointerMove(handle, { clientX: 160 });
    fireEvent.pointerUp(handle);
    fireEvent.pointerMove(handle, { clientX: 300 });
    expect(onWidth).toHaveBeenCalledTimes(1);
    expect(onWidth).toHaveBeenCalledWith(150);
  });

  it("fixed layout clips cell overflow", () => {
    head({});
    expect(screen.getByRole("table")).toHaveClass("table-fixed");
  });
});

it("pinned cells repaint the row tint opaquely", () => {
  render(
    <Table><TableHeader><TableRow>
      <TableHead pinned="left" sortable sortDirection="asc">A</TableHead>
    </TableRow></TableHeader><TableBody><TableRow state="warning">
      <TableCell pinned="left">x</TableCell>
    </TableRow></TableBody></Table>,
  );
  expect(screen.getByRole("cell").className).toContain("[tr[data-row-state=warning]>&]:bg-[color-mix(");
  const head = screen.getByRole("columnheader");
  expect(head.className).toContain("bg-[color-mix(in_oklab,var(--primary)_10%,var(--background))]");
  expect(head).not.toHaveClass("bg-primary/10");
});
