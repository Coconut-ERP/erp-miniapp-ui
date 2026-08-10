import type { Meta, StoryObj } from "@storybook/react-vite";

import { LineChart } from "./line-chart";

const meta: Meta<typeof LineChart> = {
  title: "Charts/LineChart",
  component: LineChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LineChart>;

export const Default: Story = {
  args: {
    data: [10, 14, 9, 18, 22, 16, 25],
  },
  render: (args) => (
    <div className="w-80">
      <LineChart {...args} stroke="var(--primary)" />
    </div>
  ),
};

export const WithAreaFill: Story = {
  args: {
    data: [5, 8, 6, 12, 10, 15],
  },
  render: (args) => (
    <div className="w-80">
      <LineChart {...args} stroke="var(--primary)" fill="var(--primary)" />
    </div>
  ),
};
