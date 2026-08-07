"use client";

import { AlertCircleIcon, InboxIcon, LockIcon, SearchXIcon, type LucideIcon } from "lucide-react";
import type * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { Skeleton } from "../ui/skeleton";
import { Spinner } from "../ui/spinner";
import { cn } from "../../lib/utils";

/** Stack of skeleton placeholders for a loading list (`rows` count). */
export function LoadingRows({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  );
}

/**
 * Centered spinner + label for a loading section.
 *
 * A11y: rendered with `role="status"` so the loading state is announced.
 */
export function LoadingBlock({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn("flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground", className)}
    >
      <Spinner className="size-5" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

/**
 * Destructive Alert for a failed request, showing the error message and an
 * optional Retry button. Pass the caught `error` (Error, string, or
 * unknown) and it derives a display message.
 */
export function ErrorState({
  error,
  title = "Something went wrong",
  onRetry,
  className,
}: {
  error?: unknown;
  title?: string;
  onRetry?: () => void;
  className?: string;
}) {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "Please try again.";

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <span>{message}</span>
        {onRetry ? (
          <Button size="sm" variant="outline" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}

/**
 * Empty composition for a list/section with no data: icon, title,
 * optional description, and optional action. NotFoundState and
 * PermissionState are thin presets of this.
 */
export function EmptyState({
  icon: Icon = InboxIcon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Empty className={cn("border border-dashed bg-card", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>
      {action ? <EmptyContent>{action}</EmptyContent> : null}
    </Empty>
  );
}

/** EmptyState preset for a missing/removed resource (404-style). */
export function NotFoundState({
  title = "Not found",
  description = "This resource does not exist or was removed.",
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return <EmptyState icon={SearchXIcon} title={title} description={description} action={action} />;
}

/** EmptyState preset for a permission-denied / access-restricted view. */
export function PermissionState({
  title = "Permission required",
  description = "You do not have access to this action.",
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return <EmptyState icon={LockIcon} title={title} description={description} action={action} />;
}
