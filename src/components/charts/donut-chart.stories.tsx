import type { Meta, StoryObj } from "@storybook/react-vite";

import { DonutChart } from "./donut-chart";

const meta: Meta<typeof DonutChart> = {
  title: "Charts/DonutChart",
  component: DonutChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DonutChart>;

const segments = [
  { label: "Engineering", value: 45, color: "var(--primary)", className: "bg-primary" },
  { label: "Sales", value: 30, color: "#f97316", className: "bg-orange-500" },
  { label: "Support", value: 25, color: "#0d9488", className: "bg-teal-600" },
];

export const Default: Story = {
  render: () => <DonutChart segments={segments} />,
};

export const WithLegendAndCenter: Story = {
  render: () => (
    <DonutChart
      segments={segments}
      showLegend
      center={
        <>
          <span className="text-lg font-bold">100</span>
          <span className="text-xs text-muted-foreground">Total</span>
        </>
      }
    />
  ),
};
