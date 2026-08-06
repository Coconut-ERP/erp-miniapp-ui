# Project structure — `@erp/miniapp-ui`

Canonical layout for the UI library. Agents and humans must keep new files inside this map unless ROADMAP adds a phase that extends it.

```text
packages/miniapp-ui/
├── ROADMAP.md                 # Phases, DoD, review criteria
├── TODO.md                    # Living task board
├── CHANGELOG.md               # Semver changelog
├── PROJECT_STRUCTURE.md       # This file
├── CONTRIBUTING.md            # How to contribute
├── README.md                  # Consumer-facing quick start
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── docs-site/                 # Live docs / showcase (Next.js)
├── .ai/
│   └── skills/                # Phase 7 — AI coding skills
├── docs/
│   ├── foundations/           # Phase 2
│   ├── components/            # Phase 3
│   ├── patterns/              # Phase 4
│   ├── recipes/               # Phase 5
│   ├── conventions/           # Phase 6
│   ├── release-pipeline.md    # Phase 10
│   └── adr/                   # Architecture decision records (as needed)
├── src/
│   ├── index.ts               # Public barrel — only stable exports
│   ├── components/
│   │   ├── ui/                # Primitives (Button, Input, …)
│   │   └── patterns/          # Composed patterns (FormLayout, …) — Phase 4
│   ├── lib/                   # cn(), shared helpers (no app domain)
│   └── styles/
│       └── globals.css        # Design tokens + base layers
└── dist/                      # Build output (gitignored)
```

## Related repo paths (outside this package)

| Path | Role |
| --- | --- |
| `examples/miniapp-hr/` | **Source to extract from** for Phase 3; not a dependency at runtime |
| `examples/miniapp-ui-kit/` | Phase 9 reference mini app (to be created) |
| `skills/erp-miniapp/` | Existing ERP SDK skill — complementary, not a replacement |
| Root `AGENTS.md` | Agent entrypoint; includes miniapp-ui section |

## Export surface

Consumers should only import:

```ts
import { Button, cn, /* … */ } from "@erp/miniapp-ui";
import "@erp/miniapp-ui/styles.css";
```

Do not deep-import `src/` paths from outside the package.

## Naming

| Kind | Convention | Example |
| --- | --- | --- |
| Component file | kebab-case | `alert-dialog.tsx` |
| Component export | PascalCase | `AlertDialog` |
| Doc file | kebab-case matching component | `docs/components/alert-dialog.md` |
| CSS variables | `--token-name` | `--primary`, `--radius` |

## What does **not** belong here

- ERP schema, API routes, initData session logic → stay in mini apps / `erp-sdk`
- HR domain components (`sections/*`, employee forms) → stay in `miniapp-hr` until generalized as recipes
- Secrets, `.env`, workspace-specific display names
