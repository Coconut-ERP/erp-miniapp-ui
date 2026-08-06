# Dashboard

## Composition

Grid of `StatisticCard` + `DashboardCard` panels. Charts: `BarChart` / `DonutChart` / `LineChart` — pass data only (see [chart-page recipe](../recipes/chart-page.md)).

```tsx
import { BarChart, Button, DashboardCard, StatisticCard } from "@erp/miniapp-ui";
import { InboxIcon } from "lucide-react";

<div className="grid gap-4 md:grid-cols-3">
  <StatisticCard label="Open" value={12} hint="This week" icon={<InboxIcon />} />
  <DashboardCard
    title="Leads"
    description="Generated vs expected"
  >
    <BarChart
      categories={["Jan", "Feb", "Mar"]}
      series={[
        { name: "Expected", data: [40, 55, 48], className: "bg-muted-foreground/30" },
        { name: "Generated", data: [32, 61, 50], className: "bg-primary" },
      ]}
      showLegend
    />
  </DashboardCard>
</div>
```