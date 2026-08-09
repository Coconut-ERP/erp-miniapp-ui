# Design foundations

Design system foundation for `@erp/miniapp-ui`. Every component and pattern must follow
these docs and match the CSS variables in `src/styles/globals.css`.

See these topics in Storybook under "Foundations": Colors, Typography, Spacing, Radius,
Elevation / shadow, Animation, Responsive, Accessibility, Styling.

## Principles

1. **Tokens first** — use CSS variables / Tailwind theme colors (`bg-primary`, `text-muted-foreground`), never hard-code hex/oklch in a component.
2. **Light only** — the ERP shell embeds mini apps in light mode. Dark theme stays off unless the long-term roadmap unlocks it.
3. **One language** — the visual stack comes from `miniapp-hr` (oklch, 0.7rem radius, blue-violet primary).
4. **Icons** — use [lucide-react](https://lucide.dev); default size 16px inside buttons (`size-4`).

## Consumer import

```css
@import "tailwindcss";
@import "@erp/miniapp-ui/styles.css";
@source "../node_modules/@erp/miniapp-ui/dist";
```
