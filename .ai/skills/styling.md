# Skill: Styling & colors (mini apps)

Load this skill before editing **app chrome** (shell, sidebar, canvas) or any custom
layout color in a mini app. Applies to `examples/miniapp-*`, not to library source
under `packages/miniapp-ui/src/`.

## Two layers — do not mix them up

| Layer | Where | How to color |
| --- | --- | --- |
| **Library UI** | `@erp/miniapp-ui` components (`Button`, `Card`, `PageHeader`, …) | Semantic tokens only — see below |
| **App chrome** | Mini-app-only shell (`app-shell.tsx`, layout wrappers) | Tailwind utilities **inline in `className`** |

Library tokens live in `@erp/miniapp-ui/styles.css`. Mini apps **must not** add
parallel `:root { --app-* }` variables for shell colors.

## Library components — semantic tokens

Read `docs/foundations/colors.md` first.

**Do:**

```tsx
<div className="bg-surface text-foreground">
  <p className="text-muted-foreground">Helper</p>
  <Button variant="secondary">Action</Button>
  <StatisticCard className="bg-muted/40 ring-1 ring-border/60" />
</div>
```

**Don't:**

- `bg-[var(--primary)]`, `text-[var(--muted-foreground)]` — use `bg-primary`, `text-muted-foreground`
- `oklch(...)`, `#hex` in class strings
- New `:root` CSS variables in the mini app for brand colors
- `const SHELL = { sidebar: "bg-sky-100", … }` or any color palette object — put classes directly on elements

## App chrome (sidebar, canvas, panel)

Pattern: `examples/miniapp-ui-kit/src/components/app-shell.tsx`.

**Do — Tailwind classes inline:**

```tsx
<aside className="hidden … rounded-2xl bg-sky-100 shadow-sm md:flex">
  …
  <Link
    className={cn(
      "… rounded-xl …",
      active
        ? "bg-sky-200/90 text-sky-950 shadow-sm"
        : "text-sky-600 hover:bg-sky-200/60 hover:text-sky-950",
    )}
  />
</aside>

<div className="flex h-dvh overflow-hidden bg-sky-50/80 p-3 md:p-4">
  <div className="… rounded-2xl bg-white shadow-sm">…</div>
</div>
```

**Don't:**

```tsx
// ❌ Custom CSS variables
bg-[var(--app-sidebar)]
:root { --app-canvas: … }

// ❌ Palette constant object
const SHELL = { canvas: "bg-sky-50/80", … } as const;
className={SHELL.canvas}
```

To rebrand the shell, edit the Tailwind classes on each element (e.g. `bg-sky-100` → `bg-cyan-100`).

## Accent tints on library components

Occasional stat/card tints (`bg-sky-50`, `bg-violet-50`) are OK for **one-off emphasis**
inside feature components — same as `examples/miniapp-workshop`. Keep text readable;
prefer semantic tokens for default surfaces.

## Checklist before finishing

- [ ] No `--app-*` (or similar) variables in mini-app `globals.css`
- [ ] No `bg-[var(--…)]` / `text-[var(--…)]` in mini-app components
- [ ] No color palette `const` objects — classes inline on JSX
- [ ] Library primitives use `primary`, `muted`, `border`, `surface`, … not raw palette for defaults
- [ ] `@import "@erp/miniapp-ui/styles.css"` still present in app `globals.css`

See also: `docs/conventions/styling.md`.
