"use client";

import {
  MultiSelectField,
  type MultiSelectFieldProps,
} from "../fields/multi-select-field";
import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RHFMultiSelectFieldProps<
  T extends FieldValues = FieldValues,
> extends Omit<MultiSelectFieldProps, "id" | "value" | "onChange" | "error"> {
  /** The `control` object from `useForm()`. */
  control: Control<T>;
  /** Field name path (type-safe when `T` is provided). */
  name: FieldPath<T>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * React Hook Form `Controller`-based wrapper around `MultiSelectField`.
 *
 * Handles array of string values for multiple selections.
 *
 * @example
 * ```tsx
 * <RHFMultiSelectField
 *   control={control}
 *   name="statuses"
 *   label="Statuses"
 *   options={[
 *     { value: "active", label: "Active" },
 *     { value: "inactive", label: "Inactive" },
 *     { value: "suspended", label: "Suspended" },
 *   ]}
 *   placeholder="Select statuses"
 *   maxDisplay={3}
 * />
 * ```
 */
function RHFMultiSelectFieldInner<T extends FieldValues = FieldValues>(
  { control, name, options, ...rest }: RHFMultiSelectFieldProps<T>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ control, name });

  // MultiSelect always works with arrays of strings
  const currentValue = Array.isArray(value) ? value : [];

  return (
    <MultiSelectField
      ref={ref}
      id={name}
      value={currentValue}
      onChange={onChange}
      options={options}
      error={error?.message}
      {...rest}
    />
  );
}

const RHFMultiSelectField = React.forwardRef(RHFMultiSelectFieldInner) as <
  T extends FieldValues = FieldValues,
>(
  props: RHFMultiSelectFieldProps<T> & React.RefAttributes<HTMLButtonElement>,
) => React.ReactElement;

export { RHFMultiSelectField };
