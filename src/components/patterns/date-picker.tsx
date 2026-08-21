"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
