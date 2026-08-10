import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { GripVerticalIcon } from "lucide-react";

import { SortableList } from "./sortable-list";

const meta: Meta<typeof SortableList> = {
  title: "Patterns/SortableList",
  component: SortableList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SortableList>;

function Demo() {
  const [items, setItems] = useState([
    { id: "1", label: "First task" },
    { id: "2", label: "Second task" },
    { id: "3", label: "Third task" },
  ]);

  return (
    <SortableList
      items={items}
      getId={(item) => item.id}
      onReorder={setItems}
      className="w-72"
      renderItem={(item, { dragHandleProps }) => (
        <div className="flex items-center gap-2 rounded-md border bg-card p-2 text-sm">
          <span {...dragHandleProps}>
            <GripVerticalIcon className="size-4 text-muted-foreground" />
          </span>
          {item.label}
        </div>
      )}
    />
  );
}

export const Default: Story = {
  render: () => <Demo />,
};
