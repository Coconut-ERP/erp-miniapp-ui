# `@erp/miniapp-ui`

Design system and UI library for ERP mini apps.

> Status: **v0.2.0** — foundations, components, patterns, charts, docs-site.  
> See [ROADMAP.md](./ROADMAP.md) / [CHANGELOG.md](./CHANGELOG.md).

## Install

Published as a GitHub Release tarball (not on npm):

```bash
npm install https://github.com/Coconut-ERP/erp-miniapp-ui/releases/download/v0.2.0/erp-miniapp-ui-0.2.0.tgz
```

Local development:

```bash
npm install
npm run build
npm pack
# then in your mini app:
# npm install ../path/to/erp-miniapp-ui-0.2.0.tgz
```

## Peer requirements

- React 19+
- Tailwind CSS v4 in the consuming mini app

## Quick start

```tsx
import "@erp/miniapp-ui/styles.css";
import { Button } from "@erp/miniapp-ui";
import { cn } from "@erp/miniapp-ui/cn"; // server-safe; also re-exported from main (client)

export function Actions() {
  return (
    <div className={cn("flex gap-2")}>
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
    </div>
  );
}
```

> **Next.js App Router:** UI components ship with `"use client"`. Import `cn` from `@erp/miniapp-ui/cn` when calling it from a Server Component.

### Tailwind v4 consumer CSS

```css
@import "tailwindcss";
@import "@erp/miniapp-ui/styles.css";
/* Scan library classes so utilities used inside the package are generated */
@source "../node_modules/@erp/miniapp-ui/dist";
```

Adjust the `@source` path if your CSS file lives elsewhere.

## Design tokens

CSS variables are defined on `:root` (oklch). Mapped into Tailwind via `@theme inline` inside `styles.css`. Documented in Phase 2 (`docs/foundations/`).

Default visual language follows **Dreams ERP** component anatomy (spacing, radius, sidebar, controls). Theme default is **light**; use `html.dark` for dark surfaces. Matching dark mode alone is not enough — sizes and structure must match the template.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | ESM + CJS + d.ts + copy CSS |
| `npm pack` | Produce installable `.tgz` |

## Project docs

| File | Purpose |
| --- | --- |
| [ROADMAP.md](./ROADMAP.md) | Phases, DoD, review criteria |
| [TODO.md](./TODO.md) | Living task board |
| [CHANGELOG.md](./CHANGELOG.md) | Semver history |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Folder map |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution rules |

## License

UNLICENSED — internal ERP use.
