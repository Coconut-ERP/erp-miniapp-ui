"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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
 * Single-date picker — Popover + Calendar composition (shadcn Date Picker pattern).
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
 * Date range picker — Popover + Calendar `mode="range"`.
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
