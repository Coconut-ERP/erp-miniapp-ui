---
name: component-docs
description: Bring a component's JSDoc and Storybook story up to date with its current source, for @erp/miniapp-ui component authors. Use this whenever asked to "add docs for component X", "document component X", "update docs for component X", "add a story for X", or "migrate component X to Storybook" — and proactively right after writing a new component or changing an existing component's props/variants in src/components/ui/, src/components/patterns/, or src/components/charts/, before considering that component work done.
---

# Skill: component-docs

Bring a component's JSDoc and Storybook story into sync with its current source. The same
idempotent logic covers three situations: a component just written, an existing component
whose props or variants changed, and one-time bulk migration of older components that
predate this convention. In every case, re-derive the docs from what the source looks like
right now — don't try to diff against or preserve whatever was there before.

This skill assumes the component already exists and is exported from `src/index.ts`; it only
adds documentation, it does not scaffold a new component (see `component.md` for that).

Applies to components under `src/components/ui/`, `src/components/patterns/`, and
`src/components/charts/`.

## Steps

1. **Read the component and its props type.** Look at the exported function's props —
   CVA variants (if it uses `cva`), and any native element props it spreads through
   (`React.ComponentProps<"button">` etc.). You need this to know what to document and what
   stories to write.

2. **Write or update the JSDoc block** directly above the exported component function.
   Follow the shape used on `Button` in `src/components/ui/button.tsx`:
   - **Purpose** (1-2 sentences) — always required, never empty.
   - **A11y** — only if the component has non-trivial keyboard/focus behavior (a plain
     `<span>` wrapper usually doesn't need this; anything with focus states, keyboard
     interaction, or ARIA requirements does).
   - **Do/Don't** — only if there's a real misuse pitfall worth calling out.
   Omit whichever of these don't apply. Don't pad a section just to have all three present.

3. **Create or update `<name>.stories.tsx`** next to the component. Follow the shape used
   in `src/components/ui/button.stories.tsx`: a `Meta` with `tags: ["autodocs"]`, a
   `Default` story, and one story per variant/size that meaningfully changes the component's
   appearance or behavior. Don't generate the full cartesian product of every variant times
   every size — one illustrating story per axis value is enough.

4. **Do not touch** `docs/components/<name>.md` or `docs/patterns/<name>.md`. Those
   Markdown docs are deleted by hand after review; this skill doesn't manage them.

5. **Do not touch** `llms.txt`. It's regenerated separately by `npm run build`.

## Definition of done

- [ ] `npm run typecheck` passes
- [ ] The story renders in `storybook dev` with no console errors
- [ ] JSDoc Purpose is non-empty
- [ ] Every CVA variant/size has at least one illustrating story
