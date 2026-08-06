# Skill: Create Page

1. `app/**/page.tsx` is a **Server Component** — no `"use client"`. Put interactive UI in `components/page/*-page.tsx`.
2. Copy (titles, empty, errors) → `src/constants/pages.ts`. Shared helpers (dates) → `src/lib/date.ts`.
3. `PageHeader` + body.
4. Render with **early returns**: loading → error → empty → success (one branch only; see `docs/conventions/pages.md`).
5. Wire loading (`LoadingRows`/`LoadingBlock`), empty, error, permission.
6. Mutations: toast + invalidate queries.
7. Follow `docs/conventions/` (`pages.md`, `folder.md`, `constants.md`, `lib.md`, `styling.md`).
8. **Extract feature UI** — do not inline large cards/sections/maps of domain items in `*-page.tsx`. Put them in `components/features/<name>.tsx` and keep the page as orchestration (hooks, early returns, layout). Compose only `@erp/miniapp-ui` inside features (no local `components/ui`).
9. **Shell / sidebar colors** — load [styling.md](./styling.md): Tailwind classes inline, no `--app-*` vars, no palette `const` objects.
