"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon, PlusIcon, XIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../../../lib/utils";
import { Input } from "../../core/input";
import { Label } from "../../core/label";
import type { FieldProps } from "./shared";
import { Button } from "../../core/button";

export interface SortableListFieldProps extends FieldProps {
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

function SortableItem({
  id,
  text,
  index,
  onRemove,
  disabled,
}: {
  id: string;
  text: string;
  index: number;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-sm",
        isDragging && "z-50 opacity-50",
      )}
    >
      <Button
        type="button"
        size={"icon-sm"}
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon className="size-4" />
      </Button>
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
        {index + 1}
      </span>
      <span className="flex-1 truncate">{text}</span>
      <Button
        type="button"
        size={"icon-sm"}
        variant={"destructive"}
        appearance={"fade"}
        disabled={disabled}
        onClick={onRemove}
      >
        <XIcon className="size-3.5" />
      </Button>
    </div>
  );
}

const errorTextClasses = "text-xs text-destructive font-medium ml-1";
const descriptionTextClasses = "text-[10px] text-input-foreground/60 ml-1";

function SortableListFieldInner(
  {
    id,
    label,
    value,
    onChange,
    placeholder = "Type and press Enter",
    error,
    description,
    labelExtra,
    labelClassName,
    wrapperClassName,
    required,
    disabled,
  }: SortableListFieldProps,
  ref: React.Ref<HTMLInputElement>,
) {
  const [inputValue, setInputValue] = React.useState("");
  const items = value ?? [];
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const itemIds = items.map((_, i) => `item-${i}`);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = itemIds.indexOf(active.id as string);
    const newIndex = itemIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    onChange(arrayMove(items, oldIndex, newIndex));
  };

  const hasLabel = label || labelExtra || required;

  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      {hasLabel && (
        <div className="flex items-center justify-between">
          {label && (
            <Label
              htmlFor={id}
              size="md"
              variant="field"
              weight="semibold"
              required={required}
              className={labelClassName}
            >
              {label}
            </Label>
          )}
          {labelExtra}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            ref={ref}
            id={id}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            size="md"
          />
          <Button
            type="button"
            size={"icon"}
            onClick={handleAdd}
            disabled={disabled || !inputValue.trim()}
            variant={"primary"}
          >
            <PlusIcon className="size-4" />
          </Button>
        </div>
        {items.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={itemIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1.5">
                {items.map((text, index) => (
                  <SortableItem
                    key={itemIds[index]}
                    id={itemIds[index]!}
                    text={text}
                    index={index}
                    disabled={disabled}
                    onRemove={() => handleRemove(index)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {error ? (
        <p className={errorTextClasses}>{error}</p>
      ) : description ? (
        <p className={descriptionTextClasses}>{description}</p>
      ) : null}
    </div>
  );
}

const SortableListField = React.forwardRef(SortableListFieldInner);
SortableListField.displayName = "SortableListField";

export { SortableListField };
