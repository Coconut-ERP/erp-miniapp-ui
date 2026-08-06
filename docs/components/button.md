# Button

## Purpose

Primary interactive control for actions and navigation.

## Import

```ts
import { Button, buttonVariants } from "@erp/miniapp-ui";
```

## Props

Follows the underlying Radix / native element props unless noted. Prefer composition over prop sprawl.

## Variants

| Variant | Use |
| --- | --- |
| `default` | Primary CTA |
| `outline` | Secondary bordered |
| `secondary` | Quiet filled |
| `ghost` | Tertiary / icon chrome |
| `destructive` | Dangerous action |
| `link` | Inline text action |

## Sizes

`default` · `xs` · `sm` · `lg` · `icon` · `icon-xs` · `icon-sm` · `icon-lg`

## Accessibility

- Keyboard reachable; visible `focus-visible` ring.
- Icon-only triggers need `aria-label`.
- Pair form controls with `Label` / `Field`.
- See [foundations/accessibility.md](../foundations/accessibility.md).

## Do

- Use design tokens (`bg-primary`, `text-muted-foreground`, …).
- Compose with other library primitives.

## Don't

- Don't fork styling with hard-coded colors.
- Don't bypass Radix for custom focus traps on overlays.

## Example

```tsx
import { Button, buttonVariants } from "@erp/miniapp-ui";

<Button variant="default">Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
```

## API

Public exports: `Button, buttonVariants`.

## Source

`src/components/ui/button.tsx`
