"use client";

import { AspectRatio as AspectRatioPrimitive } from "radix-ui";
import type * as React from "react";

/**
 * Constrains a child (typically an image or video) to a fixed width/height
 * ratio via the `ratio` prop, avoiding layout shift while content loads.
 */
function AspectRatio({ ...props }: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
