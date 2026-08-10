import type { Meta, StoryObj } from "@storybook/react-vite";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import { Button } from "./button";

const meta: Meta<typeof HoverCard> = {
  title: "UI/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@erp-ui</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm font-medium">@erp-ui</p>
        <p className="text-sm text-muted-foreground">The component library for ERP mini apps.</p>
      </HoverCardContent>
    </HoverCard>
  ),
};
