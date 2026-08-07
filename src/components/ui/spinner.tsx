import { Loader2Icon } from "lucide-react";
import type * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Indeterminate loading indicator (spinning icon). Size via `className`
 * (`size-4` default).
 *
 * A11y: exposes `role="status"` and `aria-label="Loading"`.
 */
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
