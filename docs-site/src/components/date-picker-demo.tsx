"use client";

import * as React from "react";
import { Calendar, DatePicker, DateRangePicker, type DateRange } from "@erp/miniapp-ui";

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border border-border"
    />
  );
}

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>();
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      className="max-w-xs"
      placeholder="Pick a date"
    />
  );
}

export function DatePickerDobDemo() {
  const [date, setDate] = React.useState<Date | undefined>();
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      className="max-w-xs"
      placeholder="Date of birth"
      captionLayout="dropdown"
      fromYear={1960}
      toYear={new Date().getFullYear()}
    />
  );
}

export function DateRangePickerDemo() {
  const [range, setRange] = React.useState<DateRange | undefined>();
  return (
    <DateRangePicker
      value={range}
      onChange={setRange}
      className="max-w-sm"
      numberOfMonths={2}
    />
  );
}
