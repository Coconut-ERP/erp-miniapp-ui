# Accessibility

## Purpose

Mini apps phải dùng được bằng bàn phím, reader, và đủ tương phản trong portal sáng.

## Rules (mandatory)

### Keyboard

- Every interactive control is focusable in a sensible order.
- Dialogs / menus use Radix focus trap + Esc to dismiss.
- Do not remove focus outlines — library uses `focus-visible:ring-*`.

### Labels

- Inputs have visible `<Label>` or `aria-label`.
- Icon-only buttons require `aria-label`.
- Error text is linked via `aria-invalid` / describedby patterns (Field component).

### Contrast

- Prefer token pairs (`primary` + `primary-foreground`, `muted-foreground` on `background`).
- Do not place `muted-foreground` on `muted` for critical information.

### Semantics

- Use correct elements (`button`, `a`, headings) — don't fake buttons with `div` + onClick.
- Status messages: `role="status"` / `role="alert"` where appropriate (Alert, toast).

### Motion

- Respect `prefers-reduced-motion` for decorative motion.

## Component expectations

Each Phase 3 component doc must include an **Accessibility** section covering keyboard, ARIA, and focus.

## Do

- Keep hit areas adequate on mobile.
- Announce async results via toast/live regions when the UI changes out of view.

## Don't

- Don't use `outline-none` without a visible replacement ring.
- Don't rely on color alone for status (pair with text/icon).
- Don't disable scrolling on `body` without restoring it after overlays close (Radix handles this when used correctly).

## Review checklist (short)

- [ ] Tab through the view — no traps except intentional modal traps
- [ ] Screen-reader label present for icon buttons
- [ ] Errors associated with fields
- [ ] Contrast OK for text and focus ring on surfaces used
