# Project structure — `@erp/miniapp-ui`

Canonical layout for the UI library. Agents and humans must keep new files inside this map unless ROADMAP adds a phase that extends it.

```text
erp-miniapp-ui/                # repo root — standalone repo, not nested in a monorepo
├── ROADMAP.md                 # Phases, DoD, review criteria
├── TODO.md                    # Living task board
├── CHANGELOG.md               # Semver changelog
├── PROJECT_STRUCTURE.md       # This file
├── CONTRIBUTING.md            # How to contribute
├── README.md                  # Consumer-facing quick start
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── docs-site/                 # Live docs / showcase (Next.js) — being superseded by Storybook
├── .storybook/                 # Storybook config + MDX docs pages, @storybook/addon-mcp
├── .agent/
│   └── skills/                # Agent skills (canonical); .claude/skills/ symlinks here
├── docs/
│   ├── foundations/           # Phase 2 (.mdx, Storybook docs pages)
│   ├── patterns/               # Phase 4 (.mdx prose + .md code-backed pages)
│   └── adr/                   # Architecture decision records (as needed)
├── scripts/
│   ├── copy-styles.mjs         # Copies globals.css into dist/ on build
│   └── generate-llms-txt.mjs   # Generates llms.txt from JSDoc + docs/ on build
├── src/
│   ├── index.ts               # Public barrel — only stable exports
│   ├── components/
│   │   ├── ui/                # Primitives (Button, Input, Sidebar, …) — JSDoc + .stories.tsx
│   │   └── patterns/          # Composed patterns (FormLayout, …) — Phase 4
│   ├── hooks/                 # Shared hooks (useIsMobile, …)
│   ├── lib/                   # cn(), shared helpers (no app domain)
│   └── styles/
│       └── globals.css        # Design tokens + base layers
├── llms.txt                    # Generated LLM overview (build output, committed)
└── dist/                      # Build output (gitignored)
```

Component docs (Purpose, Import, Props, Variants, A11y, Do/Don't, Example) live as JSDoc on
the exported component plus a `.stories.tsx` next to it — not as separate Markdown files.
See `.agent/skills/component-docs/SKILL.md`.

Conventions and recipes (project-level, not library docs) were removed from this repo — see
[`docs/adr/003-conventions-recipes-are-project-docs.md`](./docs/adr/003-conventions-recipes-are-project-docs.md).

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
| Story file | kebab-case matching component | `alert-dialog.stories.tsx` |
| CSS variables | `--token-name` | `--primary`, `--radius` |

## What does **not** belong here

- Secrets, `.env`, workspace-specific display names
