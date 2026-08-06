import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "../docs/patterns");

const docs = {
  "forms.md": `# Forms

## When

Collecting or editing structured data.

## Composition

\`PageHeader\` + \`FormStack\` + \`Field\` / \`Label\` + controls + primary/secondary \`Button\`s.

\`\`\`tsx
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
\`\`\`

## Do

- One vertical rhythm (\`FormStack\` / \`gap-4\`).
- Surface validation with \`FieldError\` + \`aria-invalid\`.

## Don't

- Don't invent a parallel form kit outside \`Field\`.
`,
  "search.md": `# Search

## When

Filtering a list by free text.

## Composition

\`SearchField\` above the results; debounce in the page/hook layer.

\`\`\`tsx
import { SearchField } from "@erp/miniapp-ui";

<SearchField placeholder="Search employees…" value={q} onChange={(e) => setQ(e.target.value)} />
\`\`\`

## Do

- Keep search controlled from the page.
- Pair with \`EmptyState\` when query returns nothing.
`,
  "crud.md": `# CRUD

## When

List → create/edit/delete domain records.

## Flow

1. List with \`Table\` or cards + \`SearchField\` + primary Create \`Button\`.
2. Create/Edit in \`Dialog\` or dedicated page with \`FormStack\`.
3. Delete via \`ConfirmDialog\` (\`destructive\`).
4. States: \`LoadingRows\` → data | \`EmptyState\` | \`ErrorState\`.

See recipes in Phase 5 for full screen copy-paste flows.
`,
  "table.md": `# Table

## When

Dense tabular data with clear columns.

## Composition

\`Table\` primitives + optional \`Pagination\` below.

## Do

- Keep header sticky only when the scroll container is intentional (\`ScrollArea\`).
- Align numeric columns right with \`tabular-nums\`.

## Don't

- Don't put primary navigation inside table cells without clear affordance.
`,
  "filter.md": `# Filter

## When

Multi-field filters that would crowd the toolbar.

## Composition

- Desktop: inline filters or \`Popover\`.
- Mobile: \`Drawer\` (\`side="bottom"\` or \`right\`) with \`FormStack\` + Apply/Reset.

## Do

- Show active filter count on the trigger badge.
- Reset should clear query state, not only UI.
`,
  "pagination.md": `# Pagination

## When

Server- or client-paged collections.

## Composition

\`Pagination\` under the list/table; wire \`href\` or \`onClick\` in the app.

## Do

- Keep Previous/Next available on mobile; hide page numbers if needed.
- Reflect \`isActive\` for the current page.
`,
  "dialog.md": `# Dialog flow

## When

Short, focused tasks without leaving the page.

## Composition

\`Dialog\` for forms; \`AlertDialog\` / \`ConfirmDialog\` for decisions; \`Drawer\` for filters on small screens.

## Do

- Set \`DialogTitle\` / description for screen readers.
- Close on success after mutation settles.

## Don't

- Don't nest dialogs.
`,
  "confirmation.md": `# Confirmation

## When

Irreversible or costly actions (delete, reject, revoke).

\`\`\`tsx
import { Button, ConfirmDialog } from "@erp/miniapp-ui";

<ConfirmDialog
  trigger={<Button variant="destructive">Delete</Button>}
  title="Delete user?"
  description="This cannot be undone."
  confirmLabel="Delete"
  destructive
  onConfirm={() => remove()}
/>
\`\`\`
`,
  "loading.md": `# Loading

## Strategy

| Situation | Pattern |
| --- | --- |
| List/card placeholders | \`LoadingRows\` / \`Skeleton\` |
| Whole panel | \`LoadingBlock\` |
| Button pending | disable + \`Spinner\` inside button |

## Do

- Reserve layout height to avoid jump.
- Prefer skeletons that mirror final structure.
`,
  "error.md": `# Error

## Strategy

Use \`ErrorState\` with optional \`onRetry\`. Toast (\`sonner\`) for mutation failures that keep the form mounted.

## Do

- Show actionable message, not only status codes.
- Retry only when idempotent/safe.
`,
  "empty.md": `# Empty

## Strategy

\`EmptyState\` when the collection is legitimately empty (not an error).

Provide a primary action (Create) when the user can fix emptiness.
`,
  "not-found.md": `# Not found

## Strategy

\`NotFoundState\` for missing ids / deep links.

Link back to the parent list.
`,
  "permission.md": `# Permission

## Strategy

\`PermissionState\` when IAM/scopes deny the view or action.

Do not pretend the resource is empty.
`,
  "upload.md": `# Upload

## Composition

Native \`input type="file"\` styled via \`Button asChild\` + \`Label\`, or dropzone in the app.

Show progress with \`Skeleton\`/\`Spinner\`; success via toast; errors via \`ErrorState\` or field error.

File storage remains app/ERP concern — UI only.
`,
  "wizard.md": `# Wizard

## Composition

\`Tabs\` (controlled step index) or numbered header + \`FormStack\` per step + Back/Next \`Button\`s.

Validate per step before advancing; confirm on last step.
`,
  "dashboard.md": `# Dashboard

## Composition

Grid of \`StatisticCard\` + \`DashboardCard\` panels.

\`\`\`tsx
import { DashboardCard, StatisticCard } from "@erp/miniapp-ui";

<div className="grid gap-4 md:grid-cols-3">
  <StatisticCard label="Open" value={12} hint="This week" />
  <DashboardCard title="Approvals" description="Pending requests">
    {/* list */}
  </DashboardCard>
</div>
\`\`\`
`,
  "list-detail.md": `# List / master detail

## Composition

- Mobile: list page → detail page/route.
- Desktop: split pane — list (\`ScrollArea\`) + detail panel (\`Card\` or route outlet).

Use \`PageHeader\` on both; keep selection highlighted in the list.
`,
};

fs.mkdirSync(out, { recursive: true });
for (const [name, body] of Object.entries(docs)) {
  fs.writeFileSync(path.join(out, name), body);
}
console.log("wrote", Object.keys(docs).length, "pattern docs");
