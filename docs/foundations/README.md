# Design foundations

Nền tảng Design System của `@erp/miniapp-ui`. Mọi component, pattern và recipe phải tuân theo các tài liệu này và khớp với CSS variables trong `src/styles/globals.css`.

| Topic | File |
| --- | --- |
| Colors | [colors.md](./colors.md) |
| Typography | [typography.md](./typography.md) |
| Spacing | [spacing.md](./spacing.md) |
| Radius | [radius.md](./radius.md) |
| Elevation / shadow | [elevation.md](./elevation.md) |
| Animation | [animation.md](./animation.md) |
| Responsive | [responsive.md](./responsive.md) |
| Accessibility | [accessibility.md](./accessibility.md) |

## Principles

1. **Tokens first** — dùng CSS variables / Tailwind theme colors (`bg-primary`, `text-muted-foreground`), không hard-code hex/oklch trong component.
2. **Light only** — ERP shell nhúng mini app ở chế độ sáng. Không bật dark theme trừ khi roadmap long-term mở khóa.
3. **One language** — stack visual lấy từ `miniapp-hr` (oklch, radius 0.7rem, primary blue-violet).
4. **Icons** — dùng [lucide-react](https://lucide.dev); kích thước mặc định 16px trong button (`size-4`).

## Consumer import

```css
@import "tailwindcss";
@import "@erp/miniapp-ui/styles.css";
@source "../node_modules/@erp/miniapp-ui/dist";
```
