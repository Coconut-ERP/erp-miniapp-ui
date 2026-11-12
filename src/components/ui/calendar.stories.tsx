import type { Meta, StoryObj } from "@storybook/react-vite";

import { enUS } from "react-day-picker/locale";

import { Calendar } from "./calendar";

const meta: Meta<typeof Calendar> = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: { mode: "single" },
};

/** Vietnamese is the default; pass `locale` to render another language. */
export const EnglishLocale: Story = {
  args: { mode: "single", locale: enUS },
};

export const Range: Story = {
  args: { mode: "range" },
};
