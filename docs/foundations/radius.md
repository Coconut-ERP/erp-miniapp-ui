# Radius

## Purpose

Bo góc thống nhất cho control, card và overlay.

## Tokens

Base: `--radius: 0.7rem`.

| Token | Formula | Tailwind |
| --- | --- | --- |
| `--radius-sm` | `calc(var(--radius) * 0.6)` | `rounded-sm` |
| `--radius-md` | `calc(var(--radius) * 0.8)` | `rounded-md` |
| `--radius-lg` | `var(--radius)` | `rounded-lg` |
| `--radius-xl` | `calc(var(--radius) * 1.4)` | `rounded-xl` |
| `--radius-2xl` … `4xl` | stepped multiples | `rounded-2xl` … |

## Defaults

| Element | Radius |
| --- | --- |
| Button / Input | `rounded-lg` (with size-specific mins for xs/sm) |
| Card | `rounded-xl` typical |
| Dialog | `rounded-xl` / `2xl` |
| Badge / Avatar | component-defined (often fuller) |

## Do

- Use theme radius utilities so a future token tweak cascades.
- Keep controls in the same family (`lg`) for dense forms.

## Don't

- Don't mix `rounded-none` chrome with heavily rounded controls on the same surface.
- Don't use `rounded-full` for large containers (pills for chips/avatars only).
