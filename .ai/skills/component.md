# Skill: Create Component

You are implementing UI for an ERP mini app.

Rules:
1. Prefer exporting/composing from `@erp/miniapp-ui`. Do not recreate Button/Input/Dialog.
2. Read `packages/miniapp-ui/docs/components/<name>.md` and foundations before styling.
3. Use `cn` for class merging; **semantic tokens** for color (`bg-primary`, `text-muted-foreground`) — see [styling.md](./styling.md).
4. Include a11y: labels, focus rings, keyboard.
5. Add docs if extending the library itself (Phase 3 template sections).
6. **App feature components** (domain cards, list rows, form sections) live in the mini app under `src/components/features/`, not inside `*-page.tsx` and not as a forked `components/ui`. Example: `FactoryOverviewCard` receives typed props and composes `DashboardCard` / `StatisticCard` / `Badge` from the library.
