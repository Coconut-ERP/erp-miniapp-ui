---
name: component-docs
description: Keep a component's JSDoc and Storybook story in sync with its current source under src/components/ui/, src/components/patterns/, or src/components/charts/. Use this whenever asked to "add docs for component X", "update docs for component X", "migrate component X to Storybook", or after writing/changing a component's props or variants — it produces JSDoc and a .stories.tsx file matching the Button pilot shape.
---

# Skill: component-docs

Keep a component's JSDoc and Storybook story in sync with its current source. Used for
three cases with the same idempotent logic (always re-derive from current source, never
diff against prior output): a component that was just written, an existing component whose
props/variants changed, and one-time bulk migration of pre-existing components.

Assumes the component already exists and is exported from `src/index.ts` — this skill only
produces docs, it does not scaffold a component (see `component.md` for that).

Applies to files under `src/components/ui/`, `src/components/patterns/`, and
`src/components/charts/`.

## Steps

1. Read the component and its props type (CVA variants, inherited native element props).
2. Write or update JSDoc directly above the exported component function: Purpose (1-2
   sentences), A11y notes only if the component has non-trivial keyboard/focus behavior,
   Do/Don't only if there is a real misuse pitfall. Omit sections that don't apply — do not
   pad them. Follow the exact shape used on `Button` in `src/components/ui/button.tsx`.
3. Create or update `<name>.stories.tsx` next to the component: a `Meta` with
   `tags: ["autodocs"]`, a `Default` story, and one story per variant/size that matters (not
   the full cartesian product of every variant × every size). Follow the exact shape used in
   `src/components/ui/button.stories.tsx`.
4. Do **not** touch `docs/components/<name>.md` or `docs/patterns/<name>.md` — those are
   deleted by hand after review, not by this skill.
5. Do **not** touch `llms.txt` — it is regenerated separately by `npm run build`.

## Definition of done

- [ ] `npm run typecheck` passes
- [ ] The story renders in `storybook dev` with no console errors
- [ ] JSDoc Purpose is non-empty
- [ ] Every CVA variant/size has at least one illustrating story
