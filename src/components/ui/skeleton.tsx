import { cn } from "../../lib/utils";
import type * as React from "react";

/**
 * Pulsing placeholder shape shown while content is loading. Size it with
 * `className` to match what it stands in for.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
