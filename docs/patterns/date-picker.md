# Date Picker

## Purpose

Pick a single date or a date range via Popover + Calendar ([shadcn Date Picker](https://ui.shadcn.com/docs/components/base/date-picker) composition). Pass `value` / `onChange`; the library handles trigger + calendar UI.

## Import

```ts
import { DatePicker, DateRangePicker, MonthPicker, WeekPicker, YearPicker } from "@erp/miniapp-ui";
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

{/* Week — value "YYYY-Www" (ISO week); clicking any day picks its Mon→Sun week */}
const [week, setWeek] = React.useState<string>(); // e.g. "2026-W12"
<WeekPicker value={week} onChange={setWeek} placeholder="Chọn tuần" />

{/* Year — value "YYYY"; decade arrows + year grid */}
const [year, setYear] = React.useState<string>();
<YearPicker value={year} onChange={setYear} fromYear={2000} toYear={2030} />
```

### Week values

`WeekPicker` normalises to an ISO week string — `YYYY-Www`, e.g. `2026-W12`:

- weeks run Monday → Sunday;
- the trigger shows `Tuần 12, 16/03–22/03/2026`;
- `YYYY` is the ISO *week-numbering* year, so `2026-W01` starts on 29/12/2025;
- values that don't exist (e.g. `2025-W53`) fall back to the placeholder.

## Do

- Use `DatePicker` / `DateRangePicker` for forms and filters
- Use bare `Calendar` only when embedding in a custom surface
- Keep `date-fns` formatting via `displayFormat` (default `PPP`)
- Use `MonthPicker` / `WeekPicker` / `YearPicker` when the form needs a period, not a day
- Store the `WeekPicker` value as-is (`"2026-W12"`) — it sorts and compares as a string

## Don't

- Recreate Popover + Calendar in each mini app
- Put domain validation inside the picker — keep that in the form layer

## Related

- [Calendar](../components/calendar.md)
- [Popover](../components/popover.md)
