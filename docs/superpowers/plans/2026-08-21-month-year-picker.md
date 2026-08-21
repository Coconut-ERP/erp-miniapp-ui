# MonthPicker & YearPicker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `MonthPicker` (`"YYYY-MM"`) and `YearPicker` (`"YYYY"`) as Popover + Select patterns beside the existing DatePicker, without changing day/range pickers.

**Architecture:** Extend `src/components/patterns/date-picker.tsx` with two new components that reuse `Button`, `Popover`, and `Select*`. File-local pure helpers parse/format period strings and build year lists. Controlled/uncontrolled state mirrors `DatePicker`. Export via patterns barrel and `src/index.ts`; document with JSDoc, Storybook stories, and `docs/patterns/date-picker.md`.

**Tech Stack:** React 19, Radix Select/Popover (via library primitives), `date-fns` for trigger labels, TypeScript, Storybook 10. No unit-test runner in this package — verification is `npm run typecheck` + Storybook render.

**Spec:** `docs/superpowers/specs/2026-08-21-month-year-picker-design.md`

## Global Constraints

- Value formats locked: month `"YYYY-MM"`, year `"YYYY"` (string | undefined)
- UI locked: Popover + Select dropdown(s), not calendar grids
- Location locked: same file `date-picker.tsx` — do not create separate month/year picker files
- Do not change `DatePicker` / `DateRangePicker` behavior
- No `clearable` prop in v1
- Public API only via `src/index.ts` barrel
- Commit message style: `feat(miniapp-ui): …` / `docs(…): …` (conventional commits with scope)

---

## File map

| File | Role |
| --- | --- |
| `src/components/patterns/date-picker.tsx` | Add helpers + `MonthPicker` + `YearPicker` |
| `src/components/patterns/index.ts` | Re-export new components + prop types |
| `src/index.ts` | Public barrel re-exports |
| `src/components/patterns/date-picker.stories.tsx` | `MonthDefault` / `YearDefault` stories |
| `docs/patterns/date-picker.md` | Usage for month/year values |
| `CHANGELOG.md` | Unreleased → Added |

---

### Task 1: Period helpers + MonthPicker

**Files:**
- Modify: `src/components/patterns/date-picker.tsx`

**Interfaces:**
- Consumes: `Button`, `Popover`/`PopoverContent`/`PopoverTrigger`, `Select`/`SelectTrigger`/`SelectValue`/`SelectContent`/`SelectItem` from `../ui/*`
- Produces: `MonthPicker`, `MonthPickerProps`; helpers used by Task 2: `DEFAULT_FROM_YEAR`, `DEFAULT_TO_YEAR`, `yearOptions(from, to)`, `parseYearValue(value)`, `isYearValue(value)`

- [ ] **Step 1: Add Select import and file-local helpers**

At the top of `date-picker.tsx`, extend imports:

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
```

After the existing imports / before `DatePickerProps`, add:

```tsx
const MONTH_VALUES = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
] as const;

type MonthToken = (typeof MONTH_VALUES)[number];

function currentYear() {
  return new Date().getFullYear();
}

function defaultFromYear() {
  return currentYear() - 50;
}

function defaultToYear() {
  return currentYear() + 10;
}

function yearOptions(fromYear: number, toYear: number): string[] {
  const start = Math.min(fromYear, toYear);
  const end = Math.max(fromYear, toYear);
  const years: string[] = [];
  for (let y = end; y >= start; y -= 1) {
    years.push(String(y));
  }
  return years;
}

function isMonthValue(value: string | undefined): value is `${number}-${MonthToken}` {
  return typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

function isYearValue(value: string | undefined): value is `${number}` {
  return typeof value === "string" && /^\d{4}$/.test(value);
}

function parseMonthValue(value: string | undefined): { year: string; month: MonthToken } | null {
  if (!isMonthValue(value)) return null;
  const [year, month] = value.split("-") as [string, MonthToken];
  return { year, month };
}

function formatMonthValue(year: string, month: string): string {
  return `${year}-${month}`;
}

function monthTriggerLabel(value: string | undefined): string | null {
  const parsed = parseMonthValue(value);
  if (!parsed) return null;
  const date = new Date(Number(parsed.year), Number(parsed.month) - 1, 1);
  return format(date, "MMM yyyy");
}
```

- [ ] **Step 2: Append `MonthPickerProps` + `MonthPicker` at end of file (before any trailing exports if none)**

```tsx
export type MonthPickerProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  align?: React.ComponentProps<typeof PopoverContent>["align"];
  fromYear?: number;
  toYear?: number;
  id?: string;
  "aria-label"?: string;
};

/**
 * Month period picker — Popover with month + year Selects.
 * Value is `"YYYY-MM"` (e.g. `"2026-03"`), or `undefined` when empty.
 *
 * A11y: trigger button with `aria-label`; Selects provide listbox semantics.
 *
 * Do: use for filters/forms that need a calendar month, not a day.
 * Don't: use for day-level dates — use `DatePicker` instead.
 */
