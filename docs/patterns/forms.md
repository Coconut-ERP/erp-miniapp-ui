# Forms

## When

Collecting or editing structured data.

## Composition

`PageHeader` + `FormStack` + `Field` / `Label` + controls + primary/secondary `Button`s.

```tsx
import { Button, Field, FieldLabel, FormStack, Input, PageHeader } from "@erp/miniapp-ui";

<>
  <PageHeader title="Edit profile" description="Update contact details" />
  <FormStack>
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" type="email" />
    </Field>
    <div className="flex gap-2">
      <Button type="submit">Save</Button>
      <Button type="button" variant="outline">Cancel</Button>
    </div>
  </FormStack>
</>
```

## Do

- One vertical rhythm (`FormStack` / `gap-4`).
- Surface validation with `FieldError` + `aria-invalid`.

## Don't

- Don't invent a parallel form kit outside `Field`.
