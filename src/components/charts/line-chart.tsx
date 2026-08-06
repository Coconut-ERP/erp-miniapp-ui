import { cn } from "../../lib/utils";

export type LineChartProps = {
  /** Y values in category order */
  data: readonly number[];
  /** Optional X labels (for a11y / future ticks) */
  categories?: readonly string[];
  /** CSS stroke color (default emerald for dark cards; use `var(--primary)` for light) */
  stroke?: string;
  strokeWidth?: number;
  /** Optional area fill under the line */
  fill?: string;
  className?: string;
  /** SVG viewBox height (default 88) */
  height?: number;
  "aria-label"?: string;
};

export function LineChart({
  data,
  categories,
  stroke = "#34d399",
  strokeWidth = 2.5,
  fill,
  className,
  height = 88,
  "aria-label": ariaLabel = "Line chart",
}: LineChartProps) {
  const values = data.filter((v) => Number.isFinite(v));
  if (values.length === 0) {
    return <div data-slot="line-chart" className={cn("h-24 w-full", className)} />;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const w = 320;
  const h = height;
  const pad = 5;
  const span = max - min || 1;

  const points = values.map((value, index) => {
    const x = values.length === 1 ? w / 2 : (index / (values.length - 1)) * w;
    const y = h - ((value - min) / span) * (h - pad * 2) - pad;
    return { x, y };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath =
    fill && points.length > 0
      ? `M ${points[0]!.x},${h} L ${points.map((p) => `${p.x},${p.y}`).join(" L ")} L ${points[points.length - 1]!.x},${h} Z`
      : null;

  const desc =
    categories && categories.length === values.length
      ? values.map((v, i) => `${categories[i]}: ${v}`).join(", ")
      : undefined;

  return (
    <svg
      data-slot="line-chart"
      role="img"
      aria-label={ariaLabel}
      aria-description={desc}
      viewBox={`0 0 ${w} ${h}`}
      className={cn("h-24 w-full", className)}
      preserveAspectRatio="none"
    >
      {areaPath ? <path d={areaPath} fill={fill} opacity={0.2} /> : null}
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={polyline}
      />
    </svg>
  );
}
