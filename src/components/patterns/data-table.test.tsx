import {
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  createColumnHelper,
  createSortedRowModel,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DataTable, type DataTableApi, type DataTableColumnMeta } from "./data-table";

type Person = { id: string; name: string; qty: number; note: string | null };
const DATA: Person[] = [
  { id: "1", name: "Bob", qty: 2, note: null },
  { id: "2", name: "Alice", qty: 10, note: "ok" },
];

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
  columnSizingFeature,
  columnResizingFeature,
  columnPinningFeature,
  rowSelectionFeature,
  columnMeta: {} as DataTableColumnMeta,
});
const helper = createColumnHelper<typeof features, Person>();
const columns = helper.columns([
  helper.accessor("name", { header: "Name", size: 160 }),
  helper.accessor("qty", { header: "Qty", size: 80, meta: { numeric: true }, footer: "Total" }),
  helper.accessor("note", { header: "Note", size: 120, enableSorting: false, meta: { fallback: "—" } }),
]);

function Demo({ data = DATA, selected = {} }: { data?: Person[]; selected?: Record<string, true> }) {
  const table = useTable({
    features,
    columns,
    data,
    getRowId: (row) => row.id,
    initialState: { columnPinning: { start: ["note"], end: [] }, rowSelection: selected },
  });
  return <DataTable table={table} empty="Không có dữ liệu" resizeLabel={(n) => `Đổi độ rộng ${n}`} />;
}

const bodyNames = () =>
  screen.getAllByRole("row").slice(1, -1).map((row) => within(row).getAllByRole("cell")[1]?.textContent);

describe("DataTable", () => {
  it("renders headers, cells, meta and footer", () => {
    render(<Demo />);
    const heads = screen.getAllByRole("columnheader").map((h) => h.textContent);
    // Pinned-start column renders first.
    expect(heads).toEqual(["Note", "Name", "Qty"]);
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /^Qty/ })).toHaveClass("text-right");
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  it("sorts through the header button", async () => {
    render(<Demo />);
    expect(bodyNames()).toEqual(["Bob", "Alice"]);
    await userEvent.click(screen.getByRole("button", { name: /^Name/ }));
    expect(bodyNames()).toEqual(["Alice", "Bob"]);
    expect(screen.getByRole("columnheader", { name: /^Name/ })).toHaveAttribute("aria-sort", "ascending");
    // enableSorting: false → plain header.
    expect(screen.queryByRole("button", { name: /^Note/ })).toBeNull();
  });

  it("sizes columns and resizes with the keyboard", async () => {
    render(<Demo />);
    const table = screen.getByRole("table");
    expect(table).toHaveClass("table-fixed");
    expect(table.style.width).toBe("360px");
    const handle = screen.getByRole("separator", { name: "Đổi độ rộng Name" });
    expect(handle).not.toHaveAttribute("aria-valuemax");
    handle.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("columnheader", { name: /^Name/ }).style.width).toBe("170px");
    expect(table.style.width).toBe("370px");
  });

  it("keeps body cells still while a column is dragged", () => {
    let renders = 0;
    const counted = helper.columns([
      helper.accessor("name", {
        header: "Name",
        size: 160,
        cell: ({ getValue }) => {
          renders += 1;
          return getValue();
        },
      }),
      helper.accessor("qty", { header: "Qty", size: 80 }),
    ]);
    function Drag() {
      const table = useTable({ features, columns: counted, data: DATA, getRowId: (row) => row.id });
      // A fresh callback every render, like most apps pass.
      return <DataTable table={table} getRowProps={(row) => ({ "data-id": row.id })} />;
    }
    render(<Drag />);
    expect(renders).toBe(2);

    const handle = screen.getByRole("separator", { name: "Resize Name" });
    fireEvent.pointerDown(handle, { button: 0, clientX: 100, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 150, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 200, pointerId: 1 });
    // jsdom measures the <th> as 0px wide, so the drag starts from 0.
    expect(screen.getByRole("columnheader", { name: /^Name/ }).style.width).toBe("100px");
    expect(renders).toBe(2);

    // Released: the body renders once more to pick up the latest callbacks.
    fireEvent.pointerUp(handle, { pointerId: 1 });
    expect(renders).toBe(4);
  });

  it("pins with offsets and tints selected rows", () => {
    render(<Demo selected={{ "2": true }} />);
    const note = screen.getByRole("columnheader", { name: /^Note/ });
    expect(note).toHaveClass("sticky");
    expect(note.style.left).toBe("0px");
    // Body cells read the offset from a variable on <table>, so a resize doesn't touch them.
    expect(screen.getByRole("table").style.getPropertyValue("--data-table-pin-0")).toBe("0px");
    expect(screen.getByText("—").closest("td")?.style.left).toBe("var(--data-table-pin-0)");
    const alice = screen.getByRole("row", { selected: true });
    expect(alice).toHaveAttribute("data-row-state", "selected");
  });

  it("shows the empty state", () => {
    render(<Demo data={[]} />);
    expect(screen.getByRole("cell", { name: "Không có dữ liệu" })).toHaveAttribute("colspan", "3");
  });

  it("passes data attributes through getRowProps and keeps header rows untinted", () => {
    function Rows() {
      const table = useTable({ features, columns, data: DATA, getRowId: (row) => row.id });
      return <DataTable table={table} getRowProps={(row) => ({ "data-status": row.original.name })} />;
    }
    render(<Rows />);
    const [header, first] = screen.getAllByRole("row");
    expect(first).toHaveAttribute("data-status", "Bob");
    expect(header).toHaveClass("hover:bg-transparent");
  });

  it("zebra stripes by sorted position; a row state replaces the stripe", () => {
    const data: Person[] = [
      { id: "1", name: "Dan", qty: 1, note: null },
      { id: "2", name: "Bob", qty: 1, note: null },
      { id: "3", name: "Cat", qty: 1, note: null },
      { id: "4", name: "Al", qty: 1, note: null },
    ];
    function Rows() {
      const table = useTable({
        features,
        columns,
        data,
        getRowId: (row) => row.id,
        initialState: { sorting: [{ id: "name", desc: false }] },
      });
      return (
        <DataTable
          table={table}
          division="zebra"
          stickyFooter
          getRowProps={(row) => ({ state: row.original.name === "Dan" ? "error" : undefined })}
        />
      );
    }
    const { container } = render(<Rows />);
    const body = [...container.querySelectorAll("tbody > tr")];
    expect(body.map((row) => row.querySelector("td")?.textContent)).toEqual(["Al", "Bob", "Cat", "Dan"]);
    expect(body.map((row) => row.hasAttribute("data-striped"))).toEqual([false, true, false, false]);
    expect(body[3]).toHaveAttribute("data-row-state", "error");
    expect(container.querySelector("tfoot")).toHaveClass("sticky", "bottom-0");
  });
});

