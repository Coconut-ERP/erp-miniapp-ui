"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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

const YEAR_GRID_SIZE = 12;

function currentYear() {
  return new Date().getFullYear();
}

function defaultFromYear() {
  return currentYear() - 50;
}

function defaultToYear() {
  return currentYear() + 10;
}

function clampYear(year: number, fromYear: number, toYear: number) {
  const start = Math.min(fromYear, toYear);
  const end = Math.max(fromYear, toYear);
  return Math.min(Math.max(year, start), end);
}

function decadeStart(year: number) {
  return Math.floor(year / 10) * 10;
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

function formatMonthValue(year: number, month: MonthToken): string {
  return `${year}-${month}`;
}

function monthTriggerLabel(value: string | undefined): string | null {
  const parsed = parseMonthValue(value);
  if (!parsed) return null;
  const date = new Date(Number(parsed.year), Number(parsed.month) - 1, 1);
  return format(date, "MMM yyyy");
}

function monthShortLabel(month: MonthToken): string {
  return format(new Date(2000, Number(month) - 1, 1), "MMM");
}

export type DatePickerProps = {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  /** date-fns format string (default `PPP`) */
  displayFormat?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  align?: React.ComponentProps<typeof PopoverContent>["align"];
  /** Calendar caption: label | dropdown | dropdown-months | dropdown-years */
  captionLayout?: React.ComponentProps<typeof Calendar>["captionLayout"];
  fromYear?: number;
  toYear?: number;
  id?: string;
  "aria-label"?: string;
};

/**
 * Single-date picker — Popover + Calendar composition (shadcn Date Picker
 * pattern). Controlled via `value`/`onChange`, or uncontrolled via
 * `defaultValue`.
 */
export function DatePicker({
  value: valueProp,
  defaultValue,
  onChange,
  placeholder = "Pick a date",
  displayFormat = "PPP",
  disabled,
  className,
  buttonClassName,
  align = "start",
  captionLayout = "label",
  fromYear,
  toYear,
  id,
  "aria-label": ariaLabel,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [uncontrolled, setUncontrolled] = React.useState<Date | undefined>(defaultValue);
  const value = valueProp !== undefined ? valueProp : uncontrolled;

  function setValue(next: Date | undefined) {
    if (valueProp === undefined) setUncontrolled(next);
    onChange?.(next);
  }

  return (
    <div data-slot="date-picker" className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            data-empty={!value}
            aria-label={ariaLabel ?? placeholder}
            className={cn(
              "w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground",
              buttonClassName,
            )}
          >
            <CalendarIcon data-icon="inline-start" />
            {value ? format(value, displayFormat) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            mode="single"
            selected={value}
            captionLayout={captionLayout}
            fromYear={fromYear}
            toYear={toYear}
            onSelect={(date) => {
              setValue(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export type DateRangePickerProps = {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  displayFormat?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  align?: React.ComponentProps<typeof PopoverContent>["align"];
  numberOfMonths?: number;
  id?: string;
  "aria-label"?: string;
};

export type { DateRange };

/**
 * Date range picker — Popover + Calendar `mode="range"`. Controlled via
 * `value`/`onChange`, or uncontrolled via `defaultValue`.
 */
export function DateRangePicker({
  value: valueProp,
  defaultValue,
  onChange,
  placeholder = "Pick a date range",
  displayFormat = "LLL dd, y",
  disabled,
  className,
  buttonClassName,
  align = "start",
  numberOfMonths = 2,
  id,
  "aria-label": ariaLabel,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [uncontrolled, setUncontrolled] = React.useState<DateRange | undefined>(defaultValue);
  const value = valueProp !== undefined ? valueProp : uncontrolled;

  function setValue(next: DateRange | undefined) {
    if (valueProp === undefined) setUncontrolled(next);
    onChange?.(next);
  }

  const label =
    value?.from && value.to
      ? `${format(value.from, displayFormat)} – ${format(value.to, displayFormat)}`
      : value?.from
        ? format(value.from, displayFormat)
        : null;

  return (
    <div data-slot="date-range-picker" className={cn("w-full", className)}>
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
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            numberOfMonths={numberOfMonths}
            onSelect={setValue}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

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
 * Month period picker — Popover with year prev/next nav and a 3×4 month grid.
 * Value is `"YYYY-MM"` (e.g. `"2026-03"`), or `undefined` when empty.
 *
 * A11y: trigger button with `aria-label`; month cells are buttons in a grid;
 * year nav has labeled previous/next controls.
 *
 * Do: use for filters/forms that need a calendar month, not a day.
 * Don't: use for day-level dates — use `DatePicker` instead.
 */
export function MonthPicker({
  value: valueProp,
  defaultValue,
  onChange,
  placeholder = "Select a month",
  disabled,
  className,
  buttonClassName,
  align = "start",
  fromYear = defaultFromYear(),
  toYear = defaultToYear(),
  id,
  "aria-label": ariaLabel,
}: MonthPickerProps) {
  const minYear = Math.min(fromYear, toYear);
  const maxYear = Math.max(fromYear, toYear);
  const [open, setOpen] = React.useState(false);
  const [uncontrolled, setUncontrolled] = React.useState<string | undefined>(defaultValue);
  const value = valueProp !== undefined ? valueProp : uncontrolled;
  const parsed = parseMonthValue(value);
  const [viewYear, setViewYear] = React.useState(() =>
    clampYear(parsed ? Number(parsed.year) : currentYear(), minYear, maxYear),
  );

  React.useEffect(() => {
    if (!open) return;
    const next = parseMonthValue(value);
    setViewYear(clampYear(next ? Number(next.year) : currentYear(), minYear, maxYear));
  }, [open, value, minYear, maxYear]);

  function setValue(next: string | undefined) {
    if (valueProp === undefined) setUncontrolled(next);
    onChange?.(next);
  }

  const label = monthTriggerLabel(value);
  const canPrev = viewYear > minYear;
  const canNext = viewYear < maxYear;

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
              "w-full justify-between font-normal data-[empty=true]:text-muted-foreground",
              buttonClassName,
            )}
          >
            <span className="truncate">{label ?? placeholder}</span>
            <CalendarIcon data-icon="inline-end" className="text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align={align}>
          <div className="mb-2 flex items-center justify-between gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Previous year"
              disabled={!canPrev}
              onClick={() => setViewYear((y) => clampYear(y - 1, minYear, maxYear))}
            >
              <ChevronLeftIcon />
            </Button>
            <div className="text-sm font-medium tabular-nums">{viewYear}</div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Next year"
              disabled={!canNext}
              onClick={() => setViewYear((y) => clampYear(y + 1, minYear, maxYear))}
            >
              <ChevronRightIcon />
            </Button>
          </div>
          <div
            role="listbox"
            aria-label="Month"
            className="grid grid-cols-4 gap-1"
          >
            {MONTH_VALUES.map((month) => {
              const selected =
                parsed?.year === String(viewYear) && parsed.month === month;
              return (
                <Button
                  key={month}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  variant={selected ? "default" : "ghost"}
                  size="sm"
                  className="h-9 font-normal"
                  onClick={() => {
                    setValue(formatMonthValue(viewYear, month));
                    setOpen(false);
                  }}
                >
                  {monthShortLabel(month)}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

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
 * Year period picker — Popover with decade prev/next nav and a year grid.
 * Value is `"YYYY"` (e.g. `"2026"`), or `undefined` when empty.
 *
 * A11y: trigger button with `aria-label`; year cells are buttons in a grid;
 * decade nav has labeled previous/next controls.
 *
 * Do: use for year-only filters (fiscal year, report year).
 * Don't: use for month or day selection — use `MonthPicker` / `DatePicker`.
 */
export function YearPicker({
  value: valueProp,
  defaultValue,
  onChange,
  placeholder = "Select a year",
  disabled,
  className,
  buttonClassName,
  align = "start",
  fromYear = defaultFromYear(),
  toYear = defaultToYear(),
  id,
  "aria-label": ariaLabel,
}: YearPickerProps) {
  const minYear = Math.min(fromYear, toYear);
  const maxYear = Math.max(fromYear, toYear);
  const [open, setOpen] = React.useState(false);
  const [uncontrolled, setUncontrolled] = React.useState<string | undefined>(defaultValue);
  const value = valueProp !== undefined ? valueProp : uncontrolled;
  const selectedYear = isYearValue(value) ? Number(value) : null;
  const [viewStart, setViewStart] = React.useState(() =>
    decadeStart(clampYear(selectedYear ?? currentYear(), minYear, maxYear)),
  );

  React.useEffect(() => {
    if (!open) return;
    const y = isYearValue(value) ? Number(value) : currentYear();
    setViewStart(decadeStart(clampYear(y, minYear, maxYear)));
  }, [open, value, minYear, maxYear]);

  function setValue(next: string | undefined) {
    if (valueProp === undefined) setUncontrolled(next);
    onChange?.(next);
  }

  const label = selectedYear !== null ? String(selectedYear) : null;
  const years = Array.from({ length: YEAR_GRID_SIZE }, (_, i) => viewStart + i);
  const canPrev = viewStart > minYear;
  const canNext = viewStart + YEAR_GRID_SIZE - 1 < maxYear;
  const rangeLabel = `${Math.max(viewStart, minYear)} – ${Math.min(viewStart + YEAR_GRID_SIZE - 1, maxYear)}`;

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
              "w-full justify-between font-normal data-[empty=true]:text-muted-foreground",
              buttonClassName,
            )}
          >
            <span className="truncate">{label ?? placeholder}</span>
            <CalendarIcon data-icon="inline-end" className="text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align={align}>
          <div className="mb-2 flex items-center justify-between gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Previous years"
              disabled={!canPrev}
              onClick={() => setViewStart((s) => Math.max(minYear, s - YEAR_GRID_SIZE))}
            >
              <ChevronLeftIcon />
            </Button>
            <div className="text-sm font-medium tabular-nums">{rangeLabel}</div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Next years"
              disabled={!canNext}
              onClick={() =>
                setViewStart((s) =>
                  Math.min(decadeStart(maxYear), s + YEAR_GRID_SIZE),
                )
              }
            >
              <ChevronRightIcon />
            </Button>
          </div>
          <div role="listbox" aria-label="Year" className="grid grid-cols-4 gap-1">
            {years.map((year) => {
              const outOfRange = year < minYear || year > maxYear;
              const selected = selectedYear === year;
              return (
                <Button
                  key={year}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  variant={selected ? "default" : "ghost"}
                  size="sm"
                  disabled={outOfRange}
                  className="h-9 font-normal tabular-nums"
                  onClick={() => {
                    setValue(String(year));
                    setOpen(false);
                  }}
                >
                  {year}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
