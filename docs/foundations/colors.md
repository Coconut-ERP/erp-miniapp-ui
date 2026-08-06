# Colors

## Purpose

Semantic color tokens cho surface, text, action, status. Tất cả map qua `:root` → `@theme inline` → utility Tailwind (`bg-primary`, `text-destructive`, …).

## Source of truth

`src/styles/globals.css` — `:root` block.

## Palette

| Token | CSS variable | Typical use |
| --- | --- | --- |
| Background | `--background` | Page / elevated white panels |
| Surface | `--surface` | App canvas (`body` default) |
| Foreground | `--foreground` | Primary text |
| Card | `--card` / `--card-foreground` | Card surfaces |
| Popover | `--popover` / `--popover-foreground` | Menus, popovers |
| Primary | `--primary` / `--primary-foreground` | Main CTA, links, focus ring |
| Secondary | `--secondary` / `--secondary-foreground` | Secondary actions |
| Muted | `--muted` / `--muted-foreground` | Subtle fills, helper text |
| Accent | `--accent` / `--accent-foreground` | Soft highlight |
| Destructive | `--destructive` | Errors, dangerous actions |
| Success | `--success` / `--success-foreground` | Positive status |
| Warning | `--warning` / `--warning-foreground` | Caution status |
| Border | `--border` | Dividers, card edges |
| Input | `--input` | Form control borders |
| Ring | `--ring` | Focus rings |

Values are **oklch**. Primary ≈ `oklch(0.49 0.14 258)`.

## Tailwind usage

```tsx
<div className="bg-surface text-foreground">
  <button className="bg-primary text-primary-foreground">Save</button>
  <p className="text-muted-foreground">Helper</p>
  <span className="text-destructive">Error</span>
</div>
```

## Do

- Prefer semantic tokens (`primary`, `muted-foreground`) over raw color utilities.
- Pair foreground tokens with their background (`bg-primary` + `text-primary-foreground`).

## Don't

- Don't introduce new brand colors in a single mini app without adding a token.
- Don't use `dark:` as the primary theming path — light portal only.
- Don't hard-code `oklch(...)` or hex in component class strings.
- Don't add mini-app shell variables (`--app-sidebar`, …) or `bg-[var(--…)]` — see [../conventions/styling.md](../conventions/styling.md).

## Dark mode

Locked off. `@custom-variant dark` only matches `.dark` ancestors, which mini apps must not set unless long-term dark mode is approved.
