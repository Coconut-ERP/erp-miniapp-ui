# Elevation

## Purpose

Phân tầng bề mặt bằng màu + border trước; shadow dùng sparingly cho overlay.

## Layers

| Level | Treatment | Use |
| --- | --- | --- |
| 0 Canvas | `bg-surface` | App background |
| 1 Panel | `bg-background` / `bg-card` + `border-border` | Cards, sections |
| 2 Overlay | `bg-popover` + border + soft shadow | Menus, popovers, dialogs |

## Shadow guideline

ERP mini apps ưu tiên **flat + border** (portal đã có chrome riêng).

Recommended utilities when needed:

| Context | Class hint |
| --- | --- |
| Dropdown / popover | `shadow-md` |
| Modal dialog | `shadow-lg` |
| Sticky header | `shadow-sm` optional |

Không định nghĩa custom shadow tokens trong Phase 2 — dùng Tailwind defaults cho đến khi có nhu cầu brand.

## Do

- Separate surfaces with `border` and background tokens first.
- Reserve stronger shadows for floating layers only.

## Don't

- Don't stack multi-layer glow shadows on cards in lists.
- Don't use elevation to fake hierarchy that typography/spacing should provide.
