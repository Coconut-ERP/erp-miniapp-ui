# Constants

Static, serializable values used by pages and shell. Prefer `src/constants/*.ts`.

## Rules

1. **No React** — no JSX, no hooks, no `"use client"`.
2. **No I/O** — no `fetch`, no ERP client, no `process.env`.
3. Group by surface: `pages.ts` (headers / empty / error), `nav.ts` (shell links), `status.ts` (badges/labels).
4. Page early-returns import the same constant object so `PageHeader` copy is not duplicated by hand.
5. ERP **field display names** stay in `lib/erp/schema.ts` (`F`, `OBJECTS`) — not in `constants/`.

```ts
// src/constants/pages.ts
export const FACTORIES_PAGE = {
  header: {
    title: "Nhà máy",
    description: "Danh sách nhà máy đang hoạt động…",
  },
  errorTitle: "Không tải được danh sách nhà máy",
  empty: {
    title: "Chưa có nhà máy",
    description: "Tạo bản ghi Nhà máy trên workspace…",
  },
} as const;
```

```tsx
// components/page/factories-page.tsx
import { FACTORIES_PAGE } from "@/constants/pages";

if (isLoading) {
  return (
    <>
      <PageHeader {...FACTORIES_PAGE.header} />
      <LoadingRows rows={4} />
    </>
  );
}
```
