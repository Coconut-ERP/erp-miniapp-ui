# Donut Chart

## Purpose

Donut / ring chart with optional center content and legend. Apps pass segment values + CSS colors.

## Import

```ts
import { DonutChart } from "@erp/miniapp-ui";
```

## Usage

```tsx
<DonutChart
  segments={[
    { label: "Engineering", value: 420, color: "#0d9488", className: "bg-teal-600" },
    { label: "Sales", value: 260, color: "#8b5cf6", className: "bg-violet-500" },
  ]}
  center={
    <>
      <span className="text-2xl font-bold tabular-nums">1,284</span>
      <span className="text-[11px] text-muted-foreground">Employees</span>
    </>
  }
  showLegend
  aria-label="Employee distribution by department"
/>
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `segments` | `{ label, value, color, className? }[]` | `color` = SVG stroke (CSS color); `className` = legend swatch |
| `center` | `ReactNode` | Content in the hole |
| `size` | `number` | Diameter px (default 144) |
| `thickness` | `number` | Ring stroke width |
| `showLegend` | `boolean` | Side legend |
| `showLegendValue` | `boolean` | Show numeric value in legend |

## Notes

SVG strokes need real CSS colors (`#0d9488`, `var(--primary)`). Use `className` only for the legend swatch.
