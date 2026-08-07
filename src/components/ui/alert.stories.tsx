import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alert, AlertDescription, AlertTitle } from "./alert";

const meta: Meta<typeof Alert> = {
  title: "UI/Alert",
  component: Alert,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args} className="w-96">
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>This is an informational alert message.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: { variant: "destructive" },
  render: (args) => (
    <Alert {...args} className="w-96">
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>Your changes could not be saved.</AlertDescription>
    </Alert>
  ),
};
