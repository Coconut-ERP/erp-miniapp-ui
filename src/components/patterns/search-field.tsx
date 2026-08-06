"use client";

import { SearchIcon } from "lucide-react";
import type * as React from "react";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";

export function SearchField({
  className,
  inputClassName,
  ...props
}: React.ComponentProps<typeof Input> & { inputClassName?: string }) {
  return (
    <div data-slot="search-field" className={cn("relative", className)}>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        className={cn("pl-8", inputClassName)}
        data-slot="search-field-input"
        {...props}
      />
    </div>
  );
}
