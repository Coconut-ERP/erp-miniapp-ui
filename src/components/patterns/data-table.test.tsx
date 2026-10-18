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
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { DataTable, type DataTableColumnMeta } from "./data-table";

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
