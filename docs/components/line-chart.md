# Line Chart

## Purpose

Simple line (sparkline) chart for trends inside cards. Pass a numeric series; optional fill under the line.

## Import

```ts
import { LineChart } from "@erp/miniapp-ui";
```

## Usage

```tsx
<LineChart
  data={[980, 1020, 1100, 1080, 1198, 1248]}
  categories={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
  stroke="#34d399"
  aria-label="6-month payroll trend"
/>

{/* Light surfaces */}
<LineChart data={values} stroke="var(--primary)" fill="var(--primary)" />
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `data` | `number[]` | Y values |
| `categories` | `string[]` | Optional labels (a11y description) |
| `stroke` | `string` | CSS color (default `#34d399`) |
| `strokeWidth` | `number` | Default 2.5 |
| `fill` | `string` | Optional area fill color |
| `height` | `number` | ViewBox height (default 88) |

## Accessibility

Uses `role="img"` + `aria-label`. When `categories` match `data` length, values are exposed via `aria-description`.
