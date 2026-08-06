import type * as React from "react";
import { cn } from "../../lib/utils";

export type DonutChartSegment = {
  label: string;
  value: number;
  /** CSS color for the ring stroke (required for SVG) */
  color: string;
  /** Tailwind class for legend swatch, e.g. `bg-teal-600` */
  className?: string;
};

export type DonutChartProps = {
  segments: readonly DonutChartSegment[];
  /** Center content (number, label, etc.) */
  center?: React.ReactNode;
  size?: number;
  thickness?: number;
  showLegend?: boolean;
  /** Show formatted value next to each legend label */
  showLegendValue?: boolean;
  className?: string;
  legendClassName?: string;
  "aria-label"?: string;
};

export function DonutChart({
  segments,
  center,
  size = 144,
  thickness = 14,
  showLegend = false,
  showLegendValue = true,
  className,
  legendClassName,
  "aria-label": ariaLabel = "Donut chart",
}: DonutChartProps) {
  const sum = segments.reduce((acc, s) => acc + Math.max(0, s.value), 0) || 1;
  const r = (size - thickness) / 2 - 4;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const view = size;

  return (
    <div
      data-slot="donut-chart"
      className={cn(
        "flex flex-col items-center gap-4 sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          role="img"
          aria-label={ariaLabel}
          viewBox={`0 0 ${view} ${view}`}
          className="size-full -rotate-90"
        >
          <circle
            cx={view / 2}
            cy={view / 2}
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={thickness}
          />
          {segments.map((segment) => {
            const len = (Math.max(0, segment.value) / sum) * c;
            const dash = `${len} ${c - len}`;
            const node = (
              <circle
                key={`${segment.label}-${segment.color}`}
                cx={view / 2}
                cy={view / 2}
                r={r}
                fill="none"
                stroke={segment.color}
                strokeWidth={thickness}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += len;
            return node;
          })}
        </svg>
        {center ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {center}
          </div>
        ) : null}
      </div>

      {showLegend ? (
        <ul className={cn("w-full space-y-2 sm:flex-1", legendClassName)}>
          {segments.map((segment) => (
            <li
              key={segment.label}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <span
                  className={cn("size-2.5 shrink-0 rounded-full", segment.className)}
                  style={segment.className ? undefined : { backgroundColor: segment.color }}
                />
                {segment.label}
              </span>
              {showLegendValue ? (
                <span className="font-semibold tabular-nums text-foreground">{segment.value}</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
