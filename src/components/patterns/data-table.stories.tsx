import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  createColumnHelper,
  createSortedRowModel,
  rowSelectionFeature,
  rowSortingFeature,
  type SortingState,
  sortFn_alphanumeric,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import * as React from "react";
import { expect, userEvent, within } from "storybook/test";

import { DataTable, type DataTableColumnMeta } from "./data-table";

const meta: Meta<typeof DataTable> = {
  title: "Patterns/DataTable",
  component: DataTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DataTable>;

type Product = { id: string; name: string; sku: string; qty: number; price: number; note: string | null };

const DATA: Product[] = [
  { id: "1", name: "Áo sơ mi nam dài tay vải cotton cao cấp", sku: "SM-001", qty: 1200, price: 185000, note: null },
  { id: "2", name: "Quần tây", sku: "QT-014", qty: 0, price: 240000, note: "Hết hàng" },
  { id: "3", name: "Váy liền", sku: "VL-203", qty: 75, price: 320000, note: null },
  { id: "4", name: "Áo khoác gió", sku: "AK-090", qty: 410, price: 450000, note: "Hàng mới" },
];

const EMPTY: Product[] = [];
const vnd = new Intl.NumberFormat("vi-VN");

// Module scope: features and columns must stay stable across renders.
const basicFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
  columnMeta: {} as DataTableColumnMeta,
});
const basic = createColumnHelper<typeof basicFeatures, Product>();
const basicColumns = basic.columns([
  basic.accessor("name", { header: "Tên hàng" }),
  basic.accessor("sku", { header: "Mã", enableSorting: false }),
  basic.accessor("qty", { header: "Tồn", meta: { numeric: true } }),
  basic.accessor("note", { header: "Ghi chú", enableSorting: false, meta: { fallback: "—" } }),
]);

/** Client-side sorting with only `rowSortingFeature` registered — auto table layout. */
export const Default: Story = {
  render: function Render() {
    const table = useTable({ features: basicFeatures, columns: basicColumns, data: DATA, getRowId: (r) => r.id });
    return (
      <DataTable
        table={table}
        getRowProps={(row) => ({ state: row.original.qty === 0 ? "warning" : undefined })}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /^Tồn/ }));
    await expect(canvas.getByRole("columnheader", { name: /^Tồn/ })).toHaveAttribute("aria-sort", "ascending");
  },
};

/**
 * Server-side sorting: `manualSorting` + controlled `sorting`. The table only
 * keeps state; the app refetches (here: sorts the array itself).
 */
export const ServerSorting: Story = {
  render: function Render() {
    const [sorting, setSorting] = React.useState<SortingState>([{ id: "qty", desc: true }]);
    const data = React.useMemo(() => {
      const [sort] = sorting;
      if (!sort) return DATA;
      const key = sort.id as keyof Product;
      return [...DATA].sort((a, b) => ((a[key] ?? "") > (b[key] ?? "") ? 1 : -1) * (sort.desc ? -1 : 1));
    }, [sorting]);
    const table = useTable({
      features: basicFeatures,
      columns: basicColumns,
      data,
      getRowId: (r) => r.id,
      manualSorting: true,
      state: { sorting },
      onSortingChange: setSorting,
    });
    return <DataTable table={table} />;
  },
};

const gridFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
  columnSizingFeature,
  columnResizingFeature,
  columnPinningFeature,
  rowSelectionFeature,
  columnMeta: {} as DataTableColumnMeta,
});
const grid = createColumnHelper<typeof gridFeatures, Product>();
const gridColumns = grid.columns([
  grid.display({
    id: "select",
    size: 40,
    enableResizing: false,
    header: ({ table }) => (
      <input
        type="checkbox"
        aria-label="Chọn tất cả"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        aria-label={`Chọn ${row.original.name}`}
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }),
  grid.accessor("name", { header: "Tên hàng", size: 220, minSize: 100, meta: { truncate: true } }),
  grid.accessor("sku", { header: "Mã", size: 110 }),
  grid.accessor("qty", { header: "Tồn", size: 100, meta: { numeric: true }, footer: "Tổng" }),
  grid.accessor("price", {
    header: "Đơn giá",
    size: 140,
    meta: { numeric: true },
    cell: ({ getValue }) => vnd.format(getValue()),
  }),
  grid.accessor("note", { header: "Ghi chú", size: 160, enableSorting: false, meta: { fallback: "—" } }),
]);

/**
 * Sizing + resizing + pinning + selection. Drag a header's right edge (or focus
 * it and use ←/→); the checkbox and name columns stay pinned while the table
 * scrolls; selected and warning rows keep their tint in pinned cells too.
 */
export const ResizePinSelect: Story = {
  render: function Render() {
    const table = useTable({
      features: gridFeatures,
      columns: gridColumns,
      data: DATA,
      getRowId: (r) => r.id,
      initialState: { columnPinning: { start: ["select", "name"], end: [] }, rowSelection: { "3": true } },
    });
    return (
      <div className="max-w-xl rounded-md border">
        <DataTable
          table={table}
          stickyHorizontalScrollbar
          resizeLabel={(name) => `Đổi độ rộng cột ${name}`}
          getRowProps={(row) => ({ state: row.original.qty === 0 ? "warning" : undefined })}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = canvas.getByRole("separator", { name: "Đổi độ rộng cột Mã" });
    handle.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(handle).toHaveAttribute("aria-valuenow", "120");
  },
};

/** No rows → the `empty` content spans the table. */
export const Empty: Story = {
  render: function Render() {
    const table = useTable({ features: basicFeatures, columns: basicColumns, data: EMPTY, getRowId: (r) => r.id });
    return <DataTable table={table} empty="Chưa có sản phẩm" />;
  },
};
