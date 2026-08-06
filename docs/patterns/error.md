# Error

## Strategy

Use `ErrorState` with optional `onRetry`. Toast (`sonner`) for mutation failures that keep the form mounted.

## Do

- Show actionable message, not only status codes.
- Retry only when idempotent/safe.
