# Spacing

## Purpose

Nhịp khoảng cách nhất quán giữa layout, form và list.

## Scale

Dùng Tailwind spacing scale (4px base):

| Token | Rem | Use |
| --- | --- | --- |
| `1` | 0.25rem | Icon gaps inside controls |
| `1.5` / `2` | 0.375–0.5rem | Tight control padding |
| `3` / `4` | 0.75–1rem | Field gaps, card padding start |
| `6` | 1.5rem | Section padding |
| `8` | 2rem | Page gutters (mobile) |
| `10`+ | ≥2.5rem | Large layout regions |

## Layout conventions

| Context | Recommendation |
| --- | --- |
| Page padding | `p-4` mobile → `p-6` md+ |
| Stack of fields | `space-y-4` or `gap-4` |
| Inline control groups | `gap-2` |
| Card body | `p-4` or `p-6` |
| List row | `px-4 py-3` |

## Do

- Prefer `gap-*` on flex/grid over margin soup.
- Align form fields to a single vertical rhythm (`space-y-4`).

## Don't

- Don't invent one-off spacings (`p-[13px]`) without reason.
- Don't nest multiple large paddings that waste mobile viewport.