describe("DataTable grouped columns", () => {
  const plain = tableFeatures({});
  const g = createColumnHelper<typeof plain, Person>();
  const grouped = g.columns([
    g.accessor("name", { header: "Name", footer: "Sum" }),
    g.group({
      id: "stock",
      header: "Stock",
      columns: g.columns([
        g.accessor("qty", { header: "Qty", footer: () => "12" }),
        g.accessor("note", { header: "Note" }),
      ]),
    }),
  ]);

  function Grouped() {
    const table = useTable({ features: plain, columns: grouped, data: DATA, getRowId: (row) => row.id });
    return (
      <DataTable
        table={table}
        getCellProps={(cell) => ({ id: `${cell.row.id}-${cell.column.id}`, "data-col": cell.column.id })}
        getHeaderProps={(header) => ({ className: `head-${header.column.id}` })}
        getFooterProps={() => ({ className: "foot" })}
      />
    );
  }

  it("spans an ungrouped leaf over the header rows", () => {
    render(<Grouped />);
    const name = screen.getByRole("columnheader", { name: "Name" });
    expect(name).toHaveAttribute("rowspan", "2");
    expect(name).toHaveClass("head-name");
    expect(screen.getByRole("columnheader", { name: "Stock" })).toHaveAttribute("colspan", "2");
    // Two header rows: [Name, Stock] then [Qty, Note] — no empty placeholder cell.
    const headerRows = screen.getAllByRole("row").slice(0, 2);
    expect(headerRows.map((row) => within(row).getAllByRole("columnheader").length)).toEqual([2, 2]);
  });

  it("applies cell props and renders only footer rows with content", () => {
    const { container } = render(<Grouped />);
    expect(container.querySelector("[id=\"1-qty\"]")).toHaveAttribute("data-col", "qty");
    const footRows = container.querySelectorAll("tfoot tr");
    expect(footRows).toHaveLength(1);
    expect(footRows[0]).toHaveTextContent("Sum12");
    expect(footRows[0]?.querySelector("td")).toHaveClass("foot");
  });
});

