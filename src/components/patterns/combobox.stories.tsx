import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Combobox, type ComboboxOption } from "./combobox";

const FRAMEWORKS: ComboboxOption[] = [
  { value: "next", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

const meta: Meta<typeof Combobox> = {
  title: "Patterns/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  args: {
    options: FRAMEWORKS,
    placeholder: "Select framework…",
    className: "w-64",
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<string | undefined>();
    return <Combobox {...args} value={value} onValueChange={setValue} />;
  },
};

export const Clearable: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<string | undefined>("next");
    return <Combobox {...args} value={value} onValueChange={setValue} clearable />;
  },
};

/** Consumer-owned search: parent filters (or would call an API) via `onSearch`. */
export const WithSearchCallback: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<string | undefined>();
    const [query, setQuery] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState(FRAMEWORKS);

    React.useEffect(() => {
      setLoading(true);
      const t = window.setTimeout(() => {
        const q = query.trim().toLowerCase();
        setOptions(
          q ? FRAMEWORKS.filter((o) => o.label.toLowerCase().includes(q)) : FRAMEWORKS,
        );
        setLoading(false);
      }, 250);
      return () => window.clearTimeout(t);
    }, [query]);

    return (
      <Combobox
        {...args}
        options={options}
        value={value}
        onValueChange={setValue}
        onSearch={setQuery}
        loading={loading}
        searchPlaceholder="Type to search…"
        clearable
      />
    );
  },
};
