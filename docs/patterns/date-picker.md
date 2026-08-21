# Date Picker

## Purpose

Pick a single date or a date range via Popover + Calendar ([shadcn Date Picker](https://ui.shadcn.com/docs/components/base/date-picker) composition). Pass `value` / `onChange`; the library handles trigger + calendar UI.

## Import

```ts
import { DatePicker, DateRangePicker, MonthPicker, YearPicker } from "@erp/miniapp-ui";
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

{/* Month — value "YYYY-MM"; year arrows + month grid */}
const [month, setMonth] = React.useState<string>();
<MonthPicker value={month} onChange={setMonth} placeholder="Select a month" />

{/* Year — value "YYYY"; decade arrows + year grid */}
const [year, setYear] = React.useState<string>();
<YearPicker value={year} onChange={setYear} fromYear={2000} toYear={2030} />
```

## Do

- Use `DatePicker` / `DateRangePicker` for forms and filters
- Use bare `Calendar` only when embedding in a custom surface
- Keep `date-fns` formatting via `displayFormat` (default `PPP`)
- Use `MonthPicker` / `YearPicker` when the form needs a period, not a day

## Don't

- Recreate Popover + Calendar in each mini app
- Put domain validation inside the picker — keep that in the form layer

## Related

- [Calendar](../components/calendar.md)
- [Popover](../components/popover.md)
