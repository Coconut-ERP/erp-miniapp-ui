import type { Meta, StoryObj } from "@storybook/react-vite";

import { ConfirmDialog } from "./confirm-dialog";
import { Button } from "../ui/button";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Patterns/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {
  args: {
    trigger: <Button variant="outline">Leave page</Button>,
    title: "Leave without saving?",
    description: "Your changes will be lost.",
  },
};

export const Destructive: Story = {
  args: {
    trigger: <Button variant="destructive">Delete item</Button>,
    title: "Delete this item?",
    description: "This action cannot be undone.",
    destructive: true,
    confirmLabel: "Delete",
  },
};
