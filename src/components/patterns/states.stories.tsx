import type { Meta, StoryObj } from "@storybook/react-vite";

import { EmptyState, ErrorState, LoadingBlock, LoadingRows, NotFoundState, PermissionState } from "./states";

const meta: Meta<typeof EmptyState> = {
  title: "Patterns/States",
  component: EmptyState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const LoadingRowsExample: Story = {
  render: () => <LoadingRows className="w-72" />,
};

export const LoadingBlockExample: Story = {
  render: () => <LoadingBlock className="w-72" />,
};

export const ErrorStateExample: Story = {
  render: () => <ErrorState error="Failed to load data." className="w-96" />,
};

export const EmptyStateExample: Story = {
  render: () => (
    <EmptyState title="No employees yet" description="Add your first employee to get started." className="w-96" />
  ),
};

export const NotFoundStateExample: Story = {
  render: () => (
    <div className="w-96">
      <NotFoundState />
    </div>
  ),
};

export const PermissionStateExample: Story = {
  render: () => (
    <div className="w-96">
      <PermissionState />
    </div>
  ),
};
