import type { Meta, StoryObj } from "@storybook/react-vite";

import { DatePicker, DateRangePicker, MonthPicker, YearPicker } from "./date-picker";

const meta: Meta<typeof DatePicker> = {
  title: "Patterns/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => <DatePicker className="w-64" />,
};

export const Range: Story = {
  render: () => <DateRangePicker className="w-72" />,
};

export const MonthDefault: Story = {
  render: () => <MonthPicker className="w-64" />,
};

export const YearDefault: Story = {
  render: () => <YearPicker className="w-64" />,
};
