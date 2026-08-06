import type * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "../../lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-[1.75rem]">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function FormStack({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="form-stack" className={cn("flex flex-col gap-4", className)} {...props} />;
}

export function StatisticCard({
  label,
  value,
  hint,
  trend,
  trendLabel,
  icon,
  iconClassName,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  /** Percent change, e.g. 3.64 or -4.35 */
  trend?: number;
  trendLabel?: React.ReactNode;
  icon?: React.ReactNode;
  /** Tinted icon well, e.g. `bg-emerald-50 text-emerald-700` */
  iconClassName?: string;
  className?: string;
}) {
  const trendPositive = trend !== undefined && trend >= 0;
  const trendBadge =
    trend === undefined ? null : `${trendPositive ? "+" : ""}${trend}%`;

  return (
    <Card className={cn("shadow-sm", className)} size="sm">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-2">
          {icon ? (
            <div
              data-slot="statistic-card-icon"
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg]:size-5",
                iconClassName ?? "bg-primary/10 text-primary",
              )}
            >
              {icon}
            </div>
          ) : (
            <span />
          )}
          {trendBadge ? (
            <span
              data-slot="statistic-card-trend"
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                trendPositive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700",
              )}
            >
              {trendBadge}
              {trendLabel ? <span className="sr-only"> {trendLabel}</span> : null}
            </span>
          ) : null}
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
            {value}
          </CardTitle>
          <CardDescription className="text-xs font-medium">{label}</CardDescription>
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
      </CardHeader>
    </Card>
  );
}

export function DashboardCard({
  title,
  description,
  action,
  children,
  footer,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className={footer || children ? "border-b" : undefined}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {action}
        </div>
      </CardHeader>
      {children ? <CardContent className="pt-(--card-spacing)">{children}</CardContent> : null}
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );
}
