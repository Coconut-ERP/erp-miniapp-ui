"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Spinner } from "../ui/spinner";

export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type ComboboxProps = {
  /** Options to render in the list. When `onSearch` is set, pass the filtered/remote results here. */
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  /**
   * Search callback owned by the consumer (e.g. API / remote filter).
   * When provided, Combobox does **not** filter locally — update `options` from the parent.
   * When omitted, options are filtered client-side by `label`.
   */
  onSearch?: (query: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  /** Show a loading row while the consumer fetches results. */
  loading?: boolean;
  /** Show a clear control when a value is selected. */
  clearable?: boolean;
  className?: string;
  buttonClassName?: string;
  /** Debounce for `onSearch` in ms (default `300`). Ignored when `onSearch` is omitted. */
  searchDebounceMs?: number;
  align?: React.ComponentProps<typeof PopoverContent>["align"];
  id?: string;
  "aria-label"?: string;
};

/**
 * Searchable single-select — Popover + filter input over an options list.
 *
 * Pass `options` for the list. Omit `onSearch` for local label filtering, or
 * pass `onSearch` so the consumer can fetch/filter and feed results back via
 * `options` (use `loading` while pending).
 *
 * A11y: trigger is a button with `aria-expanded` / `aria-controls`; list is a
 * `listbox` with arrow-key navigation and Enter to select. Pair with Label via
 * `id` / `aria-label`.
 *
 * Lists longer than 100 options are virtualized: only the options near the
 * visible window are in the DOM, so thousands of options open instantly.
 *
 * Do: keep `options` in sync when using `onSearch` (parent owns the data).
 * Don't: put ERP/API logic inside the library — pass search as a callback.
 */
export function Combobox({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  onSearch,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No results.",
  disabled,
  loading = false,
  clearable = false,
  className,
  buttonClassName,
  searchDebounceMs = 300,
  align = "start",
  id,
  "aria-label": ariaLabel,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [uncontrolled, setUncontrolled] = React.useState<string | undefined>(defaultValue);
  const [query, setQuery] = React.useState("");
  const [highlight, setHighlight] = React.useState(0);
  const [selectedCache, setSelectedCache] = React.useState<ComboboxOption | null>(null);

  const listId = React.useId();
  const searchRef = React.useRef<HTMLInputElement>(null);
  const scrollToRef = React.useRef<((index: number) => void) | null>(null);
  const value = valueProp !== undefined ? valueProp : uncontrolled;

  const selectedFromOptions = options.find((o) => o.value === value);
  const selected =
    selectedFromOptions ??
    (selectedCache && selectedCache.value === value ? selectedCache : undefined);

  React.useEffect(() => {
    if (selectedFromOptions) setSelectedCache(selectedFromOptions);
  }, [selectedFromOptions]);

  const filtered = React.useMemo(() => {
    if (onSearch) return options;
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [onSearch, options, query]);

  React.useEffect(() => {
    setHighlight(0);
  }, [filtered, open]);

  React.useEffect(() => {
    if (!open || !onSearch) return;
    const handle = window.setTimeout(() => onSearch(query), searchDebounceMs);
    return () => window.clearTimeout(handle);
  }, [open, onSearch, query, searchDebounceMs]);

  React.useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => searchRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
    setQuery("");
  }, [open]);

  function setValue(next: string | undefined, option?: ComboboxOption) {
    if (valueProp === undefined) setUncontrolled(next);
    if (option) setSelectedCache(option);
    if (next === undefined) setSelectedCache(null);
    onValueChange?.(next);
  }

  function selectOption(option: ComboboxOption) {
    if (option.disabled) return;
    setValue(option.value, option);
    setOpen(false);
  }

  function clearValue(e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
    setValue(undefined);
  }

  /** Keyboard only — following the pointer would scroll the list under it. */
  function moveHighlight(next: number) {
    setHighlight(next);
    scrollToRef.current?.(next);
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveHighlight(Math.min(highlight + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveHighlight(Math.max(highlight - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const option = filtered[highlight];
      if (option) selectOption(option);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div data-slot="combobox" className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-label={ariaLabel ?? placeholder}
            disabled={disabled}
            data-empty={!selected}
            className={cn(
              "w-full justify-between font-normal data-[empty=true]:text-muted-foreground",
              buttonClassName,
            )}
          >
            <span className="truncate">{selected?.label ?? placeholder}</span>
            <span className="flex shrink-0 items-center gap-1">
              {clearable && selected ? (
                <span
                  role="button"
                  tabIndex={-1}
                  aria-label="Clear"
                  className="rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
                  onPointerDown={clearValue}
                  onClick={clearValue}
                >
                  <XIcon className="size-3.5" />
                </span>
              ) : null}
              <ChevronsUpDownIcon className="size-4 opacity-50" />
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="pointer-events-auto w-(--radix-popover-trigger-width) p-0"
          align={align}
        >
          <div className="border-b border-border p-2">
            <Input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder={searchPlaceholder}
              aria-autocomplete="list"
              aria-controls={listId}
              aria-activedescendant={
                filtered[highlight] ? `${listId}-option-${filtered[highlight].value}` : undefined
              }
            />
          </div>
          <ComboboxList
            id={listId}
            label={ariaLabel ?? placeholder}
            options={filtered}
            value={value}
            highlight={highlight}
            onHighlight={setHighlight}
            onSelect={selectOption}
            loading={loading}
            emptyText={emptyText}
            scrollToRef={scrollToRef}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/** Above this many options only the ones near the visible window are mounted. */
const VIRTUALIZE_ABOVE = 100;
/** `py-1.5` + one `text-sm` line; rows are measured, this is only the first guess. */
const OPTION_HEIGHT = 32;
/** The list's `p-1`. */
const LIST_PADDING = 4;

/** Stands in for the options a virtualized list leaves out, so the scroll height stays right. */
function Spacer({ height }: { height: number }) {
  if (height <= 0) return null;
  return <li role="presentation" aria-hidden="true" style={{ height }} />;
}

/**
 * The listbox. Its own component so the virtualizer mounts with the scroll element —
 * the popover content is portaled and mounts after `Combobox` renders.
 */
function ComboboxList({
  id,
  label,
  options,
  value,
  highlight,
  onHighlight,
  onSelect,
  loading,
  emptyText,
  scrollToRef,
}: {
  id: string;
  label: string;
  options: ComboboxOption[];
  value: string | undefined;
  highlight: number;
  onHighlight: (index: number) => void;
  onSelect: (option: ComboboxOption) => void;
  loading: boolean;
  emptyText: string;
  scrollToRef: React.RefObject<((index: number) => void) | null>;
}) {
  const listRef = React.useRef<HTMLUListElement>(null);
  const virtual = !loading && options.length > VIRTUALIZE_ABOVE;
  const virtualizer = useVirtualizer<HTMLUListElement, HTMLLIElement>({
    count: options.length,
    enabled: virtual,
    getScrollElement: () => listRef.current,
    estimateSize: () => OPTION_HEIGHT,
    overscan: 8,
    scrollMargin: LIST_PADDING,
    getItemKey: (index) => options[index]?.value ?? index,
  });

  React.useLayoutEffect(() => {
    scrollToRef.current = virtual ? (index) => virtualizer.scrollToIndex(index) : null;
    return () => {
      scrollToRef.current = null;
    };
  }, [scrollToRef, virtual, virtualizer]);

  function onWheel(event: React.WheelEvent<HTMLUListElement>) {
    // Dialog scroll-lock (react-remove-scroll) preventDefaults wheel on portaled
    // content outside the dialog — apply delta manually so the list still scrolls.
    const el = listRef.current;
    if (!el) return;
    if (el.scrollHeight <= el.clientHeight) return;
    event.preventDefault();
    event.stopPropagation();
    el.scrollTop += event.deltaY;
  }

  function renderOption(option: ComboboxOption, index: number) {
    const isSelected = option.value === value;
    const isActive = index === highlight;
    return (
      <li
        key={option.value}
        id={`${id}-option-${option.value}`}
        role="option"
        aria-selected={isSelected}
        aria-disabled={option.disabled || undefined}
        aria-setsize={virtual ? options.length : undefined}
        aria-posinset={virtual ? index + 1 : undefined}
        data-highlighted={isActive || undefined}
        data-index={virtual ? index : undefined}
        ref={virtual ? virtualizer.measureElement : undefined}
        className={cn(
          "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-sm outline-none select-none",
          isActive && "bg-accent text-accent-foreground",
          option.disabled && "pointer-events-none opacity-50",
        )}
        onMouseEnter={() => onHighlight(index)}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onSelect(option)}
      >
        <span className="truncate">{option.label}</span>
        {isSelected ? <CheckIcon className="pointer-events-none absolute right-2 size-4" /> : null}
      </li>
    );
  }

  function renderOptions() {
    if (!virtual) return options.map(renderOption);
    const items = virtualizer.getVirtualItems();
    const total = virtualizer.getTotalSize();
    const first = items[0];
    const last = items.at(-1);
    return (
      <>
        <Spacer height={first ? first.start - LIST_PADDING : 0} />
        {items.map((item) => {
          const option = options[item.index];
          return option ? renderOption(option, item.index) : null;
        })}
        <Spacer height={last ? total - (last.end - LIST_PADDING) : total} />
      </>
    );
  }

  return (
    <ul
      ref={listRef}
      id={id}
      role="listbox"
      aria-label={label}
      className="max-h-60 overflow-y-auto overscroll-contain p-1"
      onWheel={onWheel}
    >
      {loading ? (
        <li
          role="presentation"
          className="flex items-center justify-center gap-2 px-2 py-6 text-sm text-muted-foreground"
        >
          <Spinner />
          Loading…
        </li>
      ) : options.length === 0 ? (
        <li role="presentation" className="px-2 py-6 text-center text-sm text-muted-foreground">
          {emptyText}
        </li>
      ) : (
        renderOptions()
      )}
    </ul>
  );
}
