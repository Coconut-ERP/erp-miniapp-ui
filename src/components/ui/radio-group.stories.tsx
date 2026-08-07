import type { Meta, StoryObj } from "@storybook/react-vite";

import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";

const meta: Meta<typeof RadioGroup> = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="a" disabled>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" id="rd1" />
        <Label htmlFor="rd1">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" id="rd2" />
        <Label htmlFor="rd2">Option B</Label>
      </div>
    </RadioGroup>
  ),
};
