import type { Meta, StoryObj } from "@storybook/react-vite";

import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => <Slider defaultValue={[50]} className="w-64" />,
};

export const Range: Story = {
  render: () => <Slider defaultValue={[25, 75]} className="w-64" />,
};

export const Disabled: Story = {
  render: () => <Slider defaultValue={[40]} disabled className="w-64" />,
};
