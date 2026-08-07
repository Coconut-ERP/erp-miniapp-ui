import type { Meta, StoryObj } from "@storybook/react-vite";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const SmallTrigger: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm" className="w-40">
        <SelectValue placeholder="Small select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="one">One</SelectItem>
        <SelectItem value="two">Two</SelectItem>
      </SelectContent>
    </Select>
  ),
};
