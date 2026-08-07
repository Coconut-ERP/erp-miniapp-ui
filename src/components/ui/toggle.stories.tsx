import type { Meta, StoryObj } from "@storybook/react-vite";
import { BoldIcon } from "lucide-react";

import { Toggle } from "./toggle";

const meta: Meta<typeof Toggle> = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  args: {
    children: <BoldIcon />,
    "aria-label": "Toggle bold",
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const Pressed: Story = {
  args: { defaultPressed: true },
};
