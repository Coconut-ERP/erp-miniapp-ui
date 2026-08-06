# Responsive

## Purpose

Mini apps chạy trong ERP shell: desktop sidebar + mobile webview. Layout phải dùng được cả hai.

## Breakpoints

Dùng Tailwind defaults:

| Prefix | Min width | Typical |
| --- | --- | --- |
| (none) | 0 | Mobile webview |
| `sm` | 640px | Large phone / small tablet |
| `md` | 768px | Tablet / narrow desktop embed |
| `lg` | 1024px | Desktop shell content |
| `xl` | 1280px | Wide desktop |

## Layout rules

1. **Mobile first** — base styles for narrow; enhance at `md`/`lg`.
2. **Touch targets** — controls ≥ 32px height (`h-8` library default); prefer larger on primary mobile CTAs when needed.
3. **Single column forms** on mobile; multi-column only from `md` up.
4. **Avoid horizontal scroll** for primary flows.
5. **Drawers** on mobile where desktop uses dialogs/side panels (pattern docs in Phase 4).

## Example

```tsx
<div className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
  {/* fields */}
</div>
```

## Do

- Test critical flows at ~390px and ~1280px widths.
- Collapse secondary nav into sheets/drawers on small screens.

## Don't

- Don't hide essential actions behind hover-only affordances.
- Don't assume desktop pointer precision in the embedded shell.
