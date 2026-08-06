# Collapsible

## Purpose

Show and hide a section of content.

## Import

```ts
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@erp/miniapp-ui";
```

## Props

Follows the underlying Radix / native element props unless noted. Prefer composition over prop sprawl.

## Variants

See source CVA / `data-variant` where applicable. Prefer documented variants only — do not invent ad-hoc color classes.

## Sizes

Use library size props (`size` on Button and similar controls) instead of one-off height classes.

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
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@erp/miniapp-ui";

<Collapsible>
  <CollapsibleTrigger asChild><Button variant="outline">Toggle</Button></CollapsibleTrigger>
  <CollapsibleContent>Hidden until open.</CollapsibleContent>
</Collapsible>
```

## API

Public exports: `Collapsible, CollapsibleTrigger, CollapsibleContent`.

## Source

`src/components/ui/collapsible.tsx`
