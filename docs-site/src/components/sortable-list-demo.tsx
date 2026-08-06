"use client";

import { useState } from "react";
import { SortableList } from "@erp/miniapp-ui";
import { GripVerticalIcon } from "lucide-react";

type Stage = { id: string; name: string };

const INITIAL: Stage[] = [
  { id: "1", name: "Backlog" },
  { id: "2", name: "In progress" },
  { id: "3", name: "Review" },
  { id: "4", name: "Done" },
];

export function SortableListDemo() {
  const [stages, setStages] = useState(INITIAL);

  return (
    <SortableList
      items={stages}
      getId={(s) => s.id}
      onReorder={setStages}
      className="w-full max-w-sm"
      itemClassName="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2"
      renderItem={(stage, { dragHandleProps }) => (
        <>
          <span {...dragHandleProps} className={`${dragHandleProps.className} text-muted-foreground`}>
            <GripVerticalIcon className="size-4" />
          </span>
          <span className="flex-1 text-sm font-medium">{stage.name}</span>
        </>
      )}
    />
  );
}
