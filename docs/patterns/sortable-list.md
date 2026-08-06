# Sortable list

## Purpose

Vertical list reordering via HTML5 drag-and-drop (handle only). No third-party DnD package.

## Import

```ts
import { SortableList } from "@erp/miniapp-ui";
```

## Usage

```tsx
<SortableList
  items={stages}
  getId={(s) => s.id}
  onReorder={setStages}
  itemClassName="flex items-center gap-2 rounded-lg border px-3 py-2"
  renderItem={(stage, { dragHandleProps }) => (
    <>
      <span {...dragHandleProps}>
        <GripVerticalIcon className="size-4 text-muted-foreground" />
      </span>
      <span className="flex-1">{stage.name}</span>
    </>
  )}
/>
```

## Props

| Prop | Notes |
| --- | --- |
| `items` | Controlled list |
| `getId` | Stable id per item |
| `onReorder` | Called with new order after drop / ↑↓ on handle |
| `renderItem` | Receive `dragHandleProps` — spread onto the grip control |
| `dragHandleLabel` | a11y label (default `"Drag to reorder"`) |

## Accessibility

- Drag handle is focusable; **ArrowUp / ArrowDown** moves the focused item.
- Prefer putting `dragHandleProps` on a dedicated control, not the whole row (avoids fighting inputs/buttons).
