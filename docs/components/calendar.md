# Calendar

## Purpose

Month calendar for selecting a day or date range. Built on [react-day-picker](https://react-day-picker.js.org/). Prefer [`DatePicker`](../patterns/date-picker.md) for the Popover trigger UX.

## Import

```ts
import { Calendar } from "@erp/miniapp-ui";
```

## Example

```tsx
const [date, setDate] = React.useState<Date>();

<Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
```

## Props

Extends `DayPicker` props (`mode`, `selected`, `onSelect`, `captionLayout`, …). Extra:

| Prop | Notes |
| --- | --- |
| `buttonVariant` | Nav button variant (default `ghost`) |

## Accessibility

Keyboard navigation and ARIA for the grid come from react-day-picker. Pair with a labeled trigger when used inside a popover.

## Related

- [Date Picker](../patterns/date-picker.md)
- [Popover](./popover.md)
