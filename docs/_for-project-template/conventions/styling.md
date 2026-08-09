# Styling & colors

Rules for mini apps consuming `@erp/miniapp-ui`. Library internals follow the same
token rules in [foundations/colors](../../foundations/colors.mdx).

## App-only chrome (shell, sidebar)

Shell layout is **not** part of `@erp/miniapp-ui`. Style it with Tailwind palette
utilities written **directly** on each element:

```tsx
<aside className="… bg-sky-100 …">
<div className="… bg-sky-50/80 …">
<div className="… bg-white …">
```

### Avoid in mini apps

1. **Custom `:root` variables** such as `--app-sidebar`, `--app-canvas` — duplicates
   the design system and forces `bg-[var(--…)]` syntax.
2. **Palette constant objects** (`const SHELL = { … }`) — colors belong on the JSX
   element, not in an indirection layer.
3. **`bg-[var(--token)]`** for tokens that already have Tailwind classes.

Reference implementation: `examples/miniapp-ui-kit/src/components/app-shell.tsx`.

## Optional accent backgrounds

Feature cards may use light palette tints for KPI emphasis (`bg-sky-50`, `ring-sky-100/80`)
when paired with semantic text colors. Follow `examples/miniapp-workshop` /
`examples/miniapp-ui-kit` feature components.
