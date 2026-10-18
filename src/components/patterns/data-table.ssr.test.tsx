// @vitest-environment node
import { createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DataTable } from "./data-table";

type Item = { id: string; name: string };
const features = tableFeatures({});
const helper = createColumnHelper<typeof features, Item>();
const columns = helper.columns([helper.accessor("name", { header: "Name" })]);
const many: Item[] = Array.from({ length: 500 }, (_, i) => ({ id: String(i), name: `Item ${i}` }));

function Many() {
  const table = useTable({ features, columns, data: many, getRowId: (row) => row.id });
  return <DataTable table={table} stickyHeader virtualize={{ estimateRowHeight: 40 }} />;
}

// No DOM globals here (`Element`, `Window`, `ResizeObserver`), as in a Next.js server render.
describe("DataTable virtualize on the server", () => {
  it("renders the first rows and a spacer for the rest", () => {
    const html = renderToString(<Many />);
    expect(html).toContain("Item 0<");
    expect(html).toContain("Item 29<");
    expect(html).not.toContain("Item 30<");
    expect(html).toContain('data-slot="table-spacer"');
    expect(html).toContain(`height:${470 * 40}px`);
  });
});
