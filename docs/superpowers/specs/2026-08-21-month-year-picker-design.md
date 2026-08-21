# MonthPicker & YearPicker — Design Spec

Date: 2026-08-21  
Status: approved (pending implementation plan)

## Goal

Add two period pickers for ERP mini-app forms/filters: select a month or a year without picking a day. Keep `DatePicker` / `DateRangePicker` unchanged.

## Decisions (locked)

| Topic | Choice |
| --- | --- |
| Shape | New `MonthPicker` + `YearPicker` (not DatePicker modes) |
| Location | Same file as DatePicker: `src/components/patterns/date-picker.tsx` |
| Month value | `string \| undefined` — `"YYYY-MM"` (e.g. `"2026-03"`) |
| Year value | `string \| undefined` — `"YYYY"` (e.g. `"2026"`) |
| UI | Popover + Select dropdown(s) (not calendar month grid) |
| Clearable | Out of scope for v1 |

## Public API

### Shared props (mirror DatePicker)

- `value` / `defaultValue` / `onChange`
- `placeholder`, `disabled`, `className`, `buttonClassName`
- `align` (PopoverContent)
- `fromYear`, `toYear` — bound the year Select list (sensible defaults, e.g. current year ± range)
- `id`, `aria-label`

### MonthPicker

- `value`: `"YYYY-MM"` or `undefined`
- Trigger label: human-readable month+year via `date-fns` (e.g. `MMM yyyy`); empty → placeholder
- Popover body: month Select (01–12) + year Select (`fromYear`…`toYear`) side by side
- Changing either Select updates the string immediately when both parts are known
- Close Popover once a complete month+year is selected

### YearPicker

- `value`: `"YYYY"` or `undefined`
- Trigger label: the year string; empty → placeholder
- Popover body: year Select only
- On select → `onChange(year)` and close Popover

### Non-goals (v1)

- Range month/year pickers
- `clearable` prop (consumers can call `onChange(undefined)`)
- Locale prop beyond default `date-fns` / runtime locale for month names
- Changing Calendar / DatePicker day selection behavior

## Implementation sketch

1. Helpers: parse/format `"YYYY-MM"` / `"YYYY"`; build year option list from `fromYear`/`toYear`.
2. Reuse existing `Button`, `Popover`, `Select*` primitives — no new UI primitives.
3. Controlled/uncontrolled pattern identical to `DatePicker`.
4. Export from `patterns/index.ts` and `src/index.ts`.
5. JSDoc on each export; stories `MonthDefault` / `YearDefault` in `date-picker.stories.tsx`.
6. Short usage notes in `docs/patterns/date-picker.md`.
7. `CHANGELOG.md` Unreleased → Added.

## Verification

- `npm run typecheck`
- Storybook: MonthPicker / YearPicker stories render; select updates trigger label; no console errors

## Out of scope follow-ups

- YearPicker decade paging UI
- Month range / fiscal period presets
- `clearable` affordance on the trigger
