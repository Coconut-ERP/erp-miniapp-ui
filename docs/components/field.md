# Field

## Purpose

Compose label, control, description, and error for forms.

## Import

```ts
import { Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldContent, FieldSet, FieldLegend, FieldTitle, FieldSeparator } from "@erp/miniapp-ui";
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
import { Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldContent, FieldSet, FieldLegend, FieldTitle, FieldSeparator } from "@erp/miniapp-ui";

<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" />
  <FieldDescription>Work email</FieldDescription>
</Field>
```

## API

Public exports: `Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldContent, FieldSet, FieldLegend, FieldTitle, FieldSeparator`.

## Source

`src/components/ui/field.tsx`
