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
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
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
  icon,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  /** Optional leading media — typically a lucide icon. */
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className} size="sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <CardDescription>{label}</CardDescription>
          {icon ? (
            <div
              data-slot="statistic-card-icon"
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background/80 text-primary shadow-sm ring-1 ring-foreground/5 [&_svg]:size-4"
            >
              {icon}
            </div>
          ) : null}
        </div>
        <CardTitle className="text-3xl font-semibold tabular-nums tracking-tight md:text-4xl">{value}</CardTitle>
      </CardHeader>
      {hint ? <CardContent className="text-xs text-muted-foreground">{hint}</CardContent> : null}
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
