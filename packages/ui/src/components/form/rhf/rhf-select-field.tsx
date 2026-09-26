"use client";

import {
  SelectField,
  type SelectFieldProps,
  type SelectOption,
} from "../fields/select-field";
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

export interface RHFSelectFieldProps<
  T extends FieldValues = FieldValues,
  TValue = string,
> extends Omit<
  SelectFieldProps,
  "id" | "value" | "onValueChange" | "error" | "wrapperClassName" | "options"
> {
  /** The `control` object from `useForm()`. */
  control: Control<T>;
  /** Field name path (type-safe when `T` is provided). */
  name: FieldPath<T>;
  /** Options to display in the select dropdown. The option `value` type is `TValue`. */
  options: SelectOption<TValue>[];
  /** Additional class names merged onto the outer wrapper `<div>` (alias for wrapperClassName). */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * React Hook Form `Controller`-based wrapper around `SelectField`.
 *
 * Handles both single value and array value selections.
 * For array fields, uses the first element for the UI selection.
 *
 * @example
 * ```tsx
 * <RHFSelectField
 *   control={control}
 *   name="status"
 *   label="Status"
 *   options={[
 *     { value: "active", label: "Active" },
 *     { value: "inactive", label: "Inactive" },
 *   ]}
 *   placeholder="Select status"
 * />
 * ```
 */
function RHFSelectFieldInner<
  T extends FieldValues = FieldValues,
  TValue = string,
>(
  {
    control,
    name,
    options,
    className,
    ...rest
  }: RHFSelectFieldProps<T, TValue>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ control, name });

  // Handle both single values and arrays (use first element for arrays)
  const currentValue = Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

  const handleValueChange = (newValue: unknown) => {
    // If the field expects an array, wrap the value
    if (Array.isArray(value)) {
      onChange(newValue != null ? [newValue] : undefined);
    } else {
      // Pass through null/undefined from defaultOption as-is
      onChange(newValue);
    }
  };

  return (
    <SelectField
      ref={ref}
      id={name}
      value={currentValue}
      onValueChange={handleValueChange}
      options={options as unknown as SelectOption<string>[]}
      error={error?.message}
      wrapperClassName={className}
      {...rest}
    />
  );
}

const RHFSelectField = React.forwardRef(RHFSelectFieldInner) as <
  T extends FieldValues = FieldValues,
  TValue = string,
>(
  props: RHFSelectFieldProps<T, TValue> &
    React.RefAttributes<HTMLButtonElement>,
) => React.ReactElement;

export { RHFSelectField };
