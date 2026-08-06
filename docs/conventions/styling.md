# Styling & colors

Rules for mini apps consuming `@erp/miniapp-ui`. Library internals follow the same
token rules in `docs/foundations/colors.md`.

## Library components

Use semantic Tailwind tokens mapped from the design system:

| Use | Classes |
| --- | --- |
| Page canvas | `bg-surface`, `bg-background` |
| Text | `text-foreground`, `text-muted-foreground` |
| Cards / panels | `bg-card`, `border-border` |
| Actions | `bg-primary text-primary-foreground`, `variant="outline"` on `Button` |
| Status | `text-destructive`, `text-success`, `Badge` variants |

Do **not** reference design tokens via arbitrary CSS variable syntax in JSX
(`bg-[var(--primary)]`). The utilities `bg-primary`, `text-muted-foreground`, etc.
already wrap those variables.

Do **not** add hex / oklch literals in component `className` strings.

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

## Agent skill

Agents must load `packages/miniapp-ui/.ai/skills/styling.md` before editing shell
or custom colors in any mini app example.
