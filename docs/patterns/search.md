# Search

## When

Filtering a list by free text.

## Composition

`SearchField` above the results; debounce in the page/hook layer.

```tsx
import { SearchField } from "@erp/miniapp-ui";

<SearchField placeholder="Search employees…" value={q} onChange={(e) => setQ(e.target.value)} />
```

## Do

- Keep search controlled from the page.
- Pair with `EmptyState` when query returns nothing.
