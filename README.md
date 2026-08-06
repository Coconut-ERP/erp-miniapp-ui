# `@erp/miniapp-ui`

Design system and UI library for ERP mini apps.

> Status: **Phase 3 complete** — foundations + component library. Patterns next (Phase 4).  
> See [ROADMAP.md](./ROADMAP.md) for the full plan.

## Install

Published as a GitHub Release tarball (same channel as `erp-sdk`):

```bash
npm install https://github.com/Coconut-ERP/erp-sdk/releases/download/miniapp-ui-v0.1.0/erp-miniapp-ui-0.1.0.tgz
```

Local development from this monorepo:

```bash
cd packages/miniapp-ui
npm install
npm run build
npm pack
# then in your mini app:
# npm install ../path/to/erp-miniapp-ui-0.1.0.tgz
```

## Peer requirements

- React 19+
- Tailwind CSS v4 in the consuming mini app

## Quick start

```tsx
import "@erp/miniapp-ui/styles.css";
import { Button, cn } from "@erp/miniapp-ui";

export function Actions() {
  return (
    <div className={cn("flex gap-2")}>
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
    </div>
  );
}
```

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

Light mode only — matches the ERP portal shell.

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
