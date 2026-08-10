import type { Meta, StoryObj } from "@storybook/react-vite";

import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "./field";
import { Input } from "./input";

const meta: Meta<typeof Field> = {
  title: "UI/Field",
  component: Field,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: () => (
    <FieldGroup className="w-80">
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <FieldContent>
          <Input id="email" type="email" placeholder="you@example.com" />
          <FieldDescription>We'll never share your email.</FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Field orientation="horizontal" className="w-80">
      <FieldLabel htmlFor="name">Name</FieldLabel>
      <FieldContent>
        <Input id="name" placeholder="Jane Doe" />
      </FieldContent>
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field data-invalid className="w-80">
      <FieldLabel htmlFor="email-err">Email</FieldLabel>
      <FieldContent>
        <Input id="email-err" aria-invalid defaultValue="not-an-email" />
        <FieldError>Enter a valid email address.</FieldError>
      </FieldContent>
    </Field>
  ),
};
