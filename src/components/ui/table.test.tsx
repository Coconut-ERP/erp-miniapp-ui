import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./table";

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

describe("Table division", () => {
  const rows = (division: React.ComponentProps<typeof Table>["division"]) =>
    render(
      <Table division={division}><TableBody>
        <TableRow><TableCell pinned="left">a</TableCell></TableRow>
        <TableRow striped><TableCell pinned="left">b</TableCell></TableRow>
        <TableRow striped state="error"><TableCell pinned="left">c</TableCell></TableRow>
      </TableBody></Table>,
    );

  it("lines keeps the row border and ignores striped", () => {
    rows("lines");
    const [, b] = screen.getAllByRole("row");
    expect(b).toHaveClass("border-b");
    expect(b).not.toHaveAttribute("data-striped");
  });

  it("zebra stripes striped rows, but state wins over the stripe", () => {
    rows("zebra");
    const [a, b, c] = screen.getAllByRole("row");
    expect(a).toHaveClass("border-0");
    expect(a).not.toHaveAttribute("data-striped");
    expect(b).toHaveAttribute("data-striped");
    expect(b).toHaveClass("bg-muted/50");
    expect(c).not.toHaveAttribute("data-striped");
    expect(c).toHaveClass("bg-destructive/10");
    expect(c).not.toHaveClass("bg-muted/50");
    // Pinned cells repaint the stripe opaquely; the zebra hover skips flagged rows.
    const pinned = screen.getAllByRole("cell")[0]!.className;
    expect(pinned).toContain("[tbody>tr[data-striped]>&]:bg-[color-mix(");
    expect(pinned).toContain("[tbody>tr:not([data-row-state]):hover>&]");
    expect(pinned).toContain("[tr[data-row-state=error]>&]:bg-[color-mix(");
  });

  it("cards separates rows and paints every cell opaquely", () => {
    render(
      <Table division="cards"><TableBody><TableRow state="warning">
        <TableCell>x</TableCell>
      </TableRow></TableBody></Table>,
    );
    expect(screen.getByRole("table")).toHaveClass("border-separate", "border-spacing-y-1");
    const cell = screen.getByRole("cell");
    expect(cell).toHaveClass("bg-background", "first:rounded-l-md");
    expect(cell.className).toContain("[tr[data-row-state=warning]>&]:bg-[color-mix(");
  });

  it("plain drops separators", () => {
    rows("plain");
    expect(screen.getAllByRole("row")[0]).toHaveClass("border-0");
  });
});

it("stickyFooter pins an opaque tfoot and makes the container scroll", () => {
  const { container } = render(
    <Table stickyFooter><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody>
      <TableFooter><TableRow><TableCell>Σ</TableCell></TableRow></TableFooter></Table>,
  );
  const tfoot = container.querySelector("tfoot")!;
  expect(tfoot).toHaveClass("sticky", "bottom-0");
  expect(tfoot.className).toContain("bg-[color-mix(in_oklab,var(--muted)_50%,var(--background))]");
  expect(container.querySelector("[data-slot=table-container]")).toHaveClass("overflow-y-auto");
});

it.each([
  ["compact", "h-8"],
  ["default", "h-10"],
] as const)("density %s sets row height %s", (density, height) => {
  render(
    <Table density={density}><TableHeader><TableRow><TableHead>A</TableHead></TableRow></TableHeader>
      <TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table>,
  );
  expect(screen.getByRole("cell")).toHaveClass(height);
  expect(screen.getByRole("columnheader")).toHaveClass(height);
});

describe("stickyHorizontalScrollbar", () => {
  const table = (props: React.ComponentProps<typeof Table>) =>
    render(<Table {...props}><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table>);

  it("keeps native scrollbars when the container scrolls vertically", () => {
    const { container } = table({ stickyHeader: true, stickyHorizontalScrollbar: true });
    expect(container.querySelector("[data-slot=table-sticky-scrollbar]")).toBeNull();
    expect(container.querySelector("[data-slot=table-container]")!.className).not.toContain("scrollbar-width:none");
  });

  it("uses the proxy bar when the page scrolls", () => {
    const { container } = table({ stickyHorizontalScrollbar: true });
    expect(container.querySelector("[data-slot=table-sticky-scrollbar]")).not.toBeNull();
    expect(container.querySelector("[data-slot=table-container]")!.className).toContain("scrollbar-width:none");
  });
});
