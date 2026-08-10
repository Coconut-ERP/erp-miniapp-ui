import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Project settings</CardTitle>
        <CardDescription>Manage your project preferences.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm">
            ⋮
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Card body content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const Small: Story = {
  args: { size: "sm" },
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Compact card</CardTitle>
        <CardDescription>Tighter padding via size="sm".</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Body content.</p>
      </CardContent>
    </Card>
  ),
};