describe("DataTable virtualize", () => {
  const plain = tableFeatures({});
  const v = createColumnHelper<typeof plain, Person>();
  const cols = v.columns([v.accessor("name", { header: "Name" }), v.accessor("qty", { header: "Qty" })]);
  const many: Person[] = Array.from({ length: 1000 }, (_, i) => ({ id: String(i), name: `P${i}`, qty: i, note: null }));

  // jsdom has no layout: give the marked viewport a 370px window over a tall content,
  // and every row a 37px box, so the virtualizer has something to measure.
  const scrollTo = vi.fn();
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    const isViewport = (el: HTMLElement) => el.dataset.viewport !== undefined;
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(function (this: HTMLElement) {
      return isViewport(this) ? 370 : 0;
    });
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(function (this: HTMLElement) {
      return isViewport(this) ? 37_000 : 0;
    });
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) {
      return this.tagName === "TR" ? 37 : 0;
    });
    // The table container shows 500px of width.
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (this: HTMLElement) {
      return this.dataset.slot === "table-container" ? 500 : 0;
    });
    HTMLElement.prototype.scrollTo = scrollTo as typeof HTMLElement.prototype.scrollTo;
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    scrollTo.mockReset();
  });

  function Many({ data = many, api }: { data?: Person[]; api?: React.Ref<DataTableApi> }) {
    const table = useTable({ features: plain, columns: cols, data, getRowId: (row) => row.id });
    return (
      <div data-viewport="" style={{ overflowY: "auto" }}>
        <DataTable table={table} virtualize apiRef={api} />
      </div>
    );
  }

  it("renders only the rows near the viewport, with spacers for the rest", () => {
    const { container } = render(<Many />);
    const rendered = container.querySelectorAll("tbody tr[data-index]").length;
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(40);
    expect(screen.getByText("P0")).toBeInTheDocument();
    expect(screen.queryByText("P999")).toBeNull();
    const spacer = container.querySelector<HTMLElement>("[data-slot=table-spacer] td");
    expect(Number.parseFloat(spacer?.style.height ?? "0")).toBeGreaterThan(30_000);
  });

  it("renders every row under the threshold", () => {
    const { container } = render(<Many data={many.slice(0, 50)} />);
    expect(container.querySelectorAll("tbody tr")).toHaveLength(50);
    expect(container.querySelector("[data-slot=table-spacer]")).toBeNull();
  });

  it("mounts only the rows that enter the viewport while scrolling", async () => {
    let renders = 0;
    const counted = v.columns([
      v.accessor("name", {
        header: "Name",
        cell: ({ getValue }) => {
          renders += 1;
          return getValue();
        },
      }),
    ]);
    function Counted() {
      const table = useTable({ features: plain, columns: counted, data: many, getRowId: (row) => row.id });
      // Fresh callbacks every render, as apps pass them.
      return (
        <div data-viewport="" style={{ overflowY: "auto" }}>
          <DataTable table={table} virtualize getRowProps={(row) => ({ "data-id": row.id })} />
        </div>
      );
    }
    const { container } = render(<Counted />);
    const viewport = container.querySelector<HTMLElement>("[data-viewport]");
    if (!viewport) throw new Error("no viewport");
    const before = renders;

    // One row down: one row enters, the others stay mounted and untouched.
    act(() => {
      viewport.scrollTop = 37 * 15;
      fireEvent.scroll(viewport);
    });
    await waitFor(() => expect(screen.queryByText("P0")).toBeNull());
    expect(renders - before).toBeLessThanOrEqual(20);
  });

  it("renders only the unpinned columns near the visible width", async () => {
    type Wide = { id: string } & Record<string, string>;
    const sized = tableFeatures({ columnSizingFeature, columnPinningFeature });
    const w = createColumnHelper<typeof sized, Wide>();
    const wide = w.columns([
      w.accessor("id", { header: "Id", size: 80 }),
      ...Array.from({ length: 100 }, (_, i) =>
        w.accessor((row) => row[`c${i}`] ?? "", { id: `c${i}`, header: `C${i}`, size: 50 }),
      ),
    ]);
    const rows: Wide[] = Array.from({ length: 5 }, (_, r) => ({
      id: String(r),
      ...Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`c${i}`, `r${r}c${i}`])),
    }));
    function WideTable() {
      const table = useTable({
        features: sized,
        columns: wide,
        data: rows,
        getRowId: (row) => row.id,
        initialState: { columnPinning: { start: ["id"], end: [] } },
      });
      return <DataTable table={table} stickyHeader virtualize />;
    }
    const { container } = render(<WideTable />);
    const container0 = container.querySelector<HTMLElement>("[data-slot=table-container]");
    if (!container0) throw new Error("no container");

    // Header keeps every column; the body only the pinned one plus those in view.
    expect(screen.getAllByRole("columnheader")).toHaveLength(101);
    const cells = () => container.querySelectorAll('tbody tr:first-child td:not([aria-hidden="true"])').length;
    // 500px visible, C0 starting after the 80px pinned column → C0..C8 in view, plus 3 overscan.
    expect(cells()).toBe(1 + 12);
    expect(screen.getByText("r0c0")).toBeInTheDocument();
    expect(screen.queryByText("r0c50")).toBeNull();

    act(() => {
      container0.scrollLeft = 2_500;
      fireEvent.scroll(container0);
    });
    await waitFor(() => expect(screen.getByText("r0c50")).toBeInTheDocument());
    expect(screen.queryByText("r0c0")).toBeNull();
    // The skipped columns collapse into spacer cells, so the row still spans 101 columns.
    const spans = [...container.querySelectorAll<HTMLTableCellElement>('tbody tr:first-child td')].reduce(
      (sum, td) => sum + td.colSpan,
      0,
    );
    expect(spans).toBe(101);
  });

  it("scrolls to a row that isn't rendered through apiRef", async () => {
    const api = createRef<DataTableApi>();
    render(<Many api={api} />);
    expect(api.current?.scrollToRow("missing")).toBe(false);
    act(() => {
      expect(api.current?.scrollToRow("900", { align: "start" })).toBe(true);
    });
    await waitFor(() => expect(scrollTo).toHaveBeenCalled());
    const top = (scrollTo.mock.calls.at(-1)?.[0] as ScrollToOptions).top ?? 0;
    expect(top).toBeGreaterThan(899 * 37);
  });
});
