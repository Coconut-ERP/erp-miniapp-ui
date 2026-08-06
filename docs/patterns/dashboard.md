# Dashboard

## Composition

Grid of `StatisticCard` + `DashboardCard` panels.

```tsx
import { Button, DashboardCard, StatisticCard } from "@erp/miniapp-ui";
import { InboxIcon } from "lucide-react";

<div className="grid gap-4 md:grid-cols-3">
  <StatisticCard label="Open" value={12} hint="This week" icon={<InboxIcon />} />
  <DashboardCard
    title="Approvals"
    description="Pending requests"
    footer={<Button size="sm">View all</Button>}
  >
    {/* list */}
  </DashboardCard>
</div>
```
