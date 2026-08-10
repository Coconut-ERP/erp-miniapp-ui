import type * as React from "react";

import { cn } from "../../lib/utils";

/**
 * Single-line text input. A thin styled wrapper around the native `<input>`
 * — pass any native `type` (text, email, password, file, …).
 *
 * A11y: pair with Label (via `htmlFor`/`id`) or wrap in FieldLabel; set
 * `aria-invalid` to trigger the destructive validation style.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
