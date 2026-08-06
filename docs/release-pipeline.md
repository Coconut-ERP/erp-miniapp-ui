# Release pipeline — Phase 10

## Versioning

Semantic Versioning on `packages/miniapp-ui/package.json`.

| Bump | When |
| --- | --- |
| MAJOR | Breaking public API / token renames |
| MINOR | New components/patterns (backward compatible) |
| PATCH | Fixes, docs-only that ship in package |

Tag format: `miniapp-ui-vX.Y.Z`

## Gate (every release)

From `packages/miniapp-ui`:

```bash
npm run typecheck
npm run build
npm pack
```

Optional:

```bash
cd docs-site && npm run build
cd ../../examples/miniapp-ui-kit && npm install && npm run typecheck
```

## Checklist

See [RELEASE.md](./RELEASE.md).

## CHANGELOG

1. Move `[Unreleased]` notes under `## [X.Y.Z] - YYYY-MM-DD`
2. Commit version bump + changelog
3. `gh release create` with the `.tgz` asset

## CI (recommended)

When wiring GitHub Actions: typecheck + build + pack on PRs touching `packages/miniapp-ui/**`.
