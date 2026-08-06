# Animation

## Purpose

Motion hỗ trợ hierarchy và feedback, không trang trí.

## Principles

1. **Short** — micro-interactions 150–250ms; overlays 200–300ms.
2. **Purposeful** — open/close, state change, progress — not perpetual decoration.
3. **Respect reduced motion** — honor `prefers-reduced-motion` for non-essential animation.

## Library defaults

Components from the shadcn/Radix lineage use:

- `transition-all` / `transition-colors` on controls
- Focus ring transitions
- Dialog/overlay enter-exit via Radix + CSS (often `tw-animate-css` in the consumer app)

Phase 1 CSS does **not** bundle `tw-animate-css`. Consuming apps that need enter/exit keyframes should:

```css
@import "tw-animate-css";
```

(as `miniapp-hr` does) until the library optionally re-exports animation helpers.

## Do

- Animate opacity/transform on overlays.
- Keep button press feedback subtle (`active:translate-y-px` pattern already in Button).

## Don't

- Don't add looping ambient animations on data screens.
- Don't block interaction waiting for long entrance animations.
- Don't animate layout width/height when transform/opacity suffice.
