"use client";

import {
  Button,
  ConfirmDialog,
  DashboardCard,
  EmptyState,
  ErrorState,
  LoadingBlock,
  LoadingRows,
  NotFoundState,
  PageHeader,
  PermissionState,
  SearchField,
  StatisticCard,
} from "@erp/miniapp-ui";
import type { DocSpec } from "@/lib/doc-types";

export const patternDocs: Record<string, DocSpec> = {
  "confirm-dialog": {
    title: "Confirm Dialog",
    description: "Destructive or costly actions with an explicit confirm step.",
    importLine: `import { ConfirmDialog, Button } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Destructive",
        code: `<ConfirmDialog
  trigger={<Button variant="destructive">Delete</Button>}
  title="Delete user?"
  description="This cannot be undone."
  confirmLabel="Delete"
  destructive
  onConfirm={() => {}}
/>`,
        render: () => (
          <ConfirmDialog
            trigger={<Button variant="destructive">Delete</Button>}
            title="Delete user?"
            description="This cannot be undone."
            confirmLabel="Delete"
            destructive
            onConfirm={() => undefined}
          />
        ),
      },
    ],
    api: ["ConfirmDialog"],
  },

  dashboard: {
    title: "Dashboard / Stats",
    description: "Statistic and dashboard card compositions for overview screens.",
    importLine: `import { StatisticCard, DashboardCard } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Statistic cards",
        code: `<div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
  <StatisticCard label="Open" value={12} hint="This week" />
  …
</div>`,
        className: "items-stretch w-full",
        render: () => (
          <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
            <StatisticCard label="Open" value={12} hint="This week" />
            <StatisticCard label="Done" value={48} />
            <StatisticCard label="Blocked" value={3} hint="Needs review" />
          </div>
        ),
      },
      {
        title: "Dashboard card",
        code: `<DashboardCard title="Approvals" description="Pending requests">…</DashboardCard>`,
        className: "items-stretch w-full max-w-md",
        render: () => (
          <DashboardCard
            title="Approvals"
            description="Pending requests"
            action={
              <Button size="sm" variant="outline">
                View all
              </Button>
            }
            className="w-full"
          >
            <p className="text-sm text-muted-foreground">3 items waiting for you.</p>
          </DashboardCard>
        ),
      },
    ],
    api: ["StatisticCard", "DashboardCard"],
  },

  "page-header": {
    title: "Page Header",
    description: "Title, description, and action cluster for a screen.",
    importLine: `import { PageHeader, Button } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<PageHeader
  title="Employees"
  description="Directory and profiles"
  actions={<Button>Add</Button>}
  className="w-full"
/>`,
        className: "items-stretch w-full",
        render: () => (
          <PageHeader
            title="Employees"
            description="Directory and profiles"
            actions={<Button>Add employee</Button>}
            className="w-full"
          />
        ),
      },
    ],
    api: ["PageHeader"],
  },

  "search-field": {
    title: "Search Field",
    description: "Search input with leading icon for list filtering.",
    importLine: `import { SearchField } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Basic",
        code: `<SearchField placeholder="Search…" className="w-full max-w-sm" />`,
        render: () => <SearchField placeholder="Search employees…" className="w-full max-w-sm" />,
      },
    ],
    api: ["SearchField"],
  },

  states: {
    title: "States",
    description: "Loading, empty, error, not-found, and permission patterns.",
    importLine: `import { LoadingRows, LoadingBlock, EmptyState, ErrorState, NotFoundState, PermissionState } from "@erp/miniapp-ui";`,
    demos: [
      {
        title: "Loading",
        code: `<LoadingRows rows={2} className="w-full max-w-md" />
<LoadingBlock label="Loading…" />`,
        className: "flex-col items-stretch w-full max-w-md gap-6",
        render: () => (
          <div className="flex w-full max-w-md flex-col gap-6">
            <LoadingRows rows={2} />
            <LoadingBlock label="Loading…" />
          </div>
        ),
      },
      {
        title: "Empty / error / not found / permission",
        code: `<EmptyState title="No records" description="Create the first one." />
<ErrorState error="Network failed" onRetry={() => {}} />
…`,
        className: "flex-col items-stretch w-full max-w-md gap-4",
        render: () => (
          <div className="flex w-full max-w-md flex-col gap-4">
            <EmptyState title="No records" description="Create the first one." />
            <ErrorState error="Network failed" onRetry={() => undefined} />
            <NotFoundState />
            <PermissionState />
          </div>
        ),
      },
    ],
    api: [
      "LoadingRows",
      "LoadingBlock",
      "EmptyState",
      "ErrorState",
      "NotFoundState",
      "PermissionState",
    ],
  },
};
