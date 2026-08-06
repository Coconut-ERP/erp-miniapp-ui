# Architecture Decision: Drawer without Vaul

## Status

Accepted — 2026-08-05

## Context

Phase 3 needs a Drawer. shadcn often uses [`vaul`](https://github.com/emilkowalski/vaul). Adding Vaul increases runtime weight and another gesture model.

## Decision

Implement `Drawer` on **Radix Dialog** primitives (same as `Dialog`), styled as a side/bottom panel via CVA `side` variants (`right` | `left` | `top` | `bottom`).

## Consequences

- No `vaul` dependency.
- Mobile swipe-to-dismiss is not built-in; Esc + overlay click still work.
- API mirrors Dialog (`DrawerTrigger`, `DrawerContent`, …) for consistency.
- Can revisit Vaul later if gesture UX becomes a requirement (long-term backlog).
