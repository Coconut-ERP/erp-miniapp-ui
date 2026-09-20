import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrendingUpIcon } from "lucide-react";

import { DashboardCard, FormStack, PageHeader, StatisticCard } from "./layout";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

const meta: Meta<typeof PageHeader> = {
  title: "Patterns/Layout",
  component: PageHeader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const PageHeaderExample: Story = {
  render: () => (
    <PageHeader
      title="Employees"
      description="Manage your team's records."
      actions={<Button size="sm">Add employee</Button>}
    />
  ),
};

export const FormStackExample: Story = {
  render: () => (
    <FormStack className="w-72">
      <Field>
        <FieldLabel htmlFor="ls-name">Name</FieldLabel>
        <Input id="ls-name" />
      </Field>
      <Field>
        <FieldLabel htmlFor="ls-email">Email</FieldLabel>
        <Input id="ls-email" type="email" />
      </Field>
    </FormStack>
  ),
};

export const StatisticCardExample: Story = {
  render: () => (
    <StatisticCard
      label="Visits"
      value="2,301"
      hint="Just now"
      trend={35}
      icon={<TrendingUpIcon />}
      className="w-64"
    />
  ),
};

export const DashboardCardExample: Story = {
  render: () => (
    <DashboardCard title="Recent activity" description="Last 7 days" className="w-80">
      <p className="text-sm text-muted-foreground">Widget body content.</p>
    </DashboardCard>
  ),
};
