"use client";

import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  SortableListField,
  type SortableListFieldProps,
} from "../fields/sortable-list-field";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RHFSortableListFieldProps<
  T extends FieldValues = FieldValues,
> extends Omit<
  SortableListFieldProps,
  "id" | "value" | "onChange" | "error" | "wrapperClassName"
> {
  /** The `control` object from `useForm()`. */
  control: Control<T>;
  /** Field name path — must point to a `string[]` field. */
  name: FieldPath<T>;
  /** Additional class names merged onto the outer wrapper `<div>`. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * React Hook Form `Controller`-based wrapper around `SortableListField`.
 *
 * Manages a `string[]` value with drag-and-drop reordering.
 *
 * @example
 * ```tsx
 * <RHFSortableListField
 *   control={control}
 *   name="marketing.features"
 *   label="Features"
 *   placeholder="Type a feature and press Enter..."
 * />
 * ```
 */
function RHFSortableListFieldInner<T extends FieldValues = FieldValues>(
  { control, name, className, ...rest }: RHFSortableListFieldProps<T>,
  ref: React.Ref<HTMLInputElement>,
) {
  const {
    field: { ref: fieldRef, value, onChange },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <SortableListField
      ref={(node) => {
        fieldRef(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      id={name}
      value={value ?? []}
      onChange={onChange}
      error={error?.message}
      wrapperClassName={className}
      {...rest}
    />
  );
}

const RHFSortableListField = React.forwardRef(RHFSortableListFieldInner) as <
  T extends FieldValues = FieldValues,
>(
  props: RHFSortableListFieldProps<T> & React.RefAttributes<HTMLInputElement>,
) => React.ReactElement;

export { RHFSortableListField };
