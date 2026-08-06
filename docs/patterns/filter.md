# Filter

## When

Multi-field filters that would crowd the toolbar.

## Composition

- Desktop: inline filters or `Popover`.
- Mobile: `Drawer` (`side="bottom"` or `right`) with `FormStack` + Apply/Reset.

## Do

- Show active filter count on the trigger badge.
- Reset should clear query state, not only UI.
