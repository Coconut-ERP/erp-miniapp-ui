import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollArea } from "./scroll-area";

const meta: Meta<typeof ScrollArea> = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-40 w-64 rounded-md border p-4">
      {Array.from({ length: 20 }, (_, i) => (
        <p key={i} className="text-sm">
          Row {i + 1}
        </p>
      ))}
    </ScrollArea>
  ),
};
