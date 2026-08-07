import type { Meta, StoryObj } from "@storybook/react-vite";

import { AspectRatio } from "./aspect-ratio";

const meta: Meta<typeof AspectRatio> = {
  title: "UI/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <AspectRatio ratio={16 / 9} className="flex items-center justify-center rounded-md bg-muted">
        <span className="text-sm text-muted-foreground">16:9</span>
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <div className="w-40">
      <AspectRatio ratio={1} className="flex items-center justify-center rounded-md bg-muted">
        <span className="text-sm text-muted-foreground">1:1</span>
      </AspectRatio>
    </div>
  ),
};
