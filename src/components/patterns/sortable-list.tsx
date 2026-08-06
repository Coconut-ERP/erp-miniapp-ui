"use client";

import type * as React from "react";
import { useRef, useState } from "react";
import { cn } from "../../lib/utils";

function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return [...list];
  }
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
}

export type SortableDragHandleProps = {
  draggable: true;
  role: "button";
  tabIndex: 0;
  "aria-label": string;
  "aria-grabbed": boolean;
  className?: string;
  onDragStart: (event: React.DragEvent<HTMLElement>) => void;
  onDragEnd: (event: React.DragEvent<HTMLElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
};

export type SortableListProps<T> = {
  items: readonly T[];
  getId: (item: T) => string;
  onReorder: (items: T[]) => void;
  className?: string;
  itemClassName?: string | ((ctx: { item: T; isDragging: boolean; isOver: boolean }) => string);
  /** Accessible name for the drag handle (default: "Drag to reorder") */
  dragHandleLabel?: string;
  renderItem: (
    item: T,
    ctx: {
      index: number;
      isDragging: boolean;
      isOver: boolean;
      dragHandleProps: SortableDragHandleProps;
    },
  ) => React.ReactNode;
};

/**
 * Vertical sortable list — HTML5 drag-and-drop via a handle.
 * Apps pass items + `onReorder`; no third-party DnD dependency.
 */
export function SortableList<T>({
  items,
  getId,
  onReorder,
  className,
  itemClassName,
  dragHandleLabel = "Drag to reorder",
  renderItem,
}: SortableListProps<T>) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const dragIdRef = useRef<string | null>(null);

  function indexOfId(id: string) {
    return items.findIndex((item) => getId(item) === id);
  }

  function reorder(fromId: string, toId: string) {
    const from = indexOfId(fromId);
    const to = indexOfId(toId);
    if (from < 0 || to < 0 || from === to) return;
    onReorder(moveItem(items, from, to));
  }

  function clearDrag() {
    dragIdRef.current = null;
    setDraggingId(null);
    setOverId(null);
  }

  return (
    <ul data-slot="sortable-list" className={cn("space-y-2", className)}>
      {items.map((item, index) => {
        const id = getId(item);
        const isDragging = draggingId === id;
        const isOver = overId === id && draggingId !== null && draggingId !== id;
        const resolvedItemClass =
          typeof itemClassName === "function"
            ? itemClassName({ item, isDragging, isOver })
            : itemClassName;

        const dragHandleProps: SortableDragHandleProps = {
          draggable: true,
          role: "button",
          tabIndex: 0,
          "aria-label": dragHandleLabel,
          "aria-grabbed": isDragging,
          className: "cursor-grab touch-none active:cursor-grabbing",
          onDragStart: (event) => {
            dragIdRef.current = id;
            setDraggingId(id);
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", id);
            // Improves drag ghost in some browsers
            if (event.currentTarget.parentElement) {
              event.dataTransfer.setDragImage(event.currentTarget.parentElement, 12, 12);
            }
          },
          onDragEnd: () => {
            clearDrag();
          },
          onKeyDown: (event) => {
            if (event.key === "ArrowUp" && index > 0) {
              event.preventDefault();
              onReorder(moveItem(items, index, index - 1));
            }
            if (event.key === "ArrowDown" && index < items.length - 1) {
              event.preventDefault();
              onReorder(moveItem(items, index, index + 1));
            }
          },
        };

        return (
          <li
            key={id}
            data-slot="sortable-item"
            data-dragging={isDragging || undefined}
            data-over={isOver || undefined}
            className={cn(
              isDragging && "opacity-50",
              isOver && "ring-2 ring-primary/40",
              resolvedItemClass,
            )}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              if (overId !== id) setOverId(id);
            }}
            onDragLeave={() => {
              if (overId === id) setOverId(null);
            }}
            onDrop={(event) => {
              event.preventDefault();
              const fromId = dragIdRef.current ?? event.dataTransfer.getData("text/plain");
              if (fromId) reorder(fromId, id);
              clearDrag();
            }}
          >
            {renderItem(item, { index, isDragging, isOver, dragHandleProps })}
          </li>
        );
      })}
    </ul>
  );
}
