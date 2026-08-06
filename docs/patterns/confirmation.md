# Confirmation

## When

Irreversible or costly actions (delete, reject, revoke).

```tsx
import { Button, ConfirmDialog } from "@erp/miniapp-ui";

<ConfirmDialog
  trigger={<Button variant="destructive">Delete</Button>}
  title="Delete user?"
  description="This cannot be undone."
  confirmLabel="Delete"
  destructive
  onConfirm={() => remove()}
/>
```
