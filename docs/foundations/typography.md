# Typography

## Purpose

Hệ chữ thống nhất, đọc tốt trên portal ERP (desktop + mobile webview).

## Font stack

```css
--font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, "Noto Sans", sans-serif;
--font-heading: var(--font-sans);
```

Mapped as Tailwind `font-sans` / heading via `--font-heading`. Base: `antialiased` on `html`.

## Scale (recommended)

| Role | Classes | Notes |
| --- | --- | --- |
| Page title | `text-xl font-semibold tracking-tight` | One per view |
| Section title | `text-base font-semibold` | Card / panel headers |
| Body | `text-sm` | Default UI text (controls use `text-sm`) |
| Helper | `text-xs text-muted-foreground` | Hints, captions |
| Label | `text-sm font-medium` | Form labels |

Buttons / inputs in the library default to `text-sm` (and smaller for `xs`/`sm` sizes).

## Do

- Keep body UI at `text-sm` unless the screen is content-heavy reading.
- Use `text-muted-foreground` for secondary copy.
- Prefer weight `medium` / `semibold` for hierarchy instead of oversized display fonts.

## Don't

- Don't load decorative display fonts that break ERP shell consistency.
- Don't mix more than two weights in one dense form.
- Don't use all-caps for long labels (hurts scanability).
