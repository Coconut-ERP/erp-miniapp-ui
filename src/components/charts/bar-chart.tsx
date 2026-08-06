import { cn } from "../../lib/utils";

export type BarChartSeries = {
  /** Legend label */
  name?: string;
  data: readonly number[];
  /** Tailwind fill classes, e.g. `bg-primary` */
  className?: string;
};

export type BarChartProps = {
  categories: readonly string[];
  series: readonly BarChartSeries[];
  /** Plot area height in px (default 160) */
  height?: number;
  /** Highlight one category index (single-series dashboards) */
  highlightIndex?: number;
  highlightClassName?: string;
  showLegend?: boolean;
  className?: string;
  /** Shared bar thickness classes */
  barClassName?: string;
  "aria-label"?: string;
};

export function BarChart({
  categories,
  series,
  height = 160,
  highlightIndex,
  highlightClassName = "bg-orange-500",
  showLegend = false,
  className,
  barClassName = "w-2 rounded-t-sm sm:w-2.5",
  "aria-label": ariaLabel = "Bar chart",
}: BarChartProps) {
  const max = Math.max(
    1,
    ...series.flatMap((s) => s.data.map((v) => (Number.isFinite(v) ? v : 0))),
  );

  return (
    <div data-slot="bar-chart" className={cn("w-full", className)}>
      {showLegend && series.some((s) => s.name) ? (
        <div className="mb-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          {series.map((s) =>
            s.name ? (
              <span key={s.name} className="inline-flex items-center gap-1.5">
                <span className={cn("size-2 rounded-full", s.className ?? "bg-primary")} />
                {s.name}
              </span>
            ) : null,
          )}
        </div>
      ) : null}

      <div
        role="img"
        aria-label={ariaLabel}
        className="flex items-end gap-2 sm:gap-3"
        style={{ height }}
      >
        {categories.map((category, index) => (
          <div key={`${category}-${index}`} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div
              className="flex w-full items-end justify-center gap-0.5"
              style={{ height: height - 28 }}
            >
              {series.map((s, seriesIndex) => {
                const value = s.data[index] ?? 0;
                const pct = Math.max(0, Math.min(100, (value / max) * 100));
                const isHighlight =
                  highlightIndex === index && series.length === 1 && Boolean(highlightClassName);
                return (
                  <div
                    key={`${s.name ?? seriesIndex}-${index}`}
                    title={`${category}: ${value}`}
                    className={cn(
                      barClassName,
                      isHighlight ? highlightClassName : (s.className ?? "bg-primary"),
                    )}
                    style={{ height: `${pct}%` }}
                  />
                );
              })}
            </div>
            <span className="truncate text-[11px] text-muted-foreground">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
