# Date Picker

## Purpose

Pick a single date or a date range via Popover + Calendar ([shadcn Date Picker](https://ui.shadcn.com/docs/components/base/date-picker) composition). Pass `value` / `onChange`; the library handles trigger + calendar UI.

## Import

```ts
import { DatePicker, DateRangePicker, Calendar } from "@erp/miniapp-ui";
```

## Usage

```tsx
const [date, setDate] = React.useState<Date>();

<DatePicker value={date} onChange={setDate} placeholder="Pick a date" />

{/* Date of birth — month/year dropdowns */}
<DatePicker
  value={dob}
  onChange={setDob}
  captionLayout="dropdown"
  fromYear={1960}
  toYear={new Date().getFullYear()}
  placeholder="Date of birth"
/>

{/* Range */}
const [range, setRange] = React.useState<{ from?: Date; to?: Date }>();
<DateRangePicker value={range} onChange={setRange} />
```

## Do

- Use `DatePicker` / `DateRangePicker` for forms and filters
- Use bare `Calendar` only when embedding in a custom surface
- Keep `date-fns` formatting via `displayFormat` (default `PPP`)

## Don't

- Recreate Popover + Calendar in each mini app
- Put domain validation inside the picker — keep that in the form layer

## Related

- [Calendar](../components/calendar.md)
- [Popover](../components/popover.md)
