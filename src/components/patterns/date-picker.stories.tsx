import type { Meta, StoryObj } from "@storybook/react-vite";

import { DatePicker, DateRangePicker, MonthPicker, WeekPicker, YearPicker } from "./date-picker";

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

export const WeekDefault: Story = {
  render: () => <WeekPicker className="w-72" />,
};

export const WeekSelected: Story = {
  render: () => <WeekPicker className="w-72" defaultValue="2026-W12" />,
};

export const YearDefault: Story = {
  render: () => <YearPicker className="w-64" />,
};