export function MonthPicker({
  value: valueProp,
  defaultValue,
  onChange,
  placeholder = "Pick a month",
  disabled,
  className,
  buttonClassName,
  align = "start",
  fromYear = defaultFromYear(),
  toYear = defaultToYear(),
  id,
  "aria-label": ariaLabel,
}: MonthPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [uncontrolled, setUncontrolled] = React.useState<string | undefined>(defaultValue);
  const value = valueProp !== undefined ? valueProp : uncontrolled;
  const parsed = parseMonthValue(value);

  const [draftMonth, setDraftMonth] = React.useState<string | undefined>(parsed?.month);
  const [draftYear, setDraftYear] = React.useState<string | undefined>(parsed?.year);

  React.useEffect(() => {
    if (!open) return;
    const next = parseMonthValue(value);
    setDraftMonth(next?.month);
    setDraftYear(next?.year);
  }, [open, value]);

  function setValue(next: string | undefined) {
    if (valueProp === undefined) setUncontrolled(next);
    onChange?.(next);
  }

  function commitIfComplete(month: string | undefined, year: string | undefined) {
    if (!month || !year) return;
    setValue(formatMonthValue(year, month));
    setOpen(false);
  }

  const label = monthTriggerLabel(value);
  const years = yearOptions(fromYear, toYear);

  return (
    <div data-slot="month-picker" className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            data-empty={!label}
            aria-label={ariaLabel ?? placeholder}
            className={cn(
              "w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground",
              buttonClassName,
            )}
          >
            <CalendarIcon data-icon="inline-start" />
            {label ?? <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align={align}>
          <div className="flex gap-2">
            <Select
              value={draftMonth}
              onValueChange={(month) => {
                setDraftMonth(month);
                commitIfComplete(month, draftYear);
              }}
            >
              <SelectTrigger className="w-[8.5rem]" aria-label="Month">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTH_VALUES.map((month) => {
                  const date = new Date(2000, Number(month) - 1, 1);
                  return (
                    <SelectItem key={month} value={month}>
                      {format(date, "MMMM")}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Select
              value={draftYear}
              onValueChange={(year) => {
                setDraftYear(year);
                commitIfComplete(draftMonth, year);
              }}
            >
              <SelectTrigger className="w-[6.5rem]" aria-label="Year">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck (MonthPicker only — YearPicker not required yet)**

Run: `npm run typecheck`  
Expected: PASS (no errors). If Select `onValueChange` typing differs, adjust to the project's Select signature (`(value: string) => void`).

- [ ] **Step 4: Commit**

```bash
git add src/components/patterns/date-picker.tsx
git commit -m "$(cat <<'EOF'
feat(miniapp-ui): add MonthPicker with YYYY-MM value

Popover + month/year Selects; closes when both parts are set.
EOF
)"
```

---

### Task 2: YearPicker

**Files:**
- Modify: `src/components/patterns/date-picker.tsx`

**Interfaces:**
- Consumes: helpers from Task 1 (`defaultFromYear`, `defaultToYear`, `yearOptions`, `isYearValue`)
- Produces: `YearPicker`, `YearPickerProps`

- [ ] **Step 1: Append `YearPickerProps` + `YearPicker` after `MonthPicker`**

```tsx
export type YearPickerProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  align?: React.ComponentProps<typeof PopoverContent>["align"];
  fromYear?: number;
  toYear?: number;
  id?: string;
  "aria-label"?: string;
};

/**
 * Year period picker — Popover with a year Select.
 * Value is `"YYYY"` (e.g. `"2026"`), or `undefined` when empty.
 *
 * A11y: trigger button with `aria-label`; Select provides listbox semantics.
 *
 * Do: use for year-only filters (fiscal year, report year).
 * Don't: use for month or day selection — use `MonthPicker` / `DatePicker`.
 */
export function YearPicker({
  value: valueProp,
  defaultValue,
  onChange,
  placeholder = "Pick a year",
  disabled,
  className,
  buttonClassName,
  align = "start",
  fromYear = defaultFromYear(),
  toYear = defaultToYear(),
  id,
  "aria-label": ariaLabel,
}: YearPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [uncontrolled, setUncontrolled] = React.useState<string | undefined>(defaultValue);
  const value = valueProp !== undefined ? valueProp : uncontrolled;
  const label = isYearValue(value) ? value : null;
  const years = yearOptions(fromYear, toYear);

  function setValue(next: string | undefined) {
    if (valueProp === undefined) setUncontrolled(next);
    onChange?.(next);
  }

  return (
    <div data-slot="year-picker" className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            data-empty={!label}
            aria-label={ariaLabel ?? placeholder}
            className={cn(
              "w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground",
              buttonClassName,
            )}
          >
            <CalendarIcon data-icon="inline-start" />
            {label ?? <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align={align}>
          <Select
            value={label ?? undefined}
            onValueChange={(year) => {
              setValue(year);
              setOpen(false);
            }}
          >
            <SelectTrigger className="w-[8rem]" aria-label="Year">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`  
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/patterns/date-picker.tsx
git commit -m "$(cat <<'EOF'
feat(miniapp-ui): add YearPicker with YYYY value

Popover + year Select; closes on selection.
EOF
)"
```

---

### Task 3: Public barrel exports

**Files:**
- Modify: `src/components/patterns/index.ts`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `MonthPicker`, `YearPicker`, `MonthPickerProps`, `YearPickerProps` from `./date-picker`
- Produces: same symbols on `@erp/miniapp-ui` public API

- [ ] **Step 1: Update `src/components/patterns/index.ts` date-picker export block**

Replace the date-picker export with:

```ts
export {
  DatePicker,
  DateRangePicker,
  MonthPicker,
  YearPicker,
  type DatePickerProps,
  type DateRangePickerProps,
  type DateRange,
  type MonthPickerProps,
  type YearPickerProps,
} from "./date-picker";
```

- [ ] **Step 2: Update `src/index.ts`**

In the patterns value export list, add `MonthPicker` and `YearPicker` next to `DatePicker` / `DateRangePicker`.

In the patterns type export list, add `MonthPickerProps` and `YearPickerProps`.

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`  
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/patterns/index.ts src/index.ts
git commit -m "$(cat <<'EOF'
feat(miniapp-ui): export MonthPicker and YearPicker from barrel
EOF
)"
```

---

### Task 4: Stories, pattern docs, changelog

**Files:**
- Modify: `src/components/patterns/date-picker.stories.tsx`
- Modify: `docs/patterns/date-picker.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: public components from Task 3
- Produces: Storybook stories + docs for consumers

- [ ] **Step 1: Update stories**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";

import { DatePicker, DateRangePicker, MonthPicker, YearPicker } from "./date-picker";

const meta: Meta<typeof DatePicker> = {
  title: "Patterns/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => <DatePicker className="w-64" />,
};

export const Range: Story = {
  render: () => <DateRangePicker className="w-72" />,
};

export const MonthDefault: Story = {
  render: () => <MonthPicker className="w-64" />,
};

export const YearDefault: Story = {
  render: () => <YearPicker className="w-64" />,
};
```

- [ ] **Step 2: Update `docs/patterns/date-picker.md`**

Add to Import:

```ts
import { DatePicker, DateRangePicker, MonthPicker, YearPicker } from "@erp/miniapp-ui";
```

Add Usage examples:

```tsx
{/* Month — value "YYYY-MM" */}
const [month, setMonth] = React.useState<string>();
<MonthPicker value={month} onChange={setMonth} placeholder="Pick a month" />

{/* Year — value "YYYY" */}
const [year, setYear] = React.useState<string>();
<YearPicker value={year} onChange={setYear} fromYear={2000} toYear={2030} />
```

Add under Do: use `MonthPicker` / `YearPicker` when the form needs a period, not a day.

- [ ] **Step 3: Update `CHANGELOG.md` under `[Unreleased]`**

```md
## [Unreleased]

### Added

- `MonthPicker` — Popover + month/year Selects; value `"YYYY-MM"`
- `YearPicker` — Popover + year Select; value `"YYYY"`
```

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`  
Expected: PASS

- [ ] **Step 5: Storybook smoke (manual)**

Run: `npm run storybook`  
Open `Patterns/DatePicker` → `MonthDefault` and `YearDefault`:
- Trigger shows placeholder when empty
- Selecting month+year updates label (`MMM yyyy`) and closes
- Selecting year updates label and closes
- No console errors

- [ ] **Step 6: Commit**

```bash
git add src/components/patterns/date-picker.stories.tsx docs/patterns/date-picker.md CHANGELOG.md
git commit -m "$(cat <<'EOF'
docs(miniapp-ui): document MonthPicker and YearPicker
EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| MonthPicker `"YYYY-MM"` | Task 1 |
| YearPicker `"YYYY"` | Task 2 |
| Popover + Select UI | Tasks 1–2 |
| Shared props (value/onChange/fromYear/toYear/…) | Tasks 1–2 |
| Same file as DatePicker | Tasks 1–2 |
| DatePicker unchanged | Tasks 1–2 (append only) |
| Barrel exports | Task 3 |
| JSDoc + stories | Tasks 1–2 (JSDoc) + Task 4 (stories) |
| `docs/patterns/date-picker.md` | Task 4 |
| CHANGELOG | Task 4 |
| typecheck + Storybook verify | Tasks 1–4 |
| No clearable v1 | Tasks 1–2 (omitted) |

## Self-review notes

- No placeholders / TBDs in steps
- Types consistent: `MonthPickerProps` / `YearPickerProps` / `onChange?: (value: string | undefined) => void`
- Package has no unit-test runner; verification gates use `npm run typecheck` + Storybook as specified in the design doc
