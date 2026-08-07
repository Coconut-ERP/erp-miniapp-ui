import type { Meta, StoryObj } from "@storybook/react-vite";

import { SearchField } from "./search-field";

const meta: Meta<typeof SearchField> = {
  title: "Patterns/SearchField",
  component: SearchField,
  tags: ["autodocs"],
  args: {
    placeholder: "Search...",
  },
};

export default meta;
type Story = StoryObj<typeof SearchField>;

export const Default: Story = {
  render: (args) => <SearchField {...args} className="w-64" />,
};
