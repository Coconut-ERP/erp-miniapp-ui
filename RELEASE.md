# Release checklist — `@erp/miniapp-ui`

Use this for every GitHub Release (Phase 1 deliverable; expanded in Phase 10).

## Pre-release

1. [ ] Current ROADMAP phase Definition of Done is met (or release is explicitly a foundation cut)
2. [ ] `CHANGELOG.md` — move `[Unreleased]` notes under a new version heading with date
3. [ ] Bump `version` in `packages/miniapp-ui/package.json`
4. [ ] From `packages/miniapp-ui`:

```bash
npm run typecheck
npm run build
npm pack
```

5. [ ] Confirm tarball contains `dist/index.js`, `dist/index.d.ts`, `dist/styles/globals.css`, `README.md`, `CHANGELOG.md`
6. [ ] Smoke-install tarball into a throwaway Next app and import `cn` + CSS

## Tag & Release

Suggested tag: `miniapp-ui-vX.Y.Z`

```bash
# from repo root after pack
gh release create miniapp-ui-v0.1.0 \
  packages/miniapp-ui/erp-miniapp-ui-0.1.0.tgz \
  --title "@erp/miniapp-ui v0.1.0" \
  --notes-file packages/miniapp-ui/CHANGELOG.md
```

Asset name should match README install URL.

## Post-release

1. [ ] Update README install URL if the tag pattern changed
2. [ ] Point example apps at the new tarball when ready
3. [ ] Mark release item done in `TODO.md`
