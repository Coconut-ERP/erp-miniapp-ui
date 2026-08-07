import type { Meta, StoryObj } from "@storybook/react-vite";

import { BarChart } from "./bar-chart";

const meta: Meta<typeof BarChart> = {
  title: "Charts/BarChart",
  component: BarChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BarChart>;

export const Default: Story = {
  args: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    series: [{ name: "Sales", data: [12, 19, 8, 15, 22] }],
  },
  render: (args) => (
    <div className="w-80">
      <BarChart {...args} />
    </div>
  ),
};

export const MultiSeriesWithLegend: Story = {
  args: {
    categories: ["Q1", "Q2", "Q3", "Q4"],
    series: [
      { name: "2024", data: [10, 14, 9, 18], className: "bg-primary" },
      { name: "2025", data: [12, 16, 11, 20], className: "bg-orange-500" },
    ],
    showLegend: true,
  },
  render: (args) => (
    <div className="w-80">
      <BarChart {...args} />
    </div>
  ),
};
